import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { CartItem, Product } from '@/types/database.types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const products = ref<Map<string, Product>>(new Map())
  const loading = ref(false)

  const itemCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const total = computed(() => {
    return items.value.reduce((sum, item) => {
      const product = products.value.get(item.product_id)
      return sum + (product?.price || 0) * item.quantity
    }, 0)
  })

  async function fetchCart() {
    try {
      loading.value = true
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data: cartItems, error: cartError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user?.id)

      if (cartError) throw cartError

      // Fetch all products in cart
      const productIds = cartItems.map(item => item.product_id)
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds)

      if (productsError) throw productsError

      // Update local state
      items.value = cartItems
      products.value = new Map(productsData.map(p => [p.id, p]))
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      loading.value = false
    }
  }

  async function addToCart(productId: string, quantity: number = 1) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const existingItem = items.value.find(item => item.product_id === productId)

      if (existingItem) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)

        if (error) throw error
        existingItem.quantity += quantity
      } else {
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity
          })
          .select()
          .single()

        if (error) throw error
        items.value.push(data)

        // Fetch product if not already in store
        if (!products.value.has(productId)) {
          const { data: product, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single()

          if (productError) throw productError
          products.value.set(productId, product)
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  }

  async function updateQuantity(itemId: string, quantity: number) {
    try {
      if (quantity < 1) {
        return await removeFromCart(itemId)
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)

      if (error) throw error

      const item = items.value.find(i => i.id === itemId)
      if (item) {
        item.quantity = quantity
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      throw error
    }
  }

  async function removeFromCart(itemId: string) {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      items.value = items.value.filter(item => item.id !== itemId)
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    }
  }

  async function clearCart() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user?.id)

      if (error) throw error

      items.value = []
      products.value.clear()
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw error
    }
  }

  // Initialize cart when store is created
  async function init() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      fetchCart()
    }
  }
  init()

  // Listen for auth state changes
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN') {
      fetchCart()
    } else if (event === 'SIGNED_OUT') {
      items.value = []
      products.value.clear()
    }
  })

  return {
    items,
    products,
    loading,
    itemCount,
    total,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart
  }
}) 