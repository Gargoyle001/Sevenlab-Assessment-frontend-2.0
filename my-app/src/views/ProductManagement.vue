<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

interface Product {
  id?: string
  name: string
  description: string
  price: number
  stock: number
}

const products = ref<Product[]>([])
const loading = ref(false)
const editingProduct = ref<Product | null>(null)
const showForm = ref(false)

const form = ref<Product>({
  name: '',
  description: '',
  price: 0,
  stock: 0
})

const errors = ref<{
  name?: string
  description?: string
  price?: string
  stock?: string
}>({})

onMounted(() => {
  fetchProducts()
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
    alert('Failed to fetch products')
  } finally {
    loading.value = false
  }
}

function validateForm(): boolean {
  errors.value = {}
  let isValid = true

  if (!form.value.name) {
    errors.value.name = 'Name is required'
    isValid = false
  } else if (form.value.name.length > 100) {
    errors.value.name = 'Name must be less than 100 characters'
    isValid = false
  }

  if (!form.value.description) {
    errors.value.description = 'Description is required'
    isValid = false
  } else if (form.value.description.length > 500) {
    errors.value.description = 'Description must be less than 500 characters'
    isValid = false
  }

  if (!form.value.price || form.value.price <= 0) {
    errors.value.price = 'Price must be greater than 0'
    isValid = false
  }

  if (!form.value.stock || form.value.stock < 0) {
    errors.value.stock = 'Stock must be 0 or greater'
    isValid = false
  }

  return isValid
}

async function handleSubmit() {
  if (!validateForm()) return

  try {
    loading.value = true
    const productData = {
      ...form.value,
      price: parseFloat(form.value.price.toString().replace(',', '.'))
    }

    if (editingProduct.value?.id) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.value.id)

      if (error) throw error
    } else {
      const { error } = await supabase
        .from('products')
        .insert(productData)

      if (error) throw error
    }

    await fetchProducts()
    resetForm()
  } catch (error) {
    console.error('Error saving product:', error)
    alert('Failed to save product')
  } finally {
    loading.value = false
  }
}

function editProduct(product: Product) {
  editingProduct.value = product
  form.value = { ...product }
  showForm.value = true
}

async function deleteProduct(id: string) {
  if (!confirm('Are you sure you want to delete this product?')) return

  try {
    loading.value = true
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error
    await fetchProducts()
  } catch (error) {
    console.error('Error deleting product:', error)
    alert('Failed to delete product')
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.value = {
    name: '',
    description: '',
    price: 0,
    stock: 0
  }
  editingProduct.value = null
  showForm.value = false
  errors.value = {}
}
</script>

<template>
  <div class="product-management">
    <div class="header">
      <h1>Product Management</h1>
      <button 
        class="add-button"
        @click="showForm = true"
        v-if="!showForm"
      >
        Add New Product
      </button>
    </div>

    <div v-if="showForm" class="product-form">
      <h2>{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            :class="{ 'error': errors.name }"
          >
          <span class="error-message" v-if="errors.name">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="form.description"
            :class="{ 'error': errors.description }"
          ></textarea>
          <span class="error-message" v-if="errors.description">{{ errors.description }}</span>
        </div>

        <div class="form-group">
          <label for="price">Price</label>
          <input
            id="price"
            v-model="form.price"
            type="text"
            :class="{ 'error': errors.price }"
          >
          <span class="error-message" v-if="errors.price">{{ errors.price }}</span>
        </div>

        <div class="form-group">
          <label for="stock">Stock</label>
          <input
            id="stock"
            v-model="form.stock"
            type="number"
            :class="{ 'error': errors.stock }"
          >
          <span class="error-message" v-if="errors.stock">{{ errors.stock }}</span>
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="loading">
            {{ loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product') }}
          </button>
          <button type="button" class="cancel-button" @click="resetForm">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <div v-if="loading && !showForm" class="loading">
      Loading products...
    </div>

    <div v-else-if="products.length === 0" class="no-products">
      No products found
    </div>

    <div v-else class="products-grid">
      <div 
        v-for="product in products" 
        :key="product.id"
        class="product-card"
      >
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <div class="product-details">
            <span class="price">€{{ product.price.toFixed(2) }}</span>
            <span class="stock">Stock: {{ product.stock }}</span>
          </div>
        </div>
        <div class="product-actions">
          <button 
            class="edit-button"
            @click="editProduct(product)"
          >
            Edit
          </button>
          <button 
            class="delete-button"
            @click="deleteProduct(product.id!)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$primary: #00ff88;
$secondary: #00ffff;
$danger: #ff4444;
$white: #fff;
$dark-bg: rgba(255, 255, 255, 0.05);
$border-color: rgba(255, 255, 255, 0.1);

.product-management {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    h1 {
      font-size: 2.5rem;
      color: $primary;
    }

    .add-button {
      padding: 0.75rem 1.5rem;
      background: linear-gradient(45deg, $primary, $secondary);
      border: none;
      border-radius: 25px;
      color: #000;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-2px);
      }
    }
  }

  .product-form {
    background: $dark-bg;
    padding: 2rem;
    border-radius: 15px;
    border: 1px solid $border-color;
    margin-bottom: 2rem;

    h2 {
      color: $white;
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        color: $white;
        margin-bottom: 0.5rem;
      }

      input,
      textarea {
        width: 100%;
        padding: 0.75rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid $border-color;
        border-radius: 5px;
        color: $white;

        &.error {
          border-color: $danger;
        }

        &:focus {
          outline: none;
          border-color: $primary;
        }
      }

      textarea {
        min-height: 100px;
        resize: vertical;
      }

      .error-message {
        color: $danger;
        font-size: 0.9rem;
        margin-top: 0.5rem;
      }
    }

    .form-actions {
      display: flex;
      gap: 1rem;

      button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 5px;
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

        &.cancel-button {
          background: $dark-bg;
          color: $white;
          border: 1px solid $border-color;
        }
      }
    }
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;

    .product-card {
      background: $dark-bg;
      padding: 1.5rem;
      border-radius: 15px;
      border: 1px solid $border-color;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);
      }

      .product-info {
        h3 {
          color: $primary;
          margin-bottom: 0.5rem;
        }

        p {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 1rem;
          line-height: 1.6;
        }

        .product-details {
          display: flex;
          justify-content: space-between;
          color: $white;

          .price {
            color: $secondary;
            font-weight: 600;
          }
        }
      }

      .product-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;

        button {
          flex: 1;
          padding: 0.5rem;
          border: none;
          border-radius: 5px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s ease;

          &:hover {
            transform: translateY(-2px);
          }

          &.edit-button {
            background: linear-gradient(45deg, $primary, $secondary);
            color: #000;
          }

          &.delete-button {
            background: $danger;
            color: $white;
          }
        }
      }
    }
  }

  .loading,
  .no-products {
    text-align: center;
    padding: 3rem;
    color: $white;
  }
}

@media (max-width: 768px) {
  .product-management {
    padding: 1rem;

    .header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;

      h1 {
        font-size: 2rem;
      }
    }

    .products-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style> 