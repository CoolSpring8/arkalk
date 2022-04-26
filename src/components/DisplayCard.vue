<script lang="ts" setup>
import { useRecruitStore } from '~/stores/recruit'

const recruitStore = useRecruitStore()
</script>

<template>
  <div flex flex-col gap-3>
    <div v-for="[combination, characters] in recruitStore.matches" :key="combination">
      <div text-center>
        {{ combination }}
      </div>
      <div inline-flex gap-2 flex-wrap>
        <span
          v-for="character in characters" :key="character.name"
          :class="{ 'text-orange': character.rarity === 4, 'text-red': character.rarity === 5 }"
        >
          {{ character.name }}
        </span>
      </div>
    </div>
  </div>
</template>
