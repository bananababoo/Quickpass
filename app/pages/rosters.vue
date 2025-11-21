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
    
  </div>
</template>

<script lang="ts" setup>

import type { User } from '~~/schema/user'

const passes = await useFetch('/api/passes')

const formatted = passes.data.value!.map((entry) => {
  return {
    passid: entry.passId,
    timestamp: new Date(entry.timestamp).toLocaleString()
  }
})

const tableData = ref(formatted)
const { data } = useAuth()

console.log("/api/users/" + data!.value!.id_token ) 

const user = await useFetch<User>("/api/users/" + data!.value!.id_token )

console.log(user)

</script>

<style>

</style>