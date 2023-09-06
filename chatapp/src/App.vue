<script setup>
import { provide, ref } from "vue"

// #region reactive state
const userName = ref("")
// #endregion

// #region global variable
provide("userName", userName)
// #endregion
</script>

<template>
  <v-app>

    <v-app-bar color="#FBC02D">
      <v-app-bar-title>
        Word Wolf
      </v-app-bar-title>
    </v-app-bar>

    <div class="container">
      <router-view />
      <img src="./images/wolf.png" alt="Overlay Image">
    </div>

  </v-app>

</template>

<style scoped>
.v-application {
  background: linear-gradient(to right, #f3f1ec, #d9d2d2);
}

.container{
  
}
</style>
