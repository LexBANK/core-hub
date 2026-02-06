<template>
  <div class="flex flex-col h-[480px]">
    <div class="flex-1 overflow-y-auto space-y-3 pr-1">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        class="flex"
        :class="msg.role === 'user' ? 'justify-start' : 'justify-end'"
      >
        <div
          class="max-w-[80%] px-3 py-2 rounded-2xl text-sm"
          :class="
            msg.role === 'user'
              ? 'bg-blue-600 text-white rounded-bl-sm'
              : 'bg-slate-800 text-slate-100 rounded-br-sm'
          "
        >
          {{ msg.content }}
        </div>
      </div>
    </div>

    <form class="mt-3 flex gap-2" @submit.prevent="send">
      <input
        v-model="input"
        type="text"
        class="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="اكتب رسالتك هنا..."
      />
      <button
        type="submit"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-sm rounded-xl text-white disabled:bg-slate-700"
        :disabled="loading"
      >
        {{ loading ? "...جارٍ الإرسال" : "إرسال" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

type Message = { role: "user" | "assistant"; content: string };

const messages = ref<Message[]>([{ role: "assistant", content: "مرحباً بك في corehub.nexsus 👋" }]);
const input = ref("");
const loading = ref(false);

const send = async () => {
  if (!input.value.trim() || loading.value) return;

  const userText = input.value.trim();
  messages.value.push({ role: "user", content: userText });
  input.value = "";
  loading.value = true;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText }),
    });

    const data = (await res.json().catch(() => ({ reply: "حدث خطأ غير متوقع." }))) as {
      reply?: string;
      error?: string;
    };

    messages.value.push({ role: "assistant", content: data.reply ?? data.error ?? "حدث خطأ غير متوقع." });
  } catch {
    messages.value.push({ role: "assistant", content: "تعذر الاتصال بالخادم حالياً." });
  } finally {
    loading.value = false;
  }
};
</script>
