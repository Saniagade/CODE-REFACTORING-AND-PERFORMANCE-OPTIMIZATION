// server.js
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const registerSocketHandlers = require('./socketHandlers');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static('public'));

// Register socket events separately
registerSocketHandlers(io);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// socketHandlers.js
module.exports = function(io) {
  let latestCode = ''; // Cache last code

  io.on('connection', socket => {
    console.log('New user connected');

    // Send cached code to new users
    if (latestCode) {
      socket.emit('codeChange', latestCode);
    }

    socket.on('codeChange', code => {
      if (code !== latestCode) { // Only broadcast if new
        latestCode = code;
        socket.broadcast.emit('codeChange', code); 
      }
    });
  });
};
