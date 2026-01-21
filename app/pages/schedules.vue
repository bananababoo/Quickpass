<template>
  <div>    
    <UModal v-model:open="isOpen" title="New Schedule">

      <UButton label="New Schedule" color="primary"/>

      <template #body>
        <UForm :state="formState" @submit="submit()" id="new-schedule-form">
          <UFormField required>
            <UInput v-model="formState.scheduleName" placeholder="Schedule Name"/>
          </UFormField>

          <div v-for="(_, index) in formState.times">
            <UFormField :label="'Time ' + (index+1) + ':'">
              <!-- @vue-ignore no idea why but this fixes-->
              <UInputTime v-model="formState.times[index].time"/>
              <!-- @vue-ignore no idea why but this fixes-->  
                <UInputNumber v-model="formState.times[index].durationMinutes" placeholder="Duration of period (min)" :min="0" :increment="false" :decrement="false" :format-options="durationFormat" required/>
            </UFormField>
          </div>
          <UButton label="Add Time" color="secondary" @click="formState.times.push({time: new Time(8,0,0), durationMinutes: 60})"/>
        </UForm>
      </template>

      <template #footer>
        <UButton label="Cancel" color="neutral" @click="isOpen = false"/>
        <UButton label="Submit" type="submit" color="primary" form="new-schedule-form" :disabled="!formState.scheduleName.length"/>
      </template>

    </UModal>

    <div v-for="schedule in existingSchedules">
      <UCard>
        <template #header>
          {{ schedule.scheduleName }}
          <UButton v-if="!schedule.isActive" icon="heroicons:check" color="primary" size="sm" class="ml-2">
            Set Active Schedule
          </UButton>  
        </template>

        <div v-for="timeEntry in schedule.times" class="p-2 border-b border-gray-200 last:border-0">
          <div>
            Time: {{ timeEntry.time }}
          </div>
          <div v-if="timeEntry.durationMinutes !== undefined">
            Duration: {{ timeEntry.durationMinutes }} minutes
          </div>
        </div>

      </UCard>    

    </div>
  </div>

</template>

<script lang="ts" setup>
import { Time } from '@internationalized/date'
import type { ServerSchedule } from '../../schema/schedule';

const isOpen = ref(false);

const durationFormat = {
  style: 'unit',
  unit: 'minute',
  unitDisplay: 'short'
}

type TimeEntry = {
  time: Time,
  durationMinutes?: number
}

const formState = reactive({
  scheduleName: '',
  times: [{time: new Time(8,0,0)}] as TimeEntry[]
})

const {
  data: existingSchedules,
  refresh: getScheduleData
} = await useFetch<ServerSchedule[]>('/api/schedule/' + 'default-school')

function submit(){
  if(formState.scheduleName.trim() === '' || formState.times.length === 0){
    console.log("No Name");
    return;
  }

  console.log("Submitting schedule: " + formState.scheduleName + " with times: " + formState.times);
  $fetch('/api/schedule/create', {
    method: 'POST',
    body: {
      schoolId: 'default-school',
      scheduleName: formState.scheduleName,
      times: formState.times.map( timeEntry => ({time: timeEntry.time.toString(), durationMinutes: timeEntry.durationMinutes}))
    }
  }).then( (response) => {
    console.log("Schedule created:", response);
    getScheduleData();
  }).catch( (error) => {
    console.error("Error creating schedule:", error);
  });
  
  resetFormState();
  isOpen.value = false;

}

function resetFormState(){
  formState.scheduleName = '';
  formState.times = [{time: new Time(8,0,0)}];
}

</script>

<style>

</style>