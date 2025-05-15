<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

const email = ref('')
const name = ref('')
const message = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref('')

const socialLinks = [
  {
    name: 'Twitter',
    icon: 'twitter',
    url: 'https://twitter.com/techvision',
    color: '#1DA1F2'
  },
  {
    name: 'LinkedIn',
    icon: 'linkedin',
    url: 'https://linkedin.com/company/techvision',
    color: '#0077B5'
  },
  {
    name: 'GitHub',
    icon: 'github',
    url: 'https://github.com/techvision',
    color: '#333'
  },
  {
    name: 'Instagram',
    icon: 'instagram',
    url: 'https://instagram.com/techvision',
    color: '#E1306C'
  }
]

async function handleSubmit() {
  try {
    loading.value = true
    error.value = ''

    // Validate inputs
    if (!email.value || !name.value) {
      error.value = 'Please fill in all required fields'
      return
    }

    // Store contact form submission
    const { error: submitError } = await supabase
      .from('contact_submissions')
      .insert({
        email: email.value,
        name: name.value,
        message: message.value
      })

    if (submitError) throw submitError

    // Send welcome email
    const { error: emailError } = await supabase.functions.invoke('send-welcome-email', {
      body: {
        email: email.value,
        name: name.value
      }
    })

    if (emailError) throw emailError

    success.value = true
    email.value = ''
    name.value = ''
    message.value = ''
  } catch (err) {
    console.error('Error submitting form:', err)
    error.value = 'Failed to submit form. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="contact">
    <div class="contact-content">
      <div class="contact-info">
        <h1>Get in Touch</h1>
        <p class="subtitle">
          Join our community of innovators and stay updated with the latest tech trends
        </p>

        <div class="social-links">
          <a 
            v-for="link in socialLinks"
            :key="link.name"
            :href="link.url"
            target="_blank"
            class="social-link"
            :style="{ '--glow-color': link.color }"
          >
            <i :class="['fab', 'fa-' + link.icon]"></i>
            <span>{{ link.name }}</span>
          </a>
        </div>
      </div>

      <form class="contact-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Name</label>
          <input 
            id="name"
            v-model="name"
            type="text"
            placeholder="Your name"
            required
          >
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="email"
            type="email"
            placeholder="your@email.com"
            required
          >
        </div>

        <div class="form-group">
          <label for="message">Message (Optional)</label>
          <textarea 
            id="message"
            v-model="message"
            placeholder="Tell us what's on your mind..."
            rows="4"
          ></textarea>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          Thank you for reaching out! We'll be in touch soon.
        </div>

        <button 
          type="submit"
          class="submit-btn"
          :disabled="loading"
        >
          {{ loading ? 'Sending...' : 'Send Message' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.contact {
  padding: 4rem 2rem;
  min-height: calc(100vh - 300px);
}

.contact-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.contact-info {
  color: #ffffff;
}

h1 {
  font-size: 3rem;
  color: #00ff88;
  margin-bottom: 1rem;
  font-family: 'Orbitron', sans-serif;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 3rem;
  color: #ffffff;
  opacity: 0.8;
}

.social-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  color: #ffffff;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.social-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 20px var(--glow-color);
  border-color: var(--glow-color);
}

.social-link i {
  font-size: 1.5rem;
  color: var(--glow-color);
}

.contact-form {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #ffffff;
}

input,
textarea {
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  color: #ffffff;
  transition: all 0.3s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #00ff88;
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(45deg, #00ff88, #00ffff);
  border: none;
  border-radius: 5px;
  color: #000;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  color: #ff4444;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 5px;
}

.success-message {
  color: #00ff88;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(0, 255, 136, 0.1);
  border-radius: 5px;
}

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .social-links {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 2.5rem;
  }
}
</style> 