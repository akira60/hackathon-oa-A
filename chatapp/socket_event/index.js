import createCard from "../db/index.js";

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
  let themes = [];
  // let isThemeSelecting = false;

  //　Cardテーブルの一列目を多数派、二列目を少数派、三列目をcategory_idとして取得
  io.on('connection', (socket) => {
    // なぜかクライアント側で何回も接続が起こっている。それを防ぐために1ユーザーあたりのjoinの回数を制限
    if (!socket.listeners('join').length) {
      socket.on('join', () => {
        players.push(socket);
        console.log(players.length)
        console.log(`Client connected: ${socket.id}`);

        // とりあえずデフォルト4人でスタート
        if (players.length === 4) {
          createCard()
            .then((fetchedThemes) => {
              themes = fetchedThemes;

              //テーマを選ぶ
              const selectedTheme = shuffle(themes)[0];
              console.log(selectedTheme);

              // ウルフを選ぶ
              const wolfPlayer = shuffle(players)[0];
              console.log(wolfPlayer.id)

              players.forEach(player => {
                if (player === wolfPlayer) {
                  player.emit('receive-theme', selectedTheme[1]);
                  player.emit('receive-category', selectedTheme[2]);

                } else {
                  player.emit('receive-theme', selectedTheme[0]);
                  player.emit('receive-category', selectedTheme[2]);

                }
                // socket.emit('receive-category', selectedTheme[2]);

              });
              players.forEach(player => {
              });
              players = [];
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });

    }



    socket.on('disconnect', () => {
      const index = players.indexOf(socket);
      console.log(`Client disconnected: ${socket.id}`);
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