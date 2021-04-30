<template>
  <router-view></router-view>
  <ChangeEnv></ChangeEnv>
</template>

<script>
import ChangeEnv from "./components/changeEnv/ChangeEnv.vue"
export default {
  components: {
    ChangeEnv
  }
}

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
