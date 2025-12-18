<template>
  <div class="p-4">
    <div>
      Role: {{ user.data.value?.Role }}
    </div>
    <div>
      Hello {{ user.data.value?.Name }}
    </div>
  </div>
  <div class="border border-gray-30 rounded-lg max-w-lg">
    <div class="p-3">
        Rosters:
    </div>
    <div v-for="rooms in tableData">
      <div v-for="(students, periodName) in rooms">
        <UTable :columns="[{
          accessorKey: 'student',
          header: String(periodName)
        }]" :data="students" class="border border-gray-30 rounded-lg max-w-lg"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import type { Room } from '~~/schema/room';
import type { Period } from '~~/schema/period';
import type { User } from '~~/schema/user';

const { data } = useAuth()

console.log("/api/users/" + data!.value!.id_token ) 

const user = await useFetch<User>("/api/users/" + data!.value!.id_token )
const school = user.data.value?.schoolId!

const rooms = await useFetch<Room[]>('/api/rooms/' + school,  {
  default: () => [] // Ensures passes.data is never undefined
});

const roomMap: { [roomId: string]: { [ periodName: string ]: {student: string}[] } } = {}

for(const room of rooms.data.value! ){
  const periods = await useFetch<Period[]>('/api/periods/' + room.roomId,  {
  default: () => [] // Ensures passes.data is never undefined
  });

  roomMap[room.roomId] = {};

  periods.data.value.forEach( period => {
    roomMap[room.roomId]![period.periodName] = period.Students.map( student => ({student: student}) );
  });
  
}

const tableData = ref(roomMap)

console.log(user)

</script>

<style>

</style>