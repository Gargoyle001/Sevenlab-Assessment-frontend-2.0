<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<style lang="scss" scoped>
$primary: #00ff88;
$secondary: #00ffff;
$white: #fff;
$dark-bg: rgba(255, 255, 255, 0.05);
$border-color: rgba(255, 255, 255, 0.1);

.about {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    font-size: 2.5rem;
    color: $primary;
    margin-bottom: 2rem;
    text-align: center;
  }

  .about-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: start;

    .about-text {
      h2 {
        color: $white;
        margin-bottom: 1.5rem;
        font-size: 2rem;
      }

      p {
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.8;
        margin-bottom: 1.5rem;
      }

      .mission {
        background: $dark-bg;
        padding: 2rem;
        border-radius: 15px;
        border: 1px solid $border-color;
        margin-top: 2rem;

        h3 {
          color: $primary;
          margin-bottom: 1rem;
        }

        p {
          margin-bottom: 0;
        }
      }
    }

    .team-section {
      h2 {
        color: $white;
        margin-bottom: 2rem;
        font-size: 2rem;
      }

      .team-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;

        .team-member {
          background: $dark-bg;
          padding: 2rem;
          border-radius: 15px;
          border: 1px solid $border-color;
          text-align: center;
          transition: transform 0.3s ease;

          &:hover {
            transform: translateY(-5px);
          }

          .avatar {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            margin: 0 auto 1.5rem;
            border: 3px solid $primary;
          }

          h3 {
            color: $white;
            margin-bottom: 0.5rem;
          }

          .role {
            color: $secondary;
            margin-bottom: 1rem;
          }

          .bio {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
            line-height: 1.6;
          }

          .social-links {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 1.5rem;

            a {
              color: $white;
              font-size: 1.2rem;
              transition: color 0.3s ease;

              &:hover {
                color: $primary;
              }
            }
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .about {
    padding: 1rem;

    h1 {
      font-size: 2rem;
    }

    .about-content {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }
}
</style>
