<script setup>
import { inject, ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import io from "socket.io-client"
import UserList from "./UserList.vue";



// #region global state
let userName = inject("userName")
// #endregion

// #region local variable
const router = useRouter()
const socket = io()
// #endregion

// #region reactive variable
const inputUserName = ref("")
// サーバーサイドのUserListを受け取る
const userList = ref([]);

// #endregion

// #region browser event handler

// const myPlayerName = inject("myPlayerName")

// 接続したときにユーザー名を受信
onMounted(() => {
  socket.emit("userListBeforeLogin")
  socket.on("updateUserList", (users) => {
    userList.value = users;
    console.log(userList.value);
  });
})

// 入室メッセージをクライアントに送信する
const onEnter = () => {
  // userListに入力されたユーザー名が含まれているか確認
  socket.emit("userList", inputUserName.value)

  if (inputUserName.value.trim() === "") {
    alert('ユーザー名を入力してください。')
    return;
  }

  if (userList.value.includes(inputUserName.value)) {
    alert('そのユーザー名は既に使用されています。')
    return;
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
      <v-text-field label="ユーザ名" v-model="inputUserName" variant="solo-inverted"></v-text-field>

      <v-btn type="button" @click="onEnter">
        入室する
      </v-btn>
    </div>
  </div>
</template>


<style scoped></style>
