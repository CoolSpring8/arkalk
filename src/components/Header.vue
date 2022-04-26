<script lang="ts" setup>
import { toggleDark } from '~/composables'

const { t } = useI18n()

const helpModalOpen = ref(false)
</script>

<template>
  <header sticky flex justify-between items-center p-4>
    <RouterLink flex items-center gap-1 to="/">
      <div i-carbon-calculator-check inline-block text-3xl />

      <div text-sm>
        <p>
          Arkalk
        </p>

        <p>
          <em opacity-50>{{ t('intro.desc') }}</em>
        </p>
      </div>
    </RouterLink>
    <div text-xl>
      <button class="icon-btn mx-2 !outline-none" :title="t('button.help')" @click="() => helpModalOpen = true">
        <div i-carbon-help />
      </button>
      <HelpModal :is-open="helpModalOpen" @update:is-open="(value) => helpModalOpen = value" />
      <a class="icon-btn mx-2" href="https://github.com/CoolSpring8/arkalk" target="_blank" title="GitHub">
        <div i-carbon-logo-github />
      </a>
      <button class="icon-btn mx-2 !outline-none" :title="t('button.toggle_dark')" @click="toggleDark()">
        <div i="carbon-sun dark:carbon-moon" />
      </button>
    </div>
  </header>
</template>
