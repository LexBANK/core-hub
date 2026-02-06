<template>
  <div :class="['app-shell', { dark: isDark }]">
    <header>
      <nav>
        <NuxtLink v-for="item in links" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
      </nav>
      <div class="actions">
        <button @click="toggleLocale">{{ locale.toUpperCase() }}</button>
        <button @click="isDark = !isDark">{{ isDark ? '☀️' : '🌙' }}</button>
      </div>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const locale = useState<'en' | 'ar'>('locale', () => 'en')
const isDark = useState('dark', () => true)

const labels = {
  en: ['Home', 'Docs', 'Status', 'Contact', 'Login', 'Dashboard', 'Discussions'],
  ar: ['الرئيسية', 'التوثيق', 'الحالة', 'تواصل', 'تسجيل الدخول', 'لوحة التحكم', 'النقاشات']
}

const routes = ['/', '/docs', '/status', '/contact', '/login', '/dashboard', '/discussions']

const links = computed(() => routes.map((to, i) => ({ to, label: labels[locale.value][i] })))

const toggleLocale = () => {
  locale.value = locale.value === 'en' ? 'ar' : 'en'
}
</script>

<style scoped>
.app-shell { min-height: 100vh; background: #f7f7f7; color: #111; }
.app-shell.dark { background: #0f172a; color: #e2e8f0; }
header { display: flex; justify-content: space-between; padding: 1rem; border-bottom: 1px solid #334155; }
nav { display: flex; gap: 0.75rem; }
a { color: inherit; text-decoration: none; }
main { padding: 1.5rem; }
button { margin-left: 0.5rem; }
</style>
