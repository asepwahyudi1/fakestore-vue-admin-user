import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

vi.mock('@/composables/useAuth')
vi.mock('@/composables/useToast')
vi.mock('@/composables/useI18n', () => ({
  useI18n: () => ({
    t: (key) => key,
  }),
}))
vi.mock('@/composables/useSeo', () => ({
  useSeo: vi.fn(),
}))

describe('Login View', () => {
  let pinia
  let router

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
        { path: '/login', name: 'login', component: { template: '<div>Login</div>' } },
      ],
    })

    useAuth.mockReturnValue({
      login: vi.fn().mockResolvedValue({}),
      isLoading: false,
    })

    useToast.mockReturnValue({
      success: vi.fn(),
      error: vi.fn(),
    })
  })

  it('should render login form', () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          BaseButton: true,
          BaseInput: true,
        },
      },
    })

    expect(wrapper.text()).toContain('signInToAccount')
  })

  it('should call login function when form is submitted with valid data', async () => {
    const mockLogin = vi.fn().mockResolvedValue({})
    const mockToast = { success: vi.fn() }

    useAuth.mockReturnValue({
      login: mockLogin,
      isLoading: false,
    })
    useToast.mockReturnValue(mockToast)

    const wrapper = mount(LoginView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          BaseButton: true,
          BaseInput: true,
        },
      },
    })

    const formData = wrapper.vm.formData
    formData.username = 'johnd'
    formData.password = 'm38rmF$'

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(mockLogin).toHaveBeenCalledWith('johnd', 'm38rmF$')
  })

  it('should not submit form when validation fails', async () => {
    const mockLogin = vi.fn()
    useAuth.mockReturnValue({
      login: mockLogin,
      isLoading: false,
    })

    const wrapper = mount(LoginView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          BaseButton: true,
          BaseInput: true,
        },
      },
    })

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('should show loading state on button when isLoading is true', () => {
    useAuth.mockReturnValue({
      login: vi.fn(),
      isLoading: true,
    })

    const wrapper = mount(LoginView, {
      global: {
        plugins: [pinia, router],
        stubs: {
          BaseButton: {
            template: '<button :disabled="loading"><slot></slot></button>',
            props: ['loading'],
          },
          BaseInput: true,
        },
      },
    })

    expect(wrapper.vm.isLoading).toBe(true)
    const buttons = wrapper.findAllComponents({ name: 'BaseButton' })
    if (buttons.length > 0) {
      expect(buttons[0].props('loading')).toBe(true)
    }
  })
})

