<script setup lang="ts">
import { useRecruitStore } from '~/stores/recruit'

const recruitStore = useRecruitStore()

onMounted(() => recruitStore.fetchData())
</script>

<template>
  <div shadow="2xl indigo-100" rounded-3xl mx-auto w-200 p="x-20 y-20">
    <Loading v-if="recruitStore.isFetching" />

    <div v-else>
      <div v-if="recruitStore.data">
        <TagCombobox />
        <div border-1 border-stone my-10 />
        <DisplayCard />
      </div>

      <div v-else>
        Data Unavailable
      </div>
    </div>
  </div>
</template>
