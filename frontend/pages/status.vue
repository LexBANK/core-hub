<template>
  <section>
    <h1>API Status</h1>
    <p>{{ status }}</p>
  </section>
</template>

<script setup lang="ts">
const status = ref('Operational')
</script>
