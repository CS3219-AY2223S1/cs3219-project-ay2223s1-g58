import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
// import findMatch from "./handler/match-handler.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

app.get("/", (req, res) => {
  res.send("Hello World from matching-service");
});

const httpServer = createServer(app);

httpServer.listen(8001);

const io = new Server(httpServer);

io.on("connection", (socket) => {
  // socket.on("match", findMatch);
  console.log("Socket Connected");
});
