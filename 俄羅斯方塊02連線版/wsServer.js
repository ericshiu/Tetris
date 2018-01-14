var app = require('http').createServer();
var io = require('socket.io')(app);
var PORT = 3000;
//客戶端記述
var clientCount = 0;
var stocketMap = {};
app.listen(PORT);

var bindListener = function(socket, evet) {
  socket.on(evet, function(data) {
    if (socket.clientNum % 2 == 0) {
      if (stocketMap[socket.clientNum - 1]) {
        stocketMap[socket.clientNum - 1].emit(evet, data);
      }
    } else {
      if (stocketMap[socket.clientNum + 1]) {
        stocketMap[socket.clientNum + 1].emit(evet, data);
      }
    }
  });
};

io.on('connection', function(socket) {
  clientCount++;
  socket.clientNum = clientCount;
  stocketMap[clientCount] = socket;

  if (clientCount % 2 == 1) {
    socket.emit('waiting', '等待其他玩家');
  } else {
    socket.emit('start');
    if (stocketMap[(clientCount - 1)]) {
      stocketMap[(clientCount - 1)].emit('start');
    } else {
      socket.emit('leave');
    }
  }
  bindListener(socket, 'init');
  bindListener(socket, 'next');
  bindListener(socket, 'rotate');
  bindListener(socket, 'right');
  bindListener(socket, 'down');
  bindListener(socket, 'left');
  bindListener(socket, 'fall');
  bindListener(socket, 'fixed');
  bindListener(socket, 'line');
  bindListener(socket, 'time');
  bindListener(socket, 'lose');
  bindListener(socket, 'bottomLines');
  bindListener(socket, 'addTailLines');

  // //客戶端連接近來
  // io.emit('enter', socket.nickname + ' come in')
  // socket.on('message', function(str) {
  //     io.emit('message', socket.nickname + ' says:' + str)
  // })
  //客戶端斷開
  socket.on('disconnect', function() {
    if (socket.clientNum % 2 == 0) {
      if (stocketMap[socket.clientNum - 1]) {
        stocketMap[socket.clientNum - 1].emit('leave');
      }
    } else {
      if (stocketMap[socket.clientNum + 1]) {
        stocketMap[socket.clientNum + 1].emit('leave');
      }
    }
    delete(stocketMap[socket.clientNum]);
  });
});

console.log("SERVER ON PORT" + PORT);
