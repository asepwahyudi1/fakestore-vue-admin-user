<script setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
  size: {
    type: [String, Number],
    default: 24,
  },
  color: {
    type: String,
    default: 'currentColor',
  },
  rotate: {
    type: [String, Number],
    default: 0,
  },
  flip: {
    type: String,
    default: '',
    validator: (value) => ['', 'horizontal', 'vertical', 'both'].includes(value),
  },
})
</script>

<template>
  <Icon
    :icon="icon"
    :width="size"
    :height="size"
    :style="{
      color: color,
      transform: `rotate(${rotate}deg) ${flip ? `scaleX(${flip === 'horizontal' || flip === 'both' ? -1 : 1}) scaleY(${flip === 'vertical' || flip === 'both' ? -1 : 1})` : ''}`,
    }"
  />
</template>

