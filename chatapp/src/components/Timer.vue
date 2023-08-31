<script setup>
  import { ref, computed } from "vue";

  const min = ref(1);
  const sec = ref(0);
  const timerOn = ref(false);
  const timerObj = ref(null);

  const count = () =>{
    if(sec.value <= 0 && min.value >= 1){
      min.value--;
      sec.value = 59;
    }else if(sec.value <= 0 && min.value <= 0){
      complete();
    }else{
      sec.value--;
    }
  };

  const start = () =>{
    timerObj.value = setInterval(count, 1000);
    timerOn.value = true;
  };

  const stop = () =>{
    clearInterval(timerObj.value);
    timerOn.value = false;
  };

  const complete = () =>{
    clearInterval(timerObj.value);
    min.value = 10;
    sec.value = 0;
    timerOn.value = false;
  };

  const add = () =>{
    min.value += 3;
  }

  const isColorRed = computed(() =>{
    const isColorRed = ref(true);
    if(min.value <= 0){
        isColorRed = true;
    }else{
        isColorRed = false;
    }
    return isColorRed;
  });

  const formatTime = computed(() =>{
    const timeStrings = [min.value.toString(), sec.value.toString()].map(str =>{
      if(str.length < 2 ){
        return "0" + str;
      }else{
        return str;
      }
    });
    return timeStrings.join(":");
  });

</script>

<template>
  <div id="timer">
    <div class="timer">
      <!-- <transition> -->
        <div  class="time">
            {{ formatTime }}
        </div>
      <!-- </transition> -->
      <button v-on:click="start" v-if="!timerOn">Start</button>
      <button v-on:click="stop" v-if="timerOn">Stop</button>
      <button v-on:click="add" class="addButton">Add</button>
    </div>
  </div>
</template>

<style scoped>
#timer{
    display: inline-block;
}
.time {
  font-size: 50px;
}

button{
    margin: 0 10px;    
}
/* 
.v-enter-active,.vleave-active{
    transitionn: opacity 1s ease;
}
.v-enter-from, .b-leave-to{
    opacity: 0;
} */
.colorRed{
    color: red;
}

</style>
