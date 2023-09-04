<script setup>
  import { ref, computed, resolveDirective } from "vue";

  // 初期値入力
  const min = ref(10);
  const sec = ref(0);
  // 開始ボタンが押されたかどうか
  const timerOn = ref(false);
  //setIntervalの返り値を入れておく変数止めるときに使う
  const timerObj = ref(null);
  //ゲーム中かどうか
  const game = ref(true);

  //timerの色初期値は黒
  const isColorRed = ref({
        color: "black"
  });

  // min, secを動かす関数
  const count = () =>{
    if(sec.value === 1 && min.value === 1){//01:00から赤く、大きくなる
      isColorRed.value = {
        color: "red"
      };
    }
    if(sec.value === 0 && min.value >= 1){//00秒かつ１分以上
      min.value--;
      sec.value = 59;
      
    }else if(sec.value === 0 && min.value === 0){//00:00のとき
      complete();
    }else{
      sec.value--;
    }
  };

  //開始ボタンを押したとき1秒ごとにcount関数を呼び出すtimerOn, gameにtrueを入れる関数
  const start = () =>{
    timerObj.value = setInterval(count, 1000);
    timerOn.value = true;
    game.value = true;
  };

  //ストップボタンを押したときsetIntervalを止めてtimerOnにfalseを入れる関数
  const stop = () =>{
    clearInterval(timerObj.value);
    timerOn.value = false;
  };

  //00:00か終了ボタンが押されたときsetIntervalを止めてgameをfalse,その他を初期値に戻す
  const complete = () =>{
    clearInterval(timerObj.value);
    timerOn.value = false;
    game.value = false;
    min.value = 10;
    sec.value = 0;
  };

  //時間が足りないときに1分プラスする関数
  const add = () =>{
    min.value += 1;
    isColorRed.value = {
      color: "black"
    };
  }

  //formatTimeにmin:secの形で代入する
  const formatTime = computed(() =>{
    //配列timeStringsにmin, secをString型で入れる（mapを使って条件をプラスする）
    const timeStrings = [min.value.toString(), sec.value.toString()].map(str =>{
      if(str.length < 2 ){//一桁の時0を付ける
        return "0" + str;
      }else{
        return str;
      }
    });
    //配列を区切り文字":"で結合してのformatTimeに返す
    return timeStrings;
  });

</script>

<template>
  <div class="timer">
    <div class="time" v-bind:style="[isColorRed]" v-if="game">
      {{ formatTime[0] }}
      <span v-bind:class="{colon: timerOn}" >
        :
      </span>
      {{ formatTime[1] }}
    </div>
    <div class="gameSet" v-if="!game">
      終了！
    </div>
    <!-- timerOnがfalseの時開始（start関数呼び出し）、trueの時ストップ（stop関数呼び出し）ボタンを表示 -->
    <v-btn v-on:click="start" v-if="!timerOn" class="Button" color="primary" elevation="2">スタート</v-btn>
    <v-btn v-on:click="stop" v-if="timerOn" class="Button" color="primary" elevation="2">ストップ</v-btn>
    <!-- 追加ボタン（add関数を呼び出し）を表示 -->
    <v-btn v-on:click="add" class="Button" color="primary" elevation="2">１分追加</v-btn>
    <v-btn v-on:click="complete" class="Button" color="primary" elevation="2">終了</v-btn>
  </div>
</template>

<style scoped>
.timer{
  text-align: center;
}
.time {
  display: inline-block;
  font-size: 26px;
}

.colon{/**真ん中の：を点滅させる */
  animation: flash 1s ease infinite;
  animation-delay: 0.5s;
}
@keyframes flash{
  0%, 100%{
    opacity: 1;
  }
  50%{
    opacity: 0;
  }
}
.Button{
  margin: 5px 0;
  width: 100%;
}
.gameSet{
  font-size: 26px;
  color: red;
  margin-left: 10px;
}
</style>
