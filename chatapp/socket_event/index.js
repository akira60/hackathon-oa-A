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

  const voteName = {};

  io.on('connection', (socket) => {
    socket.on("addVoteName", (name) => {
      const playerNumber = Object.keys(voteName).length + 1;
      const playerName = `player${playerNumber}`;
      voteName[playerName] = name

      socket.emit("sendPlayerName", playerName);
    })
  });
  

  let count_yonekura = 0;
  let count_sudo = 0;
  let count_morita = 0;
  let count_hara = 0;
  
  socket.on("voteEvent", (name) => {
    if (name == "yonekura")
      count_yonekura++
    if (name == "sudo")
      count_sudo++
    if (name == "morita")
      count_morita++
    if (name == "hara")
      count_hara++

    let total_count = count_yonekura + count_sudo + count_morita + count_hara;

    if (total_count == 3)
    maxValue = max(count_yonekura,count_sudo,count_morita,count_hara)
    io.sockets.emit("voteReturn", ansName)
  });

  
}