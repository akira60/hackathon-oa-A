<script setup>
import { inject,} from "vue"
import io from "socket.io-client"
const userName = inject("userName")

const socket = io()

const showModal = inject("showModal");
const voteList = inject("voteList");

socket.on("submitMyName",(myName) => {
	voteList.push(myName)
	if (voteList.length == 3) {
		showModal.value = true;
	}
});

// 投票した名前を送信
const clickName = (voteName) => {
	socket.emit("submitVote", voteName)
};

let player1 = 0;
let player2 = 0;
let player3 = 0;
let player4 = 0;
let total_count = 0;
let loserList = [];
let loserName;

// 投票数集計
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

	// 投票者が四人になったら続ける
	total_count = player1 + player2 + player3 + player4;
	if (total_count == 4) {
		const playerCounts = [player1, player2, player3, player4];
		const maxCount = Math.max(...playerCounts);
		for (let i = 0; i < 4; i++) {
			if (playerCounts[i] === maxCount) {
				loserList.push(i);
			}
		}

		// もし最多投票数を持つプレイヤーが一人ならば
		if (loserList.length === 1) {
			const indexOfMax = loserList[0];
			let mostPlayer;
			switch (indexOfMax) {
			case 0:
				mostPlayer = userName.value;
				break;
			case 1:
				mostPlayer = voteList[0];
				break;
			case 2:
				mostPlayer = voteList[1];
				break;
			case 3:
				mostPlayer = voteList[2];
				break;
			default:
				mostPlayert = "エラー回避";
			}
			
			// モーダルを閉じ、結果を表示
			showModal.value = false;
			let resultWin = document.getElementById("result_win");
			resultWin.removeAttribute("hidden");

			loserName = mostPlayer;
			console.log("最多投票数:", maxCount);
			console.log("最多の投票数を持つプレイヤー:", mostPlayer);
		} else {
			// 最多投票数を持つプレイヤーが複数いた場合負けとする
			showModal.value = false;
			let resultLose = document.getElementById("result_lose");
			resultLose.removeAttribute("hidden");

			console.log("狼に逃げられてしまいました。")
		}
	}
});

</script>

<template>
	<div>
		<div hidden id="result_win">
			<h3>選ばれたのは…</h3>
			<h1>{{ loserName }}</h1>
		</div>

		<div hidden id="result_lose">
			<h1>狼に逃げられてしまいました...</h1>
		</div>
		
		<div v-if="showModal" id="overlay">
			<div id="contents">
				<h3>誰がワードウルフ？</h3>
				<img src="../images/question.png" alt="question" class="question">
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
	margin: 30px 50px 0px 0px;
	border: none;
	border-radius: 5px;
	cursor: pointer;

	display: inline-block;
	padding: 10px 40px;
	text-decoration: none;
	color: #FFF;
	background-image: linear-gradient(#6795fd 0%, #67ceff 100%);
	transition: .4s;
	font-size: 17px;
	font-weight: bold;
}
.button-container button:hover{
	background-image: linear-gradient(#6795fd 0%, #67ceff 70%);
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
	width: 752px;
	padding: 40px;
	background: #2b2b2b;
	text-align: center;
	color: #fff;
}
.question {
	position: absolute;
	z-index: -1; /* h3の下に配置 */
	top: 260px;
	left: 425px;
	width: 576px;
}
</style>

