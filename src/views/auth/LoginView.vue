<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { BaseButton, BaseInput } from '@/components/base'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { useI18n, useSeo } from '@/composables'
import { useVuelidate } from '@/plugins/vuelidate'
import { required, helpers } from '@/plugins/vuelidate'
import { ROUTE_NAMES } from '@/constants'

const router = useRouter()
const { login, isLoading } = useAuth()
const toast = useToast()
const { t } = useI18n()

useSeo({
  title: t('login'),
  description: t('signInToAccount'),
  keywords: 'login, sign in, account, fakestore',
  robots: 'noindex, nofollow',
})

const formData = ref({
  username: '',
  password: '',
})

const rules = {
  username: {
    required: helpers.withMessage(() => t('usernameRequired'), required),
  },
  password: {
    required: helpers.withMessage(() => t('passwordRequired'), required),
  },
}

const v$ = useVuelidate(rules, formData)

const handleSubmit = async () => {
  const isFormValid = await v$.value.$validate()

  if (!isFormValid) {
    return
  }

  await login(formData.value.username, formData.value.password)
  toast.success(t('loginSuccess'))
  const redirect = router.currentRoute.value.query.redirect
  router.push(redirect ? redirect : { name: ROUTE_NAMES.HOME })
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
      {{ t('signInToAccount') }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <BaseInput
        v-model="v$.username.$model"
        :label="t('username')"
        :placeholder="t('enterUsername')"
        :error="v$.username.$error ? v$.username.$errors[0]?.$message : ''"
        required
      />

      <BaseInput
        v-model="v$.password.$model"
        type="password"
        :label="t('password')"
        :placeholder="t('enterPassword')"
        :error="v$.password.$error ? v$.password.$errors[0]?.$message : ''"
        required
      />

      <BaseButton type="submit" :loading="isLoading" class="w-full">
        {{ t('signIn') }}
      </BaseButton>
    </form>
  </div>
</template>
