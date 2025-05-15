<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import type { Address } from '@/types/database.types'

const router = useRouter()
const cartStore = useCartStore()
const showCheckout = ref(false)
const loading = ref(false)

const billingAddress = ref<Address>({
  street: '',
  city: '',
  state: '',
  postal_code: '',
  country: ''
})

const shippingAddress = ref<Address>({
  street: '',
  city: '',
  state: '',
  postal_code: '',
  country: ''
})

const paymentMethod = ref<'ideal' | 'creditcard' | 'pay_later'>('creditcard')
const sameAsBilling = ref(true)

const cartItems = computed(() => {
  return cartStore.items.map(item => {
    const product = cartStore.products.get(item.product_id)
    return {
      ...item,
      product
    }
  })
})

async function updateQuantity(itemId: string, quantity: number) {
  try {
    await cartStore.updateQuantity(itemId, quantity)
  } catch (error) {
    console.error('Error updating quantity:', error)
    alert('Failed to update quantity. Please try again.')
  }
}

async function removeItem(itemId: string) {
  try {
    await cartStore.removeFromCart(itemId)
  } catch (error) {
    console.error('Error removing item:', error)
    alert('Failed to remove item. Please try again.')
  }
}

async function proceedToCheckout() {
  if (cartStore.itemCount === 0) {
    alert('Your cart is empty')
    return
  }
  showCheckout.value = true
}

async function handleCheckout() {
  try {
    loading.value = true
    
    // Validate addresses
    if (!validateAddress(billingAddress.value)) {
      alert('Please fill in all billing address fields')
      return
    }

    if (!sameAsBilling.value && !validateAddress(shippingAddress.value)) {
      alert('Please fill in all shipping address fields')
      return
    }

    // Create order
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'pending',
        payment_method: paymentMethod.value,
        total_amount: cartStore.total,
        billing_address: billingAddress.value,
        shipping_address: sameAsBilling.value ? billingAddress.value : shippingAddress.value
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    const orderItems = cartStore.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_time: cartStore.products.get(item.product_id)?.price || 0
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    // Handle payment method
    if (paymentMethod.value === 'pay_later') {
      // Create invoice
      const { error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          order_id: order.id,
          amount: cartStore.total,
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          email_sent: false
        })

      if (invoiceError) throw invoiceError

      // Send invoice email
      // This would be handled by a serverless function or backend service
    }

    // Clear cart and redirect
    await cartStore.clearCart()
    router.push('/order-confirmation/' + order.id)
  } catch (error) {
    console.error('Error during checkout:', error)
    alert('Failed to process checkout. Please try again.')
  } finally {
    loading.value = false
  }
}

function validateAddress(address: Address): boolean {
  return Object.values(address).every(value => value.trim() !== '')
}

function updateShippingAddress() {
  if (sameAsBilling.value) {
    shippingAddress.value = { ...billingAddress.value }
  }
}
</script>

