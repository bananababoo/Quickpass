<template>
  <Suspense>
    <div>
      <div class="p-4">
        <div>
          Role: {{ user.data.value?.Role }}
        </div>
        <div>
          Hello {{ user.data.value?.Name }}
        </div>

      </div>
      <div class="flex flex-column gap-4 p-6 align-items: flex-start">
        <div class="border border-gray-30 rounded-lg w-fit">
            <div class="p-3">
                Active Passes:
            </div>
            <UTable :data="tableRows" :columns="activeColumns"/>
        </div>
        <div class="border border-gray-30 rounded-lg max-w-lg">
            <div class="p-3">
                Expired Passes:
            </div>
            <UTable :data="expiredTableRows" :columns="expiredColumns"/>
        </div>
        <div class="border border-gray-30 rounded-lg max-w-lg">
          <div v-if="error?.statusCode == 404">
            No active schedule
          </div>
          <div v-else-if="activePeriod">
            {{ activePeriod }}
          </div>
        </div>
      </div>
    </div>
  </Suspense>
</template>

<script lang="ts" setup>
import type { User } from '~~/schema/user'
import type { Room } from '~~/schema/room'
import type { Pass } from '~~/schema/pass'
import type { ClientSchedule } from '~~/schema/schedule'
import type { StudentPass } from '~~/schema/studentPass'

import { useTimeAgo } from '@vueuse/core'
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { ta } from 'zod/locales'

type PassColumn = {
  passId: string;
  cardScannedTime: string;
}

const UButton = resolveComponent('UButton')

let passes = await useFetch<Pass[]>('/api/passes',  {
  default: () => [] // Ensures passes.value is never undefined
});

console.info('Hello');
const passData = ref<Pass[]>(passes.data.value);

watch(passData, (newPassData) => {
  if(newPassData) {
    newPassData.forEach( (entry => {
      if(entry.expired == true) return;
      const passTime = new Date(entry.cardScannedTime);
      const currentTime = new Date();
      const diffInMs = currentTime.getTime() - passTime.getTime();
      const diffInHours = diffInMs / (1000 * 60 * 60);
      if (diffInHours >= 1) {
          entry.expired = true;
      } else {
          entry.expired = false;
      }
      })
    )
    newPassData.sort((a, b) => {
      const timeA = new Date(a.cardScannedTime).getTime();
      const timeB = new Date(b.cardScannedTime).getTime();
      return timeB - timeA; 
    })
  }
}, { immediate: true }
);

const mapUserCache = new Map<string, {firstName: string, lastName: string}>();

const expiredColumns: TableColumn<PassColumn>[] = [
  {
    accessorKey: 'passId',
    header: 'Pass ID',
  },
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'roomName',
    header: 'Room'
  },
  {
    accessorKey: 'cardScannedTime',
    header: 'Issued',
  }
]

const activeColumns: TableColumn<PassColumn>[] = [
  {
    accessorKey: 'passId',
    header: 'Pass ID',
  },
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'roomName',
    header: 'Room'
  },
  {
    accessorKey: 'cardScannedTime',
    header: 'Issued',
  },
  {
    id: 'expireButton',
    header: 'Expire',
    cell: ({ row }) => {
      return h(UButton, {
        size: 'lg',
        color: 'error',
        variant: 'solid',
        icon: 'heroicons:x-mark-20-solid',
        onClick: async () => {
          console.info('Expiring pass: ' + row.original.passId);
          await $fetch('/api/pass/expire', {
            method: 'POST',
            body: {
              passId: row.original.passId
            }
          })
          passData.value = passData.value!.map((entry => {
            if(entry.passId === row.original.passId){
              entry.expired = true;
              return entry;
            } else {
              return entry;
            }
          }))
        }
      },
      )
    }
  }
]

const tableRows = ref<{passId: string, cardScannedTime: string, name: string}[]>([]);
const expiredTableRows = ref<{passId: string, cardScannedTime: string, name: string}[]>([]);


watchEffect(async () => {
  if(!passData.value) return
  const activeEntries = passData.value.filter((entry) => !entry.expired);
  const rows = await Promise.all(activeEntries.map(async (entry) => {
    const timeAgo = useTimeAgo(new Date(entry.cardScannedTime));
    var name;
    if(mapUserCache.get(entry.passCardId) == undefined){
      const studentData = (await $fetch<StudentPass>('/api/passcards/' + entry.passCardId));
      name = studentData.firstName + " " + studentData.lastName;
    }else {
      const cached = mapUserCache.get(entry.passCardId)!;
      name = cached.firstName + " " + cached.lastName;
    }
    const roomName = (await $fetch<Room>('/api/room/' + entry.roomId)).roomName;

    return {
      passId: entry.passId,
      cardScannedTime: timeAgo.value,
      roomName: roomName,
      name: name
    }
  }))
  tableRows.value = rows;
})

watchEffect(async () => {
  if(!passData.value) return
  const expiredEntries = passData.value!.filter((entry) => {
    const passTime = new Date(entry.cardScannedTime);
    const currentTime = new Date();
    const diffInMs = currentTime.getTime() - passTime.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return entry.expired && diffInHours <= 48;
  })
  const rows = await Promise.all(expiredEntries.map(async (entry) => {
  const timeAgo = useTimeAgo(new Date(entry.cardScannedTime));
  var name;
  if(mapUserCache.get(entry.passCardId) == undefined){
    const studentData = (await $fetch<StudentPass>('/api/passcards/' + entry.passCardId));
    name = studentData.firstName + " " + studentData.lastName;
  }else {
    const cached = mapUserCache.get(entry.passCardId)!;
    name = cached.firstName + " " + cached.lastName;
  }  return {
  passId: entry.passId,
  cardScannedTime: timeAgo.value,
  name: name
  }
  }))
  expiredTableRows.value = rows;
})


const { data } = useAuth()

//console.log("/api/users/" + data!.value!.id_token ) 

const user = await useFetch<User>("/api/users/" + data!.value!.id_token )

const { open } = useWebSocket('wss://y2ulx9tdak.execute-api.us-east-2.amazonaws.com/production/', {
  immediate: false,
  async onMessage(ws, event) {
    // We parse the number of connected users from the message
    // The message might be a string or a Blob
    console.log("Received WebSocket message: " + event.data)
    fetchPasses()
  },
  async onConnected(ws) {
    console.log('WS Connected', ws);
  },
  async onDisconnected(ws, event) {
    console.error('WS Disconnected. Code:', event.code, 'Reason:', event.reason);
  },
  // 👈 AND THIS: To catch any unexpected client errors
  async onError(ws, event) {
    console.error('WS Connection Error:', event);
  }
});


onMounted(() => {
  open()
  console.log('WebSocket connection opened supposedly');
})

async function fetchPasses(){
  passData.value = await $fetch('/api/passes')
}

const { data: schedule, error } = await useAsyncData('schedule', () => 
  $fetch<ClientSchedule>('/api/schedule/active/' + user.data.value?.schoolId)!!
);


const activePeriod = computed(() => {
  if (error.value  || !schedule.value?.times?.length) return null;

  const toMinutes = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.getHours() * 60 + d.getMinutes();
  };

  // Sort chronologically
  const sorted = [...schedule.value.times].sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Find first period that hasn't ended yet
  const found = sorted.find(p => {
    const startTime = toMinutes(p.time);
    const endTime = startTime + p.durationMinutes;
    return endTime > currentMinutes;
  });

  // Return found period or fall back to the first one (morning logic)
  return found || sorted[0];
});

</script>

<style>

</style>