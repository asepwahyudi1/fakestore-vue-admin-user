import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProfileView from '@/views/profile/ProfileView.vue'
import { useAuth } from '@/composables/useAuth'

vi.mock('@/composables/useAuth')
vi.mock('@/composables/useI18n', () => ({
  useI18n: () => ({
    t: (key) => key,
  }),
}))
vi.mock('@/composables/useSeo', () => ({
  useSeo: vi.fn(),
}))

describe('Profile View', () => {
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('should render profile view', () => {
    useAuth.mockReturnValue({
      user: {
        value: {
          id: 1,
          username: 'johnd',
          email: 'john@gmail.com',
          name: {
            firstname: 'John',
            lastname: 'Doe',
          },
        },
      },
      isAdmin: { value: false },
    })

    const wrapper = mount(ProfileView, {
      global: {
        plugins: [pinia],
        stubs: {
          BaseCard: true,
          Icon: true,
        },
      },
    })

    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.vm.user.value.email).toBe('john@gmail.com')
  })

  it('should display admin badge for admin users', () => {
    useAuth.mockReturnValue({
      user: {
        value: {
          id: 1,
          username: 'johnd',
          email: 'john@gmail.com',
          name: {
            firstname: 'John',
            lastname: 'Doe',
          },
        },
      },
      isAdmin: { value: true },
    })

    const wrapper = mount(ProfileView, {
      global: {
        plugins: [pinia],
        stubs: {
          BaseCard: true,
          Icon: true,
        },
      },
    })

    expect(wrapper.text()).toContain('admin')
  })

  it('should display user initials correctly', () => {
    useAuth.mockReturnValue({
      user: {
        value: {
          id: 1,
          username: 'johnd',
          name: {
            firstname: 'John',
            lastname: 'Doe',
          },
        },
      },
      isAdmin: { value: false },
    })

    const wrapper = mount(ProfileView, {
      global: {
        plugins: [pinia],
        stubs: {
          BaseCard: true,
          Icon: true,
        },
      },
    })

    expect(wrapper.vm.getUserInitials).toBe('JD')
  })
})
