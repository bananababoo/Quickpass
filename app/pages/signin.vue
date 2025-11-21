<script lang="ts" setup>
useHead({
  script:[
    {
      src: 'https://apis.google.com/js/platform.js?onload=renderButton',
      async: true,
      defer: true
    }
  ]
})

definePageMeta({
  auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' }
})

const { signIn } = useAuth()

</script>

<template>
  <div>
    <p>Sign in pls</p>
    <div id="my-signin2"></div>
    <button @click="signIn('google')" class="g-signin2">
      Sign in with Google
    </button>
  </div>
</template>

<style>

</style>