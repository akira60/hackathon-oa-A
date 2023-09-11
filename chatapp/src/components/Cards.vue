<script setup>
import { inject, ref, reactive, onMounted, onBeforeUnmount } from "vue"
import io from "socket.io-client"

// #region global state
const userName = inject("userName")
const whoWolf = inject("whoWolf");
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
    socket.on("wolfNotice", (data) => {
        if (data == "wolf"){
            whoWolf.value = "me";
        } else if (data = "human") {
            whoWolf.value = "other";
        }
    });
})

onBeforeUnmount(() => {
    socket.disconnect();
    socket.off('receive-theme')
});

// 退室メッセージをサーバに送信する
const onExit = () => {
    socket.emit("exitEvent", `${userName.value}さんが退室しました。`)
}

</script>

<template>
    <!-- <div class="mx-auto my-5 px-4"> -->
    <!-- <h1 class="text-h3 font-weight-medium">Vue.js Chat チャットルーム</h1> -->
    <div class="mt-10">
        <div class="login_user">ログインユーザ：{{ userName }}さん</div>
        <v-card color="#455A64" elevation="2" class="category-theme-card">
            <div v-if="category" class="category-text">{{ category }}</div>
            <div v-if="theme" class="theme-text">{{ theme }}</div>
            <div v-else class="theme-waiting">他の人が接続するのを<br>待っています</div>
        </v-card>
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

.category-theme-card {
    margin-top: 10px;
    padding: 32px;
    position: relative;
    width: 20rem;

}

.category-text {
    color: white;
    font-size: 18px;
    position: absolute;
    top: 8px;
    left: 8px;
}

.theme-text {
    color: white;
    font-size: 24px;
    text-align: center;
    margin-top: 16px;
}

.theme-waiting {
    color: rgba(255, 255, 255, 0.7);
    font-size: 18px;
    text-align: center;
    margin-top: 16px;
}

.login_user {
    display: inline-block;
    font-size: 26px;
}
</style>