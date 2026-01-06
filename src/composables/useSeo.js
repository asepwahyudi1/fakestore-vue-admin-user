import { watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from './useI18n'

const defaultTitle = 'FakeStore - Discover Amazing Products'
const defaultDescription =
  'Discover amazing products at unbeatable prices. Shop the latest trends in electronics, clothing, jewelry, and more.'
const defaultImage = '/favicon.ico'
const siteUrl = import.meta.env.VITE_SITE_URL || 'https://fakestore.com'

const updateMetaTag = (name, content, attribute = 'name') => {
  if (!content) return

  let element = document.querySelector(`meta[${attribute}="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

const updateLinkTag = (rel, href) => {
  if (!href) return

  let element = document.querySelector(`link[rel="${rel}"]`)
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

const updateTitle = (title) => {
  document.title = title || defaultTitle
}

const updateCanonical = (url) => {
  const canonicalUrl = url ? `${siteUrl}${url}` : siteUrl
  updateLinkTag('canonical', canonicalUrl)
}

const updateStructuredData = (data) => {
  let script = document.querySelector('script[type="application/ld+json"]')
  if (!script) {
    script = document.createElement('script')
    script.setAttribute('type', 'application/ld+json')
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

export const useSeo = (options = {}) => {
  const route = useRoute()
  const { locale } = useI18n()

  const updateSeo = (newOptions = {}) => {
    const opts = { ...options, ...newOptions }
    const pageTitle = opts.title ? `${opts.title} | FakeStore` : defaultTitle
    const pageDescription = opts.description || defaultDescription
    const pageImage = opts.image || defaultImage
    const pageUrl = opts.url || route.fullPath
    const fullUrl = `${siteUrl}${pageUrl}`

    updateTitle(pageTitle)

    updateMetaTag('description', pageDescription)
    updateMetaTag('keywords', opts.keywords)
    updateMetaTag('robots', opts.robots || 'index, follow')

    updateMetaTag('og:title', pageTitle, 'property')
    updateMetaTag('og:description', pageDescription, 'property')
    updateMetaTag('og:image', pageImage, 'property')
    updateMetaTag('og:url', fullUrl, 'property')
    updateMetaTag('og:type', opts.type || 'website', 'property')
    updateMetaTag('og:site_name', 'FakeStore', 'property')

    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', pageTitle)
    updateMetaTag('twitter:description', pageDescription)
    updateMetaTag('twitter:image', pageImage)

    updateCanonical(pageUrl)

    if (opts.structuredData) {
      updateStructuredData(opts.structuredData)
    }
  }

  onMounted(() => {
    updateSeo()
    watch([locale, route], updateSeo, { immediate: true })
  })

  onUnmounted(() => {
    updateTitle(defaultTitle)
    updateMetaTag('description', defaultDescription)
    updateCanonical('/')
  })

  return {
    updateSeo,
  }
}
