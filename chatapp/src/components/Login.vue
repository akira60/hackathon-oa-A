<script setup>
import { inject, ref } from "vue"
import { useRouter } from "vue-router"
import io from "socket.io-client"



// #region global state
let userName = inject("userName")
// #endregion

// #region local variable
const router = useRouter()
const socket = io()
// #endregion

// #region reactive variable
const inputUserName = ref("")
// #endregion

// #region browser event handler

// const myPlayerName = inject("myPlayerName")

// 入室メッセージをクライアントに送信する
const onEnter = () => {
  // ユーザー名が入力されているかチェック

  if (inputUserName.value.trim() === "") {
    alert('ユーザー名を入力してください。')
  }
  // 入室メッセージを送信
  else {
    // 全体で使用するnameに入力されたユーザー名を格納
    userName.value = inputUserName.value

    // チャット画面へ遷移
    // router.push({ name: "chat" })
    router.push({ name: "test" })


    socket.emit("enterMyselfEvent", "あなたが接続しました。")
    socket.emit("enterOtherEvent", "他のクライアントが接続しました。")

    // socket.emit("addVoteName", userName.value)
    // socket.on("sendPlayerName", (playerName) => {
    //   myPlayerName.value = playerName
    //   console.log(`あなたのプレイヤー名は ${playerName} です。`)
    //   console.log(myPlayerName.value)
    // })

    // チャット画面へ遷移
    // router.push({ name: "chat" })

  }
}
// #endregion
</script>

<template>
  <div style="display: flex; align-items: center; justify-content: center; height: 50vh;">
    <div style="width: 300px; text-align: center;">
      <v-text-field 
        label="ユーザ名"
        v-model="inputUserName"
        variant="solo-inverted"
      ></v-text-field>
      
      <v-btn 
        type="button" 
        @click="onEnter"
      >
        入室する
      </v-btn>
    </div>
  </div>
</template>


<style scoped>

</style>
