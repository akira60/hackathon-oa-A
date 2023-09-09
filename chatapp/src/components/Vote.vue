<script setup>
import { inject } from "vue"
import io from "socket.io-client"
const userName = inject("userName");
const whoWolf = inject("whoWolf");

const socket = io();

const showModal = inject("showModal");
const voteList = inject("voteList");

socket.on("submitMyName",(myName) => {
	voteList.push(myName)
	if (voteList.length == 3) {
		showModal.value = true;
	}
});

let voted = false;

// 投票した名前を送信
const clickName = (voteName) => {
	if (voted == false){
		socket.emit("submitVote", voteName);
		voted = true;
		let divContents = document.getElementById("contents");
		let divWaiting = document.getElementById("waiting");
		divContents.setAttribute("hidden","");
		divWaiting.removeAttribute("hidden")
	}
};

let player1 = 0;
let player2 = 0;
let player3 = 0;
let player4 = 0;
let total_count = 0;
let selectedList = [];
let selectedName;

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
				selectedList.push(i);
			}
		}

		// もし最多投票数を持つプレイヤーが一人ならば
		if (selectedList.length === 1) {
			const indexOfMax = selectedList[0];
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
			
			// もし自分が狼だったら名前を送り負けの画面にする
			if (whoWolf.value == "me") {
				socket.emit("imwolf", userName.value);
				showModal.value = false;
				let resultLose = document.getElementById("result_lose");
				resultLose.removeAttribute("hidden");
			// 自分が狼ではなかったら
			} else {
				socket.on("submitWolf", (wolfName) => {
					// 狼を当てられていたら勝ちの画面にする
					if (wolfName == mostPlayer) {
						showModal.value = false;
						let resultLose = document.getElementById("result_win");
						resultLose.removeAttribute("hidden");
					// 狼ではない人だったら負けの画面にする
					} else {
						showModal.value = false;
						let resultLose = document.getElementById("result_lose");
						resultLose.removeAttribute("hidden");
					}
				});
			}
		} else {
			// 最多投票数を持つプレイヤーが複数いた場合逃げられた（勝負は負け）の画面にする
			showModal.value = false;
			let resultLose = document.getElementById("result_escape");
			resultLose.removeAttribute("hidden");
		}
	}
});

</script>

<template>
	<div>
		<div class="box"></div>
		<div id="result_win" class="block, heading-034">
			<h1>選ばれたのは…</h1>
			<h1>すどうさんです。</h1>
			<!-- <h1>{{ selectedName }}でした。</h1> -->
			<h1>あなたは見事狼を当てました！</h1>
		</div>

		<div hidden id="result_lose" class="block">
			<h3>選ばれたのは…</h3>
			<h1>{{ selectedName }}でした。</h1>
			<h3>ですが狼ではなかったようです…</h3>
		</div>

		<div hidden id="result_escape" class="block">
			<h1>狼に逃げられてしまいました...</h1>
			<h1>投票数が同じになってしまったようです</h1>
		</div>
		
		<div v-if="showModal" id="overlay">
			<div id="waiting" hidden>
				<h3>あなたは怪しい人を指名しました。</h3>
				<h3>票が集まるまで待ちましょう。</h3>
			</div>
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

.box{
	height: 50px;
}
.block{
	position: absolute;
	top: 100px;
	left: calc(50% - 450px / 2);
}
/* #result_win {
  background-color: #ffdb58;
  color: #ff6b81;
  font-family: 'Arial Rounded MT Bold', sans-serif;
  text-align: center;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: inline-block;
  position: relative;
}

#result_win h1 {
  font-size: 28px;
  margin: 10px 0;
} */
.heading-034 {
    position: relative;
    margin: 0 0 25px 9px;
    padding: .5em .8em;
    background-color: rgb(251, 192, 45);
    color: #fff;
}

.heading-034::before {
    position: absolute;
    top: 0;
    left: -9px;
    z-index: 1;
    width: 5px;
    height: 135%;
    border-radius: 3px;
    background-color: #600;
    content: '';
}

.heading-034 span::before,
.heading-034 span::after {
    position: absolute;
    left: -9px;
    width: 20px;
    height: 3px;
    border-radius: 3px;
    background-color: #c99;
    content: '';
}

.heading-034 span::before {
    top: 44%;
    transform: rotate(-25deg);
}

.heading-034 span::after {
    top: 54%;
    transform: rotate(25deg);
}
</style>

