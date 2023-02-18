/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import http from 'http';
import cors from 'cors';
import { Server as SockerServer } from 'socket.io';

const app = express();
const server = http.createServer(app);

const {
  SOCKET_SERVER_PORT = 4000,
  SOCKET_SERVER_HOST = 'localhost',
  API_SERVER_PORT = 3333,
  API_SERVER_HOST = 'localhost',
} = process.env;

const io = new SockerServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/*', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

const port = process.env.PORT || 3333;

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.emit('me', socket.id);

  socket.on('disconnect', () => {
    console.log('user disconnected');
    socket.broadcast.emit('callEnded');
  });

  socket.on('callUser', ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit('callUser', { signal: signalData, from, name });
  });

  socket.on('answerCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });
});

const server2 = app.listen(API_SERVER_PORT, () => {
  console.log(
    `API server is Listening at http://${API_SERVER_HOST}:${API_SERVER_PORT}`
  );
});
server2.on('error', console.error);
server.listen(SOCKET_SERVER_PORT, () =>
  console.log(
    `Socket server is running on port http://${SOCKET_SERVER_HOST}${SOCKET_SERVER_PORT}`
  )
);
