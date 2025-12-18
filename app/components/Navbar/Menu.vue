<script setup lang="ts">
import type { User } from '~~/schema/user';

const items = ref([
    { title: 'Home', href: '/' },
    { title: 'Passes', href: '/passes', showIfAuth: true },
])

const { data } = useAuth()

//console.info("logged in: " + data.value.id_token != null)

const loggedIn = computed(() =>  data.value?.id_token != null);

let user: User
if(data.value?.id_token != null){
    user = await useFetch<User>("/api/users/" + data.value.id_token ).data.value as User
}

</script>

<template>
    <div>
        <div class="flex flex-row gap-2 p-4 items-center">
            <header class="">
                <p class="font-bold">
                    QuickPass
                </p>
            </header>
            <div v-for='(item, index) in items' :key='item.title'>
                    <UButton color="secondary" class="text-lg" v-if="!item.showIfAuth || loggedIn">
                        <NuxtLink :to="item.href" class="text-lg">
                            {{ item.title }}
                        </NuxtLink>
                    </UButton>
            </div>
            <div v-if="user != null && user.Role === 'admin'">
                <UButton color="primary" class="text-lg">
                    <NuxtLink to="/rosters" class="text-lg">
                        Rosters
                    </NuxtLink>
                </UButton>
            </div>
            <div v-if="user != null && user.Role === 'admin'">
                <UButton color="primary" class="text-lg">
                    <NuxtLink to="/schedules" class="text-lg">
                        Schedules
                    </NuxtLink>
                </UButton>
            </div>
            <div v-if="!loggedIn">
                <UButton @click="useAuth().signIn('google')" color="primary" class="text-lg">
                    <NuxtLink to="/" class="text-lg">
                        Sign In
                    </NuxtLink>
                </UButton>
            </div>
            <div v-if="loggedIn">
                <UButton @click="useAuth().signOut()" color="error" class="text-lg">
                    <NuxtLink to="/" class="text-lg">
                        Sign Out
                    </NuxtLink>
                </UButton>
            </div>
        </div>
    </div>
</template>