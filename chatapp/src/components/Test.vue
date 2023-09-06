<script>
import CenterChat from './CenterChat.vue';
import Cards from './Cards.vue';  // ".vue" 拡張子を追加することをお勧めします（もし必要であれば）
import Timer from './Timer.vue';

export default {
  components: {
    CenterChat,
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
    <Timer />
    
  </div>
  
</template>

<style scoped>
</style>
