<script lang="ts" setup>
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/vue'
import { useRecruitStore } from '~/stores/recruit'

const recruitStore = useRecruitStore()

const input = ref()

// 加载时聚焦到输入框
useFocus(input, { initialValue: true })

// Esc清空当前输入和所有已选择的标签，也会关闭下拉框
const clearInput = (e: KeyboardEvent) => {
  recruitStore.query = ''
  recruitStore.selectedTags.length = 0
  e.preventDefault()
}
onKeyStroke('Escape', clearInput, { target: input })
onKeyStroke('Escape', clearInput)
</script>

<template>
  <Combobox v-model="recruitStore.selectedTags" :multiple="true">
    <div flex gap-2 justify-center>
      <div v-for="tag in recruitStore.selectedTags" :key="tag">
        <p text-xl text-slate>
          {{ tag }}
        </p>
      </div>
      <ComboboxInput
        ref="input" bg-gray-50 w-40 h-10 text-2xl
        autocomplete="off"
        @change="recruitStore.query = ($event.currentTarget as HTMLInputElement).value"
      />
    </div>

    <ComboboxOptions>
      <ComboboxOption v-for="tag in recruitStore.hits" :key="tag.name" :value="tag.name">
        {{ tag.name }}
      </ComboboxOption>
    </ComboboxOptions>
  </Combobox>
</template>
