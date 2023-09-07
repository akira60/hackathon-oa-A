<script>
import CenterChat from './CenterChat.vue';
import Cards from './Cards.vue';  // ".vue" 拡張子を追加することをお勧めします（もし必要であれば）
import Timer from './Timer.vue';
import Chat from './Chat.vue'

export default {
  components: {
    CenterChat,
    Chat,
    Cards,
    Timer
  }
}
</script>

<template>
  <div style="display: flex;"
       class="ma-15"
  >
    <Cards />
    <CenterChat />
    <!-- <Chat /> -->
    <Timer />
    
  </div>
  
</template>

<style scoped>
</style>
