<template>
  <section>
    <h1>Discussions</h1>
    <ul>
      <li v-for="d in discussions" :key="d.title">
        <a :href="d.url" target="_blank" rel="noopener">{{ d.title }}</a>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
const discussions = ref([{ title: 'Community discussion placeholder', url: 'https://github.com/LexBANK/core-hub/discussions' }])
</script>
