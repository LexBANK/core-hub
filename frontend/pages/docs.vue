<template>
  <section>
    <h1>Documentation</h1>
    <input v-model="query" placeholder="Search docs" />
    <ul>
      <li v-for="item in filtered" :key="item">{{ item }}</li>
    </ul>
  </section>
</template>

<script setup lang="ts">
const query = ref('')
const docs = ['Quickstart', 'Authentication', 'SDK generation', 'Monitoring']
const filtered = computed(() => docs.filter((d) => d.toLowerCase().includes(query.value.toLowerCase())))
</script>
