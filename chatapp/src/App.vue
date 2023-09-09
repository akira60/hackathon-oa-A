<script setup>
import { provide, ref ,reactive} from "vue"

// #region reactive state
const userName = ref("")
const voteList = reactive([]);
const showModal = ref(false);
const whoWolf = ref("");
// #endregion

// #region global variable
provide("userName", userName)
provide("voteList", voteList)
provide("showModal", showModal)
provide("whoWolf", whoWolf)
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

/* .container{
  
} */
</style>
