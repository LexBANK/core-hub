<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
    <div class="w-full max-w-3xl bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl">
      <h1 class="text-xl font-semibold mb-3 text-right">
        corehub.nexsus
        <span class="text-xs text-slate-400 block">بداية انطلاقة لعالم جديد من الذكاء</span>
      </h1>
      <ChatWindow />
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatWindow from "./components/ChatWindow.vue";
</script>
