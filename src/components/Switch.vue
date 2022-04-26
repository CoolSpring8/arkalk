<script setup lang="ts">
import { Switch } from '@headlessui/vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <Switch
    :model-value="props.modelValue" :class="props.modelValue ? 'bg-teal-900' : 'bg-teal-700'"
    class="relative inline-flex flex-shrink-0 h-[38px] w-[74px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
    @update:model-value="(value) => emit('update:modelValue', value)"
  >
    <span class="sr-only">Use setting</span>
    <span
      aria-hidden="true" :class="props.modelValue ? 'translate-x-9' : 'translate-x-0'"
      class="pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200"
    />
  </Switch>
</template>
