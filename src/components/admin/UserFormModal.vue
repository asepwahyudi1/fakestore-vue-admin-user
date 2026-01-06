<script setup>
import { ref, watch, computed } from 'vue'
import { BaseButton, BaseInput } from '@/components/base'
import { useI18n } from '@/composables/useI18n'
import { useVuelidate, required, email, helpers } from '@/plugins/vuelidate'
import UiDialogue from '@/components/ui/UiDialogue.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Object,
    default: null,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'submit', 'close'])

const { t } = useI18n()
const isEditMode = computed(() => !!props.user)

const formData = ref({
  username: '',
  email: '',
  password: '',
})

const rules = {
  username: { required: helpers.withMessage(() => t('usernameRequired'), required) },
  email: {
    required: helpers.withMessage(() => t('emailRequired'), required),
    email: helpers.withMessage(() => t('validEmail'), email),
  },
  password: { required: helpers.withMessage(() => t('passwordRequired'), required) },
}

const v$ = useVuelidate(rules, formData)

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      if (props.user) {
        formData.value = {
          username: props.user.username || '',
          email: props.user.email || '',
          password: '',
        }
      } else {
        formData.value = {
          username: '',
          email: '',
          password: '',
        }
      }
      v$.value.$reset()
    }
  },
  { immediate: true },
)

watch(
  () => props.user,
  (newUser) => {
    if (newUser && props.modelValue) {
      formData.value = {
        username: newUser.username || '',
        email: newUser.email || '',
        password: '',
      }
      v$.value.$reset()
    }
  },
)

const closeDialog = () => {
  emit('update:modelValue', false)
  emit('close')
  formData.value = {
    username: '',
    email: '',
    password: '',
  }
  v$.value.$reset()
}

const handleSubmit = async () => {
  if (props.isSubmitting) {
    return
  }

  if (isEditMode.value && !formData.value.password) {
    v$.value.password.$reset()
    const isUsernameValid = await v$.value.username.$validate()
    const isEmailValid = await v$.value.email.$validate()

    if (!isUsernameValid || !isEmailValid) {
      return
    }
  } else {
    const isFormValid = await v$.value.$validate()
    if (!isFormValid) {
      return
    }
  }

  const payload = {
    id: isEditMode.value ? props.user.id : 0,
    username: formData.value.username,
    email: formData.value.email,
    ...(formData.value.password && { password: formData.value.password }),
  }

  emit('submit', payload)
}
</script>

<template>
  <UiDialogue
    :model-value="modelValue"
    :title="isEditMode ? t('editUser') : t('addUser')"
    @update:model-value="emit('update:modelValue', $event)"
    @close="closeDialog"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <BaseInput
        v-model="v$.username.$model"
        :label="t('username')"
        :placeholder="t('enterUsername')"
        :error="v$.username.$error ? v$.username.$errors[0]?.$message : ''"
        required
      />

      <BaseInput
        v-model="v$.email.$model"
        type="email"
        :label="t('email')"
        :placeholder="t('enterEmail')"
        :error="v$.email.$error ? v$.email.$errors[0]?.$message : ''"
        required
      />

      <BaseInput
        v-model="v$.password.$model"
        type="password"
        :label="isEditMode ? t('newPassword') : t('password')"
        :placeholder="t('enterPassword')"
        :error="v$.password.$error ? v$.password.$errors[0]?.$message : ''"
        :required="!isEditMode"
      />
      <p v-if="isEditMode" class="text-sm text-gray-500 dark:text-gray-400">
        {{ t('leavePasswordEmpty') }}
      </p>

      <div class="flex justify-end gap-3 pt-4">
        <BaseButton type="button" variant="outline" @click="closeDialog" :disabled="isSubmitting">
          {{ t('cancel') }}
        </BaseButton>
        <BaseButton type="submit" :loading="isSubmitting" :disabled="isSubmitting">
          {{ isEditMode ? t('update') : t('create') }}
        </BaseButton>
      </div>
    </form>
  </UiDialogue>
</template>
