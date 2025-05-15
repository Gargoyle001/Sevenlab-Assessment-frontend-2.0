<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import type { Order, OrderItem, Product } from '@/types/database.types'

const route = useRoute()
const router = useRouter()
const order = ref<Order | null>(null)
const orderItems = ref<(OrderItem & { product: Product })[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  const orderId = route.params.id
  if (!orderId) {
    router.push('/')
    return
  }

  try {
    // Fetch order details
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError) throw orderError
    order.value = orderData

    // Fetch order items with product details
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('order_id', orderId)

    if (itemsError) throw itemsError
    orderItems.value = itemsData
  } catch (err) {
    console.error('Error fetching order:', err)
    error.value = 'Failed to load order details'
  } finally {
    loading.value = false
  }
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="order-confirmation">
    <div v-if="loading" class="loading">
      Loading order details...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="router.push('/')" class="home-btn">
        Return Home
      </button>
    </div>

    <div v-else-if="order" class="confirmation-content">
      <div class="success-header">
        <i class="fas fa-check-circle"></i>
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase</p>
      </div>

      <div class="order-details">
        <div class="order-info">
          <h2>Order Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Order Number</span>
              <span class="value">{{ order.id }}</span>
            </div>
            <div class="info-item">
              <span class="label">Date</span>
              <span class="value">{{ formatDate(order.created_at) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Status</span>
              <span class="value status" :class="order.status">
                {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
              </span>
            </div>
            <div class="info-item">
              <span class="label">Payment Method</span>
              <span class="value">{{ order.payment_method }}</span>
            </div>
          </div>
        </div>

        <div class="addresses">
          <div class="address-section">
            <h3>Billing Address</h3>
            <div class="address">
              <p>{{ order.billing_address.street }}</p>
              <p>{{ order.billing_address.city }}, {{ order.billing_address.state }}</p>
              <p>{{ order.billing_address.postal_code }}</p>
              <p>{{ order.billing_address.country }}</p>
            </div>
          </div>

          <div class="address-section">
            <h3>Shipping Address</h3>
            <div class="address">
              <p>{{ order.shipping_address.street }}</p>
              <p>{{ order.shipping_address.city }}, {{ order.shipping_address.state }}</p>
              <p>{{ order.shipping_address.postal_code }}</p>
              <p>{{ order.shipping_address.country }}</p>
            </div>
          </div>
        </div>

        <div class="order-items">
          <h2>Order Items</h2>
          <div class="items-list">
            <div 
              v-for="item in orderItems" 
              :key="item.id"
              class="order-item"
            >
              <img 
                :src="item.product.image_url" 
                :alt="item.product.name"
                class="item-image"
              >
              <div class="item-details">
                <h3>{{ item.product.name }}</h3>
                <p>{{ item.product.description }}</p>
                <div class="item-meta">
                  <span class="quantity">Quantity: {{ item.quantity }}</span>
                  <span class="price">${{ item.price_at_time }}/mo</span>
                </div>
              </div>
              <div class="item-total">
                ${{ item.price_at_time * item.quantity }}/mo
              </div>
            </div>
          </div>

          <div class="order-total">
            <span>Total Amount</span>
            <span>${{ order.total_amount }}/mo</span>
          </div>
        </div>
      </div>

      <div class="next-steps">
        <h2>Next Steps</h2>
        <div class="steps-grid">
          <div class="step">
            <i class="fas fa-envelope"></i>
            <h3>Order Confirmation</h3>
            <p>You will receive an email confirmation shortly</p>
          </div>
          <div class="step">
            <i class="fas fa-truck"></i>
            <h3>Shipping Updates</h3>
            <p>We'll notify you when your order ships</p>
          </div>
          <div class="step">
            <i class="fas fa-headset"></i>
            <h3>Need Help?</h3>
            <p>Contact our support team for assistance</p>
          </div>
        </div>
      </div>

      <div class="actions">
        <button @click="router.push('/marketplace')" class="continue-shopping">
          Continue Shopping
        </button>
        <button @click="router.push('/account')" class="view-orders">
          View All Orders
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-confirmation {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.loading,
.error {
  text-align: center;
  padding: 3rem;
  color: #ffffff;
}

.home-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #00ff88, #00ffff);
  border: none;
  border-radius: 25px;
  color: #000;
  font-weight: 600;
  cursor: pointer;
}

.success-header {
  text-align: center;
  margin-bottom: 3rem;
}

.success-header i {
  font-size: 4rem;
  color: #00ff88;
  margin-bottom: 1rem;
}

h1 {
  font-size: 2.5rem;
  color: #00ff88;
  margin-bottom: 0.5rem;
}

.success-header p {
  color: #ffffff;
  font-size: 1.2rem;
}

.order-details {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

h2 {
  color: #00ff88;
  margin-bottom: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  color: #ffffff;
  opacity: 0.7;
}

.value {
  color: #ffffff;
  font-weight: 600;
}

.status {
  text-transform: capitalize;
}

.status.pending {
  color: #ffd700;
}

.status.paid {
  color: #00ff88;
}

.status.shipped {
  color: #00ffff;
}

.status.completed {
  color: #00ff88;
}

.addresses {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.address-section h3 {
  color: #00ff88;
  margin-bottom: 1rem;
}

.address p {
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.order-items {
  margin-top: 2rem;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  display: grid;
  grid-template-columns: 100px 2fr 1fr;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 5px;
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

.item-details p {
  color: #ffffff;
  opacity: 0.8;
  margin-bottom: 0.5rem;
}

.item-meta {
  display: flex;
  gap: 1rem;
  color: #ffffff;
}

.price {
  color: #00ffff;
}

.item-total {
  color: #00ff88;
  font-weight: 600;
  font-size: 1.2rem;
}

.order-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 600;
}

.next-steps {
  margin-bottom: 3rem;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.step {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.step i {
  font-size: 2rem;
  color: #00ff88;
  margin-bottom: 1rem;
}

.step h3 {
  color: #00ff88;
  margin-bottom: 0.5rem;
}

.step p {
  color: #ffffff;
  opacity: 0.8;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.continue-shopping,
.view-orders {
  padding: 1rem 2rem;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.continue-shopping {
  background: linear-gradient(45deg, #00ff88, #00ffff);
  color: #000;
}

.view-orders {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.continue-shopping:hover,
.view-orders:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .order-confirmation {
    padding: 2rem 1rem;
  }

  .order-item {
    grid-template-columns: 80px 1fr;
    grid-template-areas:
      "image details"
      "image total";
  }

  .item-image {
    grid-area: image;
    width: 80px;
    height: 80px;
  }

  .item-details {
    grid-area: details;
  }

  .item-total {
    grid-area: total;
  }

  .actions {
    flex-direction: column;
  }
}
</style> 