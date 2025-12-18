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
        <div class="border border-gray-30 rounded-lg max-w-lg">
            <div class="p-3">
                Active Passes:
            </div>
            <UTable :data="tableData" :columns="activeColumns"/>
        </div>
        <div class="border border-gray-30 rounded-lg max-w-lg">
            <div class="p-3">
                Expired Passes:
            </div>
            <UTable :data="expiredTableData" :columns="expiredColumns"/>
        </div>
      </div>
    </div>
  </Suspense>
</template>

<script lang="ts" setup>
import type { User } from '~~/schema/user'
import type { Pass } from '~~/schema/pass'
import { useTimeAgo } from '@vueuse/core'
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

type PassColumn = {
  passId: string;
  timestamp: string;
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
      const passTime = new Date(entry.timestamp);
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
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeB - timeA; 
    })
  }
}, { immediate: true }
);

const expiredColumns: TableColumn<PassColumn>[] = [
  {
    accessorKey: 'passId',
    header: 'Pass ID',
  },
  {
    accessorKey: 'timestamp',
    header: 'Issued',
  }
]

const activeColumns: TableColumn<PassColumn>[] = [
  {
    accessorKey: 'passId',
    header: 'Pass ID',
  },
  {
    accessorKey: 'timestamp',
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

const tableData = computed(() => {
  return passData.value!.filter((entry) => !entry.expired).map((entry) => {
    const timeAgo = useTimeAgo(new Date(entry.timestamp));
    return {
      passId: entry.passId,
      timestamp: timeAgo.value
    }
  })
})

const expiredTableData = computed(() => {
  return passData.value!.filter((entry) => {
    const passTime = new Date(entry.timestamp);
    const currentTime = new Date();
    const diffInMs = currentTime.getTime() - passTime.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return entry.expired && diffInHours <= 48;
  }
  ).map((entry) => {
    const timeAgo = useTimeAgo(new Date(entry.timestamp));
    return {
      passId: entry.passId,
      timestamp: timeAgo.value
    }
  })
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

</script>

<style>

</style>