<template>
  <section>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Sign in</button>
    </form>
    <p>{{ message }}</p>
  </section>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')
const message = ref('')

const login = async () => {
  if (!email.value || !password.value) {
    message.value = 'Missing credentials'
    return
  }

  message.value = 'JWT login should be wired to backend auth endpoint.'
}
</script>
