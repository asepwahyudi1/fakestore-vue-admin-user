<script setup>
import { BaseButton } from '@/components/base'
import { ProductList } from '@/components/products'
import { useI18n, useSeo } from '@/composables'
import { ROUTE_NAMES } from '@/constants'

const { t } = useI18n()

useSeo({
  title: t('welcome'),
  description: t('welcomeSubtitle'),
  keywords:
    'online store, ecommerce, products, shopping, electronics, clothing, jewelry, fakestore',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FakeStore',
    description: t('welcomeSubtitle'),
    url: 'https://fakestore.com',
  },
})
</script>

<template>
  <div>
    <div
      class="relative overflow-hidden bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 rounded-2xl mb-12"
    >
      <div class="absolute inset-0 bg-black opacity-10"></div>
      <div class="relative px-8 py-16 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
          {{ t('welcome') }}
        </h1>
        <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          {{ t('welcomeSubtitle') }}
        </p>
        <router-link :to="{ name: ROUTE_NAMES.PRODUCTS }">
          <BaseButton size="lg" variant="secondary" class="shadow-lg">
            {{ t('viewAllProducts') }}
          </BaseButton>
        </router-link>
      </div>
    </div>

    <ProductList title-tag="h2" data-cy-prefix="product" :initial-display-count="12" />
  </div>
</template>
