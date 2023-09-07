export default (io, socket) => {
  // 入室メッセージをクライアントに送信する
  socket.on("enterEvent", (data) => {
    socket.broadcast.emit("enterEvent", data)
  })

  // 退室メッセージをクライアントに送信する
  socket.on("exitEvent", (data) => {
    socket.broadcast.emit("exitEvent", data)
  })

  // 投稿メッセージを送信する
  socket.on("publishEvent", (data) => {
    io.sockets.emit("publishEvent", data)
  })


  // カードを配る
  let players = [];
  const themes = [
    ["ショッピングモール", "商店街"],
    ["加湿器", "エアコン"],
    ["スマートスピーカー"], ["タブレット端末"],
  ]

  io.on('connection', (socket) => {
    players.push(socket);

    // とりあえずデフォルト4人でスタート
    if (players.length === 4) {
      //テーマを選ぶ
      const selectedTheme = shuffle(themes)[0];
      // ウルフを選ぶ
      const wolfPlayer = shuffle(players)[0];

      players.forEach(player => {
        if (player === wolfPlayer) {
          player.emit('receive-theme', selectedTheme[1]);
        } else {
          player.emit('receive-theme', selectedTheme[0]);
        }
      });

      players = [];
    }

    socket.on('disconnect', () => {
      const index = players.indexOf(socket);
      if (index > -1) {
        players.splice(index, 1);
      }
    });
  });

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // *********************
  // Timerイベント
  //スタートボタンが押された
  socket.on("start", (data)=>{
    console.log(data);
    if(!data){
      return;
    }
    socket.broadcast.emit("start", data);
  });

  //ストップボタンが押された
  socket.on("stop", (data)=>{
    console.log(data);
    if(!data){
      return;
    }
    socket.broadcast.emit("stop", data);
  });

  //終了ボタンが押されたもしくは、0秒になった
  socket.on("finishDiscussion", (data)=>{
    console.log(data);
    console.log("bbbb")
    if(!data){
      return;
    }
    socket.broadcast.emit("finish", data);
  });

  // タイマーが0になった時
  socket.on("finish", (data) => {
    socket.broadcast.emit("finish",data)
  })

  //1分追加ボタンが押された
  socket.on("add", (data)=>{
    console.log(data);
    if(!data){
      return;
    }
    socket.broadcast.emit("add", data);
  });

  // タイマーが0になった時
  socket.on("finishDiscussion2", (myName) => {
    socket.broadcast.emit("submitMyName",myName)
  })

  // 投票を行ったら他クライアントへ投票した名前を送信
  socket.on("submitVote", (voteName) => {
    io.sockets.emit("countVote", voteName)
  })

  // 一人がcountを増やすことはできるが、共有できなかったため保留するコード
  // let count = 0;
  // socket.on("finishDiscussion", (myName) => {
  //   socket.broadcast.emit("submitMyName",myName)
  //   count.push(myName);
  //   io.sockets.emit("counttest",count.length);
  //   if (count.length === 4) {
  //     io.sockets.emit("readyVote",count.length);
  //   }
  // })

  // const nameCounts = {};
  // let voteCount = [];

  // socket.on("submitVote", (voteName) => {
  //   if (!nameCounts[voteName]) {
  //     nameCounts[voteName] = 1;
  //   } else {
  //     nameCounts[voteName]++;
  //   }

  //   voteCount++;

  //   if (voteCount === 4) {

  //     let mostVoteName = [];
  //     let mostMember = 0;

  //     for (const name in nameCounts) {
  //       const count = nameCounts[name];

  //       if (count > mostMember) {
  //         mostVoteName = [name];
  //         mostMember = count;
  //       } else if (count === mostMember) {
  //         mostVoteName.push(name)
  //       }
  //     }
  //     socket.emit("resultName", { names: mostVoteName, count: mostMember });
  //   }
  // });

}