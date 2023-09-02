<script setup>
import { inject, provide, ref, reactive, onMounted } from "vue"
import io from "socket.io-client"
import Input from "./parts/Input.vue"

// #region global state
const userName = inject("userName")
// #endregion

// #region local variable
const socket = io()
// #endregion

// #region reactive variable
const chatContent = ref("")
const chatList = reactive([])

provide("chatList", chatList)
// #endregion

// #region lifecycle
// onMounted(() => {
//   registerSocketEvent()
// })

onMounted(() => {
  registerSocketEvent()
  // メッセージ表示イベント（receiveMessageEvent）を受信する
  socket.on("publishEvent", (data) => {
    // 画面上にメッセージを表示
    chatList.unshift(data)
  })
})

// #endregion

// #region browser event handler
// 投稿メッセージをサーバに送信する
const onPublish = () => {
  const sendText = userName.value + 'さん：' + chatContent.value
  console.log(userName.value)

  // 入力欄を初期化
  chatContent.value = ""
  socket.emit("publishEvent",sendText)


}

// 退室メッセージをサーバに送信する
const onExit = () => {
  socket.emit("exitEvent", `${userName.value}さんが退室しました。`)

}

// メモを画面上に表示する
const onMemo = () => {
  // メモの内容を表示
  chatContent.value = userName.value + "さんのメモ：" + chatContent.value
  chatList.unshift(chatContent.value)

  // 入力欄を初期化
  chatContent.value = ""
}
// #endregion

// #region socket event handler
// サーバから受信した入室メッセージ画面上に表示する
const onReceiveEnter = (data) => {
  chatList.unshift(data)
}

// サーバから受信した退室メッセージを受け取り画面上に表示する
const onReceiveExit = (data) => {
  chatList.unshift(data)
}

// サーバから受信した投稿メッセージを画面上に表示する
// const onReceivePublish = (data) => {
//   socket.on('')
//   chatList.push()
// }
// #endregion

// #region local methods
// イベント登録をまとめる
const registerSocketEvent = () => {
  // 入室イベントを受け取ったら実行
  socket.emit("enterEvent", `${userName.value}さんが入室しました。`)
  socket.on("enterEvent", (data) => {
    // 画面上にメッセージを表示
    onReceiveEnter(data)
  });

  // 退室イベントを受け取ったら実行
  socket.on("exitEvent", (data) => {
    onReceiveExit(data)
  })

  // 投稿イベントを受け取ったら実行
  socket.on("publishEvent", (data) => {

  })
}
// #endregion
</script>

<template>
  <div class="mx-auto my-5 px-4">
    <div class="mt-10">


      <!-- <p>ログインユーザ：{{ userName }}さん</p> -->

      <v-textarea
        label="発言を入力してください。Tips:質問は最大の攻撃です"
        v-model="chatContent"
        prepend-icon="$vuetify"
        variant="solo-inverted"
        class="area"
      ></v-textarea>

      <div class="mt-5">
        <v-btn 
          type="button" 
          @click="onPublish" 
          class="button-normal">
          発言
        </v-btn>
      </div>
      <!-- <textarea v-model="chatContent" variant="outlined" placeholder="発言を入力してください" rows="2" class="area"></textarea> -->

      
      <!-- <div class="mt-5">
        <button type="button" @click="onPublish" class="button-normal">発言</button>
      </div> -->


      <!-- <div class="mt-5" v-if="chatList.length !== 0">
        <v-list lines="one">
          <v-list-item
            v-for="(chat, i) in chatList"
            :key="i"
          >{{ chat }}</v-list-item>
        </v-list>
      </div> -->

      <!-- <div class="mt-5" v-if="chatList.length !== 0">
          <ul>
            <li class="item mt-4" v-for="(chat, i) in chatList" :key="i">{{ chat }}</li>
          </ul>
      </div> -->

      <Input :style="{ marginTop: '10px', width: '600px' }" />


    </div>
  </div>



</template>

<style scoped>
.link {
  text-decoration: none;
}

.area {
  width: 500px;
  margin-top: 8px;
}

.item {
  display: block;
}

.util-ml-8px {
  margin-left: 8px;
}

.button-exit {
  color: #000;
  margin-top: 8px;
}

</style>