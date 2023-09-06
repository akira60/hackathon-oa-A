<script setup>
import { provide, ref ,reactive} from "vue"

// #region reactive state
const userName = ref("")
const voteList = reactive([]);
const showModal = ref(false);
// #endregion

// #region global variable
provide("userName", userName)
provide("voteList", voteList)
provide("showModal", showModal)
// #endregion

</script>

<template>
  <router-view />
</template>

<style scoped>
</style>