<template>
  <div class="cart">
    <h1>Shopping Cart</h1>

    <div v-if="cartStore.itemCount === 0" class="empty-cart">
      Your cart is empty
      <router-link to="/marketplace" class="continue-shopping">
        Continue Shopping
      </router-link>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items">
        <div 
          v-for="item in cartItems" 
          :key="item.id"
          class="cart-item"
        >
          <img 
            :src="item.product?.image_url" 
            :alt="item.product?.name"
            class="item-image"
          >
          <div class="item-details">
            <h3>{{ item.product?.name }}</h3>
            <p>{{ item.product?.description }}</p>
            <div class="item-price">
              ${{ item.product?.price }}/mo
            </div>
          </div>
          <div class="item-quantity">
            <button 
              @click="updateQuantity(item.id, item.quantity - 1)"
              :disabled="item.quantity <= 1"
            >
              -
            </button>
            <span>{{ item.quantity }}</span>
            <button 
              @click="updateQuantity(item.id, item.quantity + 1)"
            >
              +
            </button>
          </div>
          <div class="item-total">
            ${{ (item.product?.price || 0) * item.quantity }}/mo
          </div>
          <button 
            class="remove-item"
            @click="removeItem(item.id)"
          >
            Remove
          </button>
        </div>
      </div>

      <div class="cart-summary">
        <h2>Order Summary</h2>
        <div class="summary-row">
          <span>Subtotal</span>
          <span>${{ cartStore.total }}/mo</span>
        </div>
        <button 
          class="checkout-btn"
          @click="proceedToCheckout"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>

    <div v-if="showCheckout" class="checkout-modal">
      <div class="checkout-content">
        <h2>Checkout</h2>
        
        <div class="address-section">
          <h3>Billing Address</h3>
          <div class="address-form">
            <input 
              v-model="billingAddress.street"
              placeholder="Street Address"
              @input="updateShippingAddress"
            >
            <div class="address-row">
              <input 
                v-model="billingAddress.city"
                placeholder="City"
                @input="updateShippingAddress"
              >
              <input 
                v-model="billingAddress.state"
                placeholder="State"
                @input="updateShippingAddress"
              >
            </div>
            <div class="address-row">
              <input 
                v-model="billingAddress.postal_code"
                placeholder="Postal Code"
                @input="updateShippingAddress"
              >
              <input 
                v-model="billingAddress.country"
                placeholder="Country"
                @input="updateShippingAddress"
              >
            </div>
          </div>
        </div>

        <div class="shipping-section">
          <div class="shipping-header">
            <h3>Shipping Address</h3>
            <label class="same-address">
              <input 
                type="checkbox"
                v-model="sameAsBilling"
                @change="updateShippingAddress"
              >
              Same as billing address
            </label>
          </div>
          
          <div v-if="!sameAsBilling" class="address-form">
            <input 
              v-model="shippingAddress.street"
              placeholder="Street Address"
            >
            <div class="address-row">
              <input 
                v-model="shippingAddress.city"
                placeholder="City"
              >
              <input 
                v-model="shippingAddress.state"
                placeholder="State"
              >
            </div>
            <div class="address-row">
              <input 
                v-model="shippingAddress.postal_code"
                placeholder="Postal Code"
              >
              <input 
                v-model="shippingAddress.country"
                placeholder="Country"
              >
            </div>
          </div>
        </div>

        <div class="payment-section">
          <h3>Payment Method</h3>
          <div class="payment-options">
            <label class="payment-option">
              <input 
                type="radio"
                v-model="paymentMethod"
                value="creditcard"
              >
              Credit Card
            </label>
            <label class="payment-option">
              <input 
                type="radio"
                v-model="paymentMethod"
                value="ideal"
              >
              iDEAL
            </label>
            <label class="payment-option">
              <input 
                type="radio"
                v-model="paymentMethod"
                value="pay_later"
              >
              Pay Later (7 days)
            </label>
          </div>
        </div>

        <div class="checkout-actions">
          <button 
            class="cancel-btn"
            @click="showCheckout = false"
          >
            Cancel
          </button>
          <button 
            class="confirm-btn"
            @click="handleCheckout"
            :disabled="loading"
          >
            {{ loading ? 'Processing...' : 'Confirm & Pay' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 2.5rem;
  color: #00ff88;
  margin-bottom: 2rem;
}

.empty-cart {
  text-align: center;
  padding: 3rem;
  color: #ffffff;
}

.continue-shopping {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #00ff88, #00ffff);
  border-radius: 25px;
  color: #000;
  text-decoration: none;
  font-weight: 600;
}

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 2fr 1fr 1fr auto;
  gap: 1rem;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
}

.item-details h3 {
  color: #00ff88;
  margin-bottom: 0.5rem;
}

.item-price {
  color: #00ffff;
  font-weight: 600;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-quantity button {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  cursor: pointer;
}

.item-quantity button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.item-total {
  color: #00ffff;
  font-weight: 600;
}

.remove-item {
  padding: 0.5rem;
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
}

.cart-summary {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: fit-content;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  color: #ffffff;
}

.checkout-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(45deg, #00ff88, #00ffff);
  border: none;
  border-radius: 5px;
  color: #000;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
}

.checkout-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.checkout-content {
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.address-section,
.shipping-section,
.payment-section {
  margin-bottom: 2rem;
}

.address-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.address-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

input[type="text"] {
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  color: #ffffff;
}

.same-address {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffffff;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffffff;
}

.checkout-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.confirm-btn {
  background: linear-gradient(45deg, #00ff88, #00ffff);
  color: #000;
}

.confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-item {
    grid-template-columns: 80px 1fr;
    grid-template-areas:
      "image details"
      "image quantity"
      "image total"
      "image remove";
  }

  .item-image {
    grid-area: image;
    width: 80px;
    height: 80px;
  }

  .item-details {
    grid-area: details;
  }

  .item-quantity {
    grid-area: quantity;
  }

  .item-total {
    grid-area: total;
  }

  .remove-item {
    grid-area: remove;
  }
}
</style> 