<script setup>
import { ProductList } from '@/components/products'
import { useI18n, useSeo } from '@/composables'

const { t } = useI18n()

useSeo({
  title: t('products'),
  description: `Browse our collection of ${t('products').toLowerCase()}. Find the best deals on electronics, clothing, jewelry, and more.`,
  keywords: 'products, online shopping, ecommerce, electronics, clothing, jewelry, fakestore',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('products'),
    description: `Browse our collection of ${t('products').toLowerCase()}`,
    url: 'https://fakestore.com/products',
  },
})
</script>

<template>
  <div>
    <ProductList title-tag="h1" data-cy-prefix="products" :initial-display-count="20" />
  </div>
</template>
