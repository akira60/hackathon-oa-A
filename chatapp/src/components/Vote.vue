<script setup>
import { inject, ref, reactive, onMounted } from "vue"
import io from "socket.io-client"
const userName = inject("userName")
const players = inject("players")

const socket = io()

const message = "test"

socket.on("sendPlayerName", (playerName) => {
	console.log(`あなたのプレイヤー名は ${playerName} です。`)
})

</script>

<template>
	<button >投票する</button>
	<div v-if="showModal" class="modal">
		<p>狼だと思う人に投票してください。</p>
		<button @click="vote('yonekura')">Yonekura</button>
		<button @click="vote('sudo')">Sudo</button>
		<button @click="vote('morita')">Morita</button>
		<button @click="vote('hara')">Hara</button>
	</div>
	<!-- <div id="overlay">
		<div id="content">
			<p>狼だと思う人に投票してください。</p>
			<button v-for="player in players" @click="sendVote(player)">{{ players }}</button>
		</div>
	</div> -->
</template>
<style scoped>
#overlay{
  z-index:1;

  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color:rgba(0,0,0,0.5);

  display: flex;
  align-items: center;
  justify-content: center;

}
</style>

