<script setup>
import { inject, ref, reactive, onMounted, onBeforeUnmount } from "vue"
import io from "socket.io-client"

// #region global state
const userName = inject("userName")
// #endregion

// #region local variable
let socket = io()
const theme = ref(null);
const category = ref(null);

// #endregion


// #region lifecycle
// onMounted(() => {
//   registerSocketEvent()
// })

onMounted(() => {
    socket = io();
    socket.emit('join');
    socket.on('receive-theme', (receivedTheme) => {
        theme.value = receivedTheme;
        console.log(theme.value);

    })
    socket.on('receive-category', (receivedCategory) => {
        category.value = receivedCategory;
        console.log(receivedCategory);
    })
})


onBeforeUnmount(() => {
    socket.disconnect();
    socket.off('receive-theme')
});



// 退室メッセージをサーバに送信する
const onExit = () => {
    socket.emit("exitEvent", `${userName.value}さんが退室しました。`)

}



// #region socket event handler
// サーバから受信した入室メッセージ画面上に表示する
const onReceiveEnter = (data) => {
    chatList.unshift(data)
}

// サーバから受信した退室メッセージを受け取り画面上に表示する
const onReceiveExit = (data) => {
    chatList.unshift(data)
}
</script>

<template>
    <!-- <div class="mx-auto my-5 px-4"> -->
    <!-- <h1 class="text-h3 font-weight-medium">Vue.js Chat チャットルーム</h1> -->
    <div class="mt-10">
        <p>ログインユーザ：{{ userName }}さん</p>

        <div v-if="theme">{{ theme }}</div>
        <div v-if="category">{{ category }}</div>
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