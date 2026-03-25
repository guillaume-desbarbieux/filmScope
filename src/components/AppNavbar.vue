<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/" class="logo">Film<span>Scope</span></RouterLink>
    <ul>
      <li><RouterLink to="/">Accueil</RouterLink></li>
      <li><RouterLink to="/favorites">Favoris</RouterLink></li>
    </ul>
  </nav>
</template>

<style scoped>
nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 2rem;
  border-bottom: 0.5px solid var(--c-border);
  background: rgba(13, 13, 15, 0.92);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 10;
}
.logo {
  font-family: 'Playfair Display', serif;
  font-size: 1.35rem;
  text-decoration: none;
  color: var(--c-text);
}
.logo span {
  color: var(--c-amber);
}
ul {
  display: flex;
  gap: 2rem;
  list-style: none;
}
a {
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--c-muted);
  text-decoration: none;
  transition: color 0.2s;
}
a:hover,
a.router-link-active {
  color: var(--c-text);
  border-bottom: 1px solid var(--c-amber);
  padding-bottom: 2px;
}
</style>
