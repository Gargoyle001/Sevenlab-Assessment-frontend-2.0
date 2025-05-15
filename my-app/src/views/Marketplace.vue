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

<style lang="scss" scoped>
$primary: #00ff88;
$secondary: #00ffff;
$white: #fff;
$dark-bg: rgba(255, 255, 255, 0.05);
$border-color: rgba(255, 255, 255, 0.1);

.marketplace {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    font-size: 2.5rem;
    color: $primary;
    margin-bottom: 2rem;
  }

  .search-bar {
    margin-bottom: 2rem;

    input {
      width: 100%;
      padding: 1rem;
      background: $dark-bg;
      border: 1px solid $border-color;
      border-radius: 10px;
      color: $white;
      font-size: 1.1rem;

      &:focus {
        outline: none;
        border-color: $primary;
      }
    }
  }

  .filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;

    button {
      padding: 0.5rem 1rem;
      background: $dark-bg;
      border: 1px solid $border-color;
      border-radius: 20px;
      color: $white;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover,
      &.active {
        background: linear-gradient(45deg, $primary, $secondary);
        color: #000;
        border-color: transparent;
      }
    }
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;

    .product-card {
      background: $dark-bg;
      border-radius: 15px;
      border: 1px solid $border-color;
      overflow: hidden;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);
      }

      .product-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }

      .product-info {
        padding: 1.5rem;

        h3 {
          color: $primary;
          margin-bottom: 0.5rem;
          font-size: 1.2rem;
        }

        .product-description {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 1rem;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .product-price {
          color: $secondary;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .add-to-cart {
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(45deg, $primary, $secondary);
          border: none;
          border-radius: 5px;
          color: #000;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s ease;

          &:hover {
            transform: translateY(-2px);
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }
      }
    }
  }

  .no-products {
    text-align: center;
    padding: 3rem;
    color: $white;
  }
}

@media (max-width: 768px) {
  .marketplace {
    padding: 1rem;

    h1 {
      font-size: 2rem;
    }

    .filters {
      justify-content: center;
    }
  }
}
</style> 