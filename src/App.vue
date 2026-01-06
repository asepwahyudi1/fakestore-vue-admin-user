<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import AppLayout from '@/layouts/AppLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import UiToast from '@/components/ui/UiToast.vue'
const route = useRoute()
const { initAuth } = useAuth()

onMounted(async () => {
  await initAuth()
})

const layout = computed(() => {
  if (route.meta.layout === 'auth') return 'auth'
  if (route.meta.layout === 'admin') return 'admin'
  return 'app'
})
</script>

<template>
  <UiToast />
  <AppLayout v-if="layout === 'app'">
    <router-view />
  </AppLayout>
  <AuthLayout v-else-if="layout === 'auth'">
    <router-view />
  </AuthLayout>
  <AdminLayout v-else-if="layout === 'admin'">
    <router-view />
  </AdminLayout>
</template>

<style scoped></style>
