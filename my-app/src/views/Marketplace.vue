<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types/database.types'
import { supabase } from '@/lib/supabase'

const route = useRoute()
const cartStore = useCartStore()
const loading = ref(false)
const products = ref<Product[]>([])
const selectedCategory = ref(route.query.category as string || 'all')
const searchQuery = ref('')

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'ai', name: 'AI Solutions' },
  { id: 'cloud', name: 'Cloud Services' },
  { id: 'automation', name: 'Automation' },
  { id: 'security', name: 'Security' }
]

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesCategory = selectedCategory.value === 'all' || 
      product.category === selectedCategory.value
    const matchesSearch = product.name.toLowerCase()
      .includes(searchQuery.value.toLowerCase()) ||
      product.description.toLowerCase()
        .includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

onMounted(async () => {
  await fetchProducts()
})

async function fetchProducts() {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name')

    if (error) throw error
    products.value = data
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

async function addToCart(product: Product) {
  try {
    await cartStore.addToCart(product.id)
    alert('Product added to cart!')
  } catch (error) {
    console.error('Error adding to cart:', error)
    alert('Failed to add product to cart. Please try again.')
  }
}
</script>

<template>
  <div class="marketplace">
    <div class="marketplace-header">
      <h1>Marketplace</h1>
      <div class="filters">
        <div class="search-bar">
          <input 
            type="text"
            v-model="searchQuery"
            placeholder="Search products..."
          >
        </div>
        <div class="categories">
          <button
            v-for="category in categories"
            :key="category.id"
            :class="['category-btn', { active: selectedCategory === category.id }]"
            @click="selectedCategory = category.id"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">
      Loading products...
    </div>

    <div v-else-if="filteredProducts.length === 0" class="no-results">
      No products found matching your criteria.
    </div>

    <div v-else class="products-grid">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        class="product-card"
      >
        <img 
          :src="product.image_url" 
          :alt="product.name"
          class="product-image"
        >
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <div class="product-features">
            <ul>
              <li v-for="feature in product.features" :key="feature">
                {{ feature }}
              </li>
            </ul>
          </div>
          <div class="product-price">
            ${{ product.price }}/mo
          </div>
          <button 
            class="add-to-cart-btn"
            @click="addToCart(product)"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marketplace {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.marketplace-header {
  margin-bottom: 3rem;
}

h1 {
  font-size: 2.5rem;
  color: #00ff88;
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-bar input {
  width: 100%;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 1rem;
}

.categories {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.category-btn {
  padding: 0.5rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-btn.active {
  background: linear-gradient(45deg, #00ff88, #00ffff);
  color: #000000;
  border: none;
}

.loading, .no-results {
  text-align: center;
  padding: 3rem;
  color: #ffffff;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.product-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 1.5rem;
}

.product-info h3 {
  color: #00ff88;
  margin-bottom: 1rem;
}

.product-info p {
  color: #ffffff;
  margin-bottom: 1rem;
}

.product-features {
  margin: 1rem 0;
}

.product-features ul {
  list-style: none;
  padding: 0;
}

.product-features li {
  color: #ffffff;
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
}

.product-features li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: #00ff88;
}

.product-price {
  font-size: 1.5rem;
  color: #00ffff;
  margin: 1rem 0;
}

.add-to-cart-btn {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(45deg, #00ff88, #00ffff);
  border: none;
  border-radius: 5px;
  color: #000;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.add-to-cart-btn:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .marketplace {
    padding: 1rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style> 