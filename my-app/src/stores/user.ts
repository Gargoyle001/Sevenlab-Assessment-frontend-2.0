import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)

  async function fetchUser() {
    try {
      loading.value = true
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      user.value = currentUser
    } catch (error) {
      console.error('Error fetching user:', error)
      user.value = null
    } finally {
      loading.value = false
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      await fetchUser()
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }

  async function signUp(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      user.value = null
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  // Initialize auth state
  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user ?? null
  })

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    fetchUser
  }
}) 