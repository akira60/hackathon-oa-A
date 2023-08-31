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

}