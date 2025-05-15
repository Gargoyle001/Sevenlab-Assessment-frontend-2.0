<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You've successfully created a project with
      <a href="https://vite.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>. What's next?
    </h3>
  </div>
</template>

<style lang="scss" scoped>
$primary: #00ff88;
$secondary: #00ffff;
$white: #fff;
$dark-bg: rgba(255, 255, 255, 0.05);
$border-color: rgba(255, 255, 255, 0.1);

.hello-world {
  text-align: center;
  padding: 2rem;

  h1 {
    font-size: 2.5rem;
    color: $primary;
    margin-bottom: 1rem;
  }

  .subtitle {
    color: $white;
    margin-bottom: 2rem;
  }

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;

    .feature {
      background: $dark-bg;
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

  .cta-section {
    margin-top: 4rem;

    .cta-button {
      display: inline-block;
      padding: 1rem 2rem;
      background: linear-gradient(45deg, $primary, $secondary);
      border: none;
      border-radius: 25px;
      color: #000;
      font-weight: 600;
      text-decoration: none;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-2px);
      }
    }
  }
}

@media (max-width: 768px) {
  .hello-world {
    padding: 1rem;

    h1 {
      font-size: 2rem;
    }

    .features {
      grid-template-columns: 1fr;
    }
  }
}
</style>
