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

  socket.on("finishDiscussion", (myName) => {
    socket.broadcast.emit("submitMyName",myName)
  })
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

  const nameCounts = {};
  let voteCount = [];

  socket.on("submitVote", (voteName) => {
    if (!nameCounts[voteName]) {
      nameCounts[voteName] = 1;
    } else {
      nameCounts[voteName]++;
    }

    voteCount++;

    if (voteCount === 4) {

      let mostVoteName = [];
      let mostMember = 0;

      for (const name in nameCounts) {
        const count = nameCounts[name];

        if (count > mostMember) {
          mostVoteName = [name];
          mostMember = count;
        } else if (count === mostMember) {
          mostVoteName.push(name)
        }
      }
      socket.emit("resultName", { names: mostVoteName, count: mostMember });
    }
  });
}