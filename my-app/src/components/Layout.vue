<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'

const userStore = useUserStore()
const cartStore = useCartStore()

const buzzwords = [
  'AI-Powered Solutions',
  'Next-Gen Technology',
  'Cloud Innovation',
  'Smart Automation'
]

const currentBuzzword = ref(buzzwords[0])
let buzzwordIndex = 0

onMounted(() => {
  initParticles()
  startBuzzwordRotation()
})

function initParticles() {
  // We'll implement this with a particle library later
}

function startBuzzwordRotation() {
  setInterval(() => {
    buzzwordIndex = (buzzwordIndex + 1) % buzzwords.length
    currentBuzzword.value = buzzwords[buzzwordIndex]
  }, 3000)
}
</script>

<template>
  <div class="app-container">
    <nav class="main-nav">
      <router-link to="/" class="logo">
        TechVision
      </router-link>
      
      <div class="nav-links">
        <router-link to="/marketplace">Marketplace</router-link>
        <router-link to="/features">Features</router-link>
        <router-link to="/tech-stack">Tech Stack</router-link>
        <router-link to="/contact">Contact</router-link>
      </div>

      <div class="nav-actions">
        <router-link v-if="cartStore.itemCount" to="/cart" class="cart-icon">
          Cart ({{ cartStore.itemCount }})
        </router-link>
        <template v-if="userStore.user">
          <router-link to="/account">Account</router-link>
          <button @click="userStore.signOut" class="sign-out-btn">Sign Out</button>
        </template>
        <template v-else>
          <router-link to="/auth" class="auth-btn">Sign In</router-link>
        </template>
      </div>
    </nav>

    <main>
      <slot></slot>
    </main>

    <footer class="main-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>About Us</h3>
          <p>Innovating the future through cutting-edge technology solutions.</p>
        </div>
        <div class="footer-section">
          <h3>Contact</h3>
          <p>info@techvision.com</p>
          <p>+1 (555) 123-4567</p>
        </div>
        <div class="footer-section">
          <h3>Follow Us</h3>
          <div class="social-links">
            <a href="#" target="_blank">Twitter</a>
            <a href="#" target="_blank">LinkedIn</a>
            <a href="#" target="_blank">GitHub</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 TechVision. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #0a0a0a;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
}

.main-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  color: #00ff88;
  text-decoration: none;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #00ff88;
}

.nav-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.auth-btn {
  padding: 0.5rem 1.5rem;
  background: linear-gradient(45deg, #00ff88, #00ffff);
  border: none;
  border-radius: 25px;
  color: #000;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.auth-btn:hover {
  transform: translateY(-2px);
}

.cart-icon {
  color: #ffffff;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

main {
  padding-top: 80px;
  min-height: calc(100vh - 300px);
}

.main-footer {
  background: rgba(15, 15, 15, 0.95);
  padding: 3rem 2rem 1rem;
  margin-top: 4rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-section h3 {
  color: #00ff88;
  margin-bottom: 1rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-links a {
  color: #ffffff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.social-links a:hover {
  color: #00ff88;
}

.footer-bottom {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style> 