<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: '明日方舟公开招募计算器 | Arkalk',
  meta: [
    { name: 'description', content: 'Arknights Recruitment Calculator' },
  ],
})
</script>

<template>
  <RouterView />
</template>
