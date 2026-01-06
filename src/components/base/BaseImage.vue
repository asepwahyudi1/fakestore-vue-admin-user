<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: '',
  },
  lazy: {
    type: Boolean,
    default: true,
  },
  priority: {
    type: Boolean,
    default: false,
  },
  width: {
    type: [Number, String],
    default: null,
  },
  height: {
    type: [Number, String],
    default: null,
  },
  class: {
    type: String,
    default: '',
  },
})

const imageLoaded = ref(false)
const imageError = ref(false)
const shouldLoad = ref(!props.lazy)
const containerRef = ref(null)
let observer = null

onMounted(() => {
  if (!props.lazy) {
    shouldLoad.value = true
  } else if ('IntersectionObserver' in window && containerRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            shouldLoad.value = true
            if (observer) {
              observer.disconnect()
            }
          }
        })
      },
      {
        rootMargin: '50px',
      },
    )

    observer.observe(containerRef.value)
  } else {
    shouldLoad.value = true
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

const handleLoad = () => {
  imageLoaded.value = true
}

const handleError = () => {
  imageError.value = true
}
</script>

<template>
  <div
    ref="containerRef"
    :class="['relative overflow-hidden', props.class]"
    :style="{
      width: width ? `${width}px` : undefined,
      height: height ? `${height}px` : undefined,
      aspectRatio: width && height ? `${width}/${height}` : undefined,
    }"
  >
    <img
      v-if="shouldLoad && !imageError"
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="lazy ? 'lazy' : 'eager'"
      :fetchpriority="priority ? 'high' : 'auto'"
      :decoding="priority ? 'sync' : 'async'"
      @load="handleLoad"
      @error="handleError"
      class="w-full h-full object-contain transition-opacity duration-300"
      :class="{ 'opacity-0': !imageLoaded, 'opacity-100': imageLoaded }"
    />
    <div
      v-else-if="imageError"
      class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700"
    >
      <Icon icon="mdi:image-off" class="text-gray-400" :width="48" :height="48" />
    </div>
    <div v-else class="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
  </div>
</template>
