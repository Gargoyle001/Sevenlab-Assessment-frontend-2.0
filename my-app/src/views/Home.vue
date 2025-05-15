<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as THREE from 'three'

const router = useRouter()
const features = [
  {
    id: 1,
    title: 'AI Development',
    description: 'Custom AI solutions for your business needs',
    price: 299,
    icon: '🤖',
    category: 'ai'
  },
  {
    id: 2,
    title: 'Cloud Infrastructure',
    description: 'Scalable cloud solutions and management',
    price: 199,
    icon: '☁️',
    category: 'cloud'
  },
  {
    id: 3,
    title: 'Automation Tools',
    description: 'Streamline your workflow with automation',
    price: 149,
    icon: '⚡',
    category: 'automation'
  },
  {
    id: 4,
    title: 'Security Solutions',
    description: 'Enterprise-grade security implementation',
    price: 249,
    icon: '🔒',
    category: 'security'
  }
]

const techStack = [
  { name: 'Vue.js', icon: '/icons/vue.svg' },
  { name: 'TypeScript', icon: '/icons/typescript.svg' },
  { name: 'Node.js', icon: '/icons/nodejs.svg' },
  { name: 'Python', icon: '/icons/python.svg' },
  { name: 'TensorFlow', icon: '/icons/tensorflow.svg' },
  { name: 'AWS', icon: '/icons/aws.svg' }
]

const testimonials = [
  {
    id: 1,
    name: 'John Smith',
    role: 'CTO at TechCorp',
    content: 'The AI solutions provided have transformed our business operations.',
    avatar: '/avatars/john.jpg'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    role: 'Lead Developer',
    content: 'Incredible automation tools that saved us countless hours.',
    avatar: '/avatars/sarah.jpg'
  }
]

onMounted(() => {
  initThreeJS()
})

function initThreeJS() {
  const canvas = document.getElementById('hero-bg')
  if (!canvas) return

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ canvas: canvas as HTMLCanvasElement, alpha: true })
  
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.position.z = 5

  const geometry = new THREE.TorusGeometry(2, 0.5, 16, 100)
  const material = new THREE.MeshBasicMaterial({ 
    color: 0x00ff88,
    wireframe: true
  })
  const torus = new THREE.Mesh(geometry, material)
  scene.add(torus)

  function animate() {
    requestAnimationFrame(animate)
    torus.rotation.x += 0.01
    torus.rotation.y += 0.01
    renderer.render(scene, camera)
  }

  animate()

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
}

function navigateToMarketplace(category: string) {
  router.push({ 
    path: '/marketplace',
    query: { category }
  })
}
</script>

<template>
  <div class="home">
    <canvas id="hero-bg"></canvas>
    
    <section class="hero">
      <h1 class="hero-title">
        <span class="gradient-text">Innovate.</span>
        <span class="gradient-text">Automate.</span>
        <span class="gradient-text">Dominate.</span>
      </h1>
      <p class="hero-subtitle">
        Empowering businesses with cutting-edge AI and automation solutions
      </p>
      <router-link to="/marketplace" class="cta-button">
        Get Started
      </router-link>
    </section>

    <section class="features">
      <h2>Our Solutions</h2>
      <div class="features-grid">
        <div 
          v-for="feature in features" 
          :key="feature.id"
          class="feature-card"
          @click="navigateToMarketplace(feature.category)"
        >
          <div class="feature-icon">{{ feature.icon }}</div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
          <div class="feature-price">
            Starting at ${{ feature.price }}/mo
          </div>
          <button class="feature-button">Learn More</button>
        </div>
      </div>
    </section>

    <section class="tech-stack">
      <h2>Tech Stack</h2>
      <div class="tech-grid">
        <div 
          v-for="tech in techStack" 
          :key="tech.name"
          class="tech-item"
        >
          <img :src="tech.icon" :alt="tech.name">
          <span>{{ tech.name }}</span>
        </div>
      </div>
    </section>

    <section class="testimonials">
      <h2>What Our Clients Say</h2>
      <div class="testimonials-grid">
        <div 
          v-for="testimonial in testimonials" 
          :key="testimonial.id"
          class="testimonial-card"
        >
          <img 
            :src="testimonial.avatar" 
            :alt="testimonial.name"
            class="testimonial-avatar"
          >
          <p class="testimonial-content">{{ testimonial.content }}</p>
          <div class="testimonial-author">
            <strong>{{ testimonial.name }}</strong>
            <span>{{ testimonial.role }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  position: relative;
  min-height: 100vh;
}

#hero-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.hero {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 2rem;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 2rem;
}

.gradient-text {
  display: block;
  background: linear-gradient(45deg, #00ff88, #00ffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Orbitron', sans-serif;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 3rem;
  color: #ffffff;
  max-width: 600px;
}

.cta-button {
  padding: 1rem 3rem;
  font-size: 1.2rem;
  background: linear-gradient(45deg, #00ff88, #00ffff);
  border: none;
  border-radius: 30px;
  color: #000;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
}

section {
  padding: 6rem 2rem;
}

h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 4rem;
  color: #00ff88;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #00ff88;
  margin-bottom: 1rem;
}

.feature-price {
  margin: 1rem 0;
  color: #00ffff;
}

.feature-button {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(45deg, #00ff88, #00ffff);
  border: none;
  border-radius: 5px;
  color: #000;
  font-weight: 600;
  cursor: pointer;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.tech-item img {
  width: 60px;
  height: 60px;
  transition: transform 0.3s ease;
}

.tech-item:hover img {
  transform: scale(1.1);
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.testimonial-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.testimonial-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.testimonial-content {
  font-style: italic;
  margin-bottom: 1rem;
  color: #ffffff;
}

.testimonial-author {
  display: flex;
  flex-direction: column;
}

.testimonial-author strong {
  color: #00ff88;
}

.testimonial-author span {
  color: #00ffff;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 3rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  section {
    padding: 4rem 1rem;
  }
}
</style> 