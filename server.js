import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import db from "./db/db.js";

const app = express();
const PORT = 3002;
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // url for front-end
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("send_data", (data) => {
    console.log("receive_data", data);
    // socket.broadcast.emit("receive_data", data);
    io.sockets.emit("receive_data", data);
  });
});

app.get("/api/get", (req, res) => {
  db.query("SELECT * FROM testtb", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.post("/api/insert", (req, res) => {
  db.query(
    `INSERT INTO testtb (firstName) values ("${req.body.firstName}")`,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
