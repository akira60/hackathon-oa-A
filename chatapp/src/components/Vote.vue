<script setup>
import { inject, ref, reactive, onMounted, computed } from "vue"
import io from "socket.io-client"
const userName = inject("userName")

const socket = io()

const showModal = inject("showModal");
const voteList = inject("voteList");

// const startDiscussion = () => {
//       socket.emit("finishDiscussion", userName.value);
// };

socket.on("submitMyName",(myName) => {
	voteList.push(myName)
	if (voteList.length == 3) {
		showModal.value = true;
	}
});

const clickName = (voteName) => {
	socket.emit("submitVote", voteName)
};

let player1 = 0;
let player2 = 0;
let player3 = 0;
let player4 = 0;
let total_count = 0;

socket.on("countVote", (voteName) => {
	if (voteName == userName.value){
		player1++;
	}else if (voteName == voteList[0]){
		player2++;
	}else if (voteName == voteList[1]){
		player3++;
	}else if (voteName == voteList[2]){
		player4++;
	}

	total_count = player1 + player2 + player3 + player4;
	if (total_count == 4) {
		const playerCounts = [player1, player2, player3, player4];
		const maxCount = Math.max(...playerCounts);
		const indexOfMax = playerCounts.indexOf(maxCount);

		let playerWithMaxCount;
		switch (indexOfMax) {
		case 0:
			playerWithMaxCount = userName.value;
			break;
		case 1:
			playerWithMaxCount = voteList[0];
			break;
		case 2:
			playerWithMaxCount = voteList[1];
			break;
		case 3:
			playerWithMaxCount = voteList[2];
			break;
		default:
			playerWithMaxCount = "Unknown";
		}

		console.log("最大値:", maxCount);
		console.log("最大値を持つプレイヤー:", playerWithMaxCount);
	}
});

</script>

<template>
	<div>
		<!-- <button @click="startDiscussion">てすと</button> -->
		<p>Vote.vueのページ</p>
		
		<div v-if="showModal" id="overlay">
			<div id="contents">
				<h3>誰がワードウルフ？</h3>
				<br>
				<div class="button-container">
					<button v-for="name in voteList" :key="name" @click="clickName(name)">{{ name }}</button>
				</div>
			</div>
		</div>
	</div>
</template>
<style scoped>
.button-container {
	display: flex;
	flex-direction: row;
	justify-content: center;
}

.button-container button {
	margin-right: 10px;
	margin: 5px;
	padding: 10px 20px;
	background-color: #007bff;
	color: #fff;
	border: none;
	border-radius: 5px;
	cursor: pointer;
}

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

#contents {
	z-index: 2;
	width: 50%;
	padding: 1em;
	background: #fff;
}

</style>

