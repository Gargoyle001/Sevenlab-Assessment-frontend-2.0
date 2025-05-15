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

<style lang="scss" scoped>
$primary: #00ff88;
$secondary: #00ffff;
$white: #fff;
$dark-bg: rgba(255, 255, 255, 0.05);
$border-color: rgba(255, 255, 255, 0.1);

.home {
  position: relative;
  min-height: 100vh;

  #hero-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding: 2rem;

    .hero-content {
      text-align: center;
      z-index: 1;
      max-width: 800px;

      h1 {
        font-size: 4rem;
        color: $primary;
        margin-bottom: 1.5rem;
        font-family: 'Orbitron', sans-serif;
      }

      p {
        font-size: 1.2rem;
        color: $white;
        margin-bottom: 2rem;
        opacity: 0.9;
      }

      .cta-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;

        .primary-btn,
        .secondary-btn {
          padding: 1rem 2rem;
          border-radius: 30px;
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.3s ease;

          &:hover {
            transform: translateY(-2px);
          }
        }

        .primary-btn {
          background: linear-gradient(45deg, $primary, $secondary);
          color: #000;
        }

        .secondary-btn {
          background: $dark-bg;
          color: $white;
          border: 1px solid $border-color;
        }
      }
    }
  }

  .features {
    padding: 6rem 2rem;
    background: $dark-bg;

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;

      .feature-card {
        background: rgba(255, 255, 255, 0.05);
        padding: 2rem;
        border-radius: 15px;
        border: 1px solid $border-color;
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-5px);
        }

        .icon {
          font-size: 2.5rem;
          color: $primary;
          margin-bottom: 1rem;
        }

        h3 {
          color: $white;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        p {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
        }
      }
    }
  }

  .tech-stack {
    padding: 6rem 2rem;
    text-align: center;

    h2 {
      font-size: 2.5rem;
      color: $primary;
      margin-bottom: 3rem;
    }

    .tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;

      .tech-item {
        background: $dark-bg;
        padding: 1.5rem;
        border-radius: 10px;
        border: 1px solid $border-color;
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.05);
        }

        .icon {
          font-size: 2rem;
          color: $secondary;
          margin-bottom: 1rem;
        }

        h3 {
          color: $white;
          font-size: 1.2rem;
        }
      }
    }
  }

  .testimonials {
    padding: 6rem 2rem;
    background: $dark-bg;

    h2 {
      font-size: 2.5rem;
      color: $primary;
      text-align: center;
      margin-bottom: 3rem;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;

      .testimonial-card {
        background: rgba(255, 255, 255, 0.05);
        padding: 2rem;
        border-radius: 15px;
        border: 1px solid $border-color;

        .quote {
          color: $white;
          font-style: italic;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .author {
          display: flex;
          align-items: center;
          gap: 1rem;

          .avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
          }

          .author-info {
            h4 {
              color: $primary;
              margin-bottom: 0.25rem;
            }

            p {
              color: rgba(255, 255, 255, 0.7);
              font-size: 0.9rem;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .home {
    .hero {
      .hero-content {
        h1 {
          font-size: 2.5rem;
        }

        .cta-buttons {
          flex-direction: column;
        }
      }
    }
  }
}
</style> 