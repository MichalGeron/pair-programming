const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/online-coding-app', { useNewUrlParser: true, useUnifiedTopology: true });

const CodeBlockSchema = new mongoose.Schema({
  title: String,
  code: String,
});

const CodeBlock = mongoose.model('CodeBlock', CodeBlockSchema);

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server);

let mentorSocket = null;

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('join', ({ codeBlockId, role }) => {
    socket.join(codeBlockId);
    if (role === 'mentor') {
      mentorSocket = socket;
    }
    CodeBlock.findById(codeBlockId, (err, codeBlock) => {
      if (err) return console.error(err);
      socket.emit('loadCodeBlock', codeBlock);
    });
  });

  socket.on('codeChange', (data) => {
    if (mentorSocket) {
      mentorSocket.to(data.codeBlockId).emit('codeUpdate', data.code);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.get('/code-blocks', (req, res) => {
  CodeBlock.find({}, (err, codeBlocks) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(codeBlocks);
  });
});

server.listen(4000, () => {
  console.log('listening on *:4000');
});
