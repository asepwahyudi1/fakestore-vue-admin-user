<script setup>
import { ref, watch, computed } from 'vue'
import { BaseButton, BaseInput } from '@/components/base'
import { useI18n } from '@/composables/useI18n'
import { useVuelidate, required, helpers } from '@/plugins/vuelidate'
import UiDialogue from '@/components/ui/UiDialogue.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  product: {
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
const isEditMode = computed(() => !!props.product)

const formData = ref({
  title: '',
  price: '',
  description: '',
  category: '',
  image: '',
})

const rules = {
  title: { required: helpers.withMessage(() => t('titleRequired'), required) },
  price: { required: helpers.withMessage(() => t('priceRequired'), required) },
  description: { required: helpers.withMessage(() => t('descriptionRequired'), required) },
  category: { required: helpers.withMessage(() => t('categoryRequired'), required) },
  image: { required: helpers.withMessage(() => t('imageUrlRequired'), required) },
}

const v$ = useVuelidate(rules, formData)

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      if (props.product) {
        formData.value = {
          title: props.product.title || '',
          price: props.product.price?.toString() || '',
          description: props.product.description || '',
          category: props.product.category || '',
          image: props.product.image || '',
        }
      } else {
        formData.value = {
          title: '',
          price: '',
          description: '',
          category: '',
          image: '',
        }
      }
      v$.value.$reset()
    }
  },
  { immediate: true },
)

watch(
  () => props.product,
  (newProduct) => {
    if (newProduct && props.modelValue) {
      formData.value = {
        title: newProduct.title || '',
        price: newProduct.price?.toString() || '',
        description: newProduct.description || '',
        category: newProduct.category || '',
        image: newProduct.image || '',
      }
      v$.value.$reset()
    }
  },
)

const closeDialog = () => {
  emit('update:modelValue', false)
  emit('close')
  formData.value = {
    title: '',
    price: '',
    description: '',
    category: '',
    image: '',
  }
  v$.value.$reset()
}

const handleSubmit = async () => {
  if (props.isSubmitting) {
    return
  }

  const isFormValid = await v$.value.$validate()
  if (!isFormValid) {
    return
  }

  const payload = {
    id: isEditMode.value ? props.product.id : 0,
    title: formData.value.title,
    price: parseFloat(formData.value.price),
    description: formData.value.description,
    category: formData.value.category,
    image: formData.value.image,
  }

  emit('submit', payload)
}
</script>

<template>
  <UiDialogue
    :model-value="modelValue"
    :title="isEditMode ? t('editProduct') : t('addProduct')"
    @update:model-value="emit('update:modelValue', $event)"
    @close="closeDialog"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <BaseInput
        v-model="v$.title.$model"
        :label="t('title')"
        :placeholder="t('enterProductTitle')"
        :error="v$.title.$error ? v$.title.$errors[0]?.$message : ''"
        required
      />

      <BaseInput
        v-model="v$.price.$model"
        type="number"
        step="0.01"
        :label="t('price')"
        :placeholder="t('enterProductPrice')"
        :error="v$.price.$error ? v$.price.$errors[0]?.$message : ''"
        required
      />

      <BaseInput
        v-model="v$.description.$model"
        :label="t('description')"
        :placeholder="t('enterProductDescription')"
        :error="v$.description.$error ? v$.description.$errors[0]?.$message : ''"
        required
      />

      <BaseInput
        v-model="v$.category.$model"
        :label="t('category')"
        :placeholder="t('enterProductCategory')"
        :error="v$.category.$error ? v$.category.$errors[0]?.$message : ''"
        required
      />

      <BaseInput
        v-model="v$.image.$model"
        type="url"
        :label="t('image')"
        :placeholder="t('enterImageUrl')"
        :error="v$.image.$error ? v$.image.$errors[0]?.$message : ''"
        required
      />

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
