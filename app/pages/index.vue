<template>
  <div>
    <UTable :data="data" />
  </div>
</template>

<script lang="ts" setup>

const passes = await useFetch('/api/passes')
const data = ref(passes.data.value)

</script>

<style>

</style>