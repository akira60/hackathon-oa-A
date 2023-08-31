<script setup>
import { inject, ref, reactive, onMounted, onBeforeUnmount } from "vue"
import io from "socket.io-client"

// #region global state
const userName = inject("userName")
// #endregion

// #region local variable
const socket = io()
const theme = ref(null);
// #endregion


// #region lifecycle
// onMounted(() => {
//   registerSocketEvent()
// })

onMounted(() => {
    socket.on('receive-theme', (receivedTheme) => {
        theme.value = receivedTheme;
    })
})


onBeforeUnmount(() => {
    socket.disconnect();
});



// #region browser event handler
// 投稿メッセージをサーバに送信する
const onPublish = () => {
    const sendText = userName.value + 'さん：' + chatContent.value
    console.log(userName.value)

    // 入力欄を初期化
    chatContent.value = ""
    socket.emit("publishEvent", sendText)


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
    <!-- <div class="mx-auto my-5 px-4"> -->
    <!-- <h1 class="text-h3 font-weight-medium">Vue.js Chat チャットルーム</h1> -->
    <div class="mt-10">
        <p>ログインユーザ：{{ userName }}さん</p>

        <div v-if="theme">{{ theme }}</div>
        <router-link to="/" class="link">
            <button type="button" class="button-normal button-exit" @click="onExit">退室する</button>
        </router-link>
    </div>
</template>

<style scoped>
.link {
    text-decoration: none;
}

.area {
    width: 500px;
    border: 1px solid #000;
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