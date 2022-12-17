const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");

const notFoundMiddleware = require("./v1/middlewares/not-found.middleware");
const errorHandlerMiddleware = require("./v1/middlewares/error-handler.middleware");
const morganMiddleware = require("./v1/middlewares/morgan.middleware");
const SocketServices = require("./v1/services/chat.service");

//init dbs
require("./v1/databases/init.mongodb");

// app
const app = express();
const http = require("http").Server(app);
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else app.use(morgan("combined"));
app.use(
  compression({
    level: 6,
    threshold: 100 * 1000, // compress if the size is over 100kb
    filter: (req, res) => {
      if (req.headers["x-no-compress"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);

// socket io

const io = require("socket.io")(http, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});
global._io = io;
global._io.on("connection", SocketServices.connection);

// router

app.use(require("./v1/routes/index.router"));
app.use(require("./v1/routes/auth.router"));
app.use(require("./v1/routes/chat.router"));
app.use(require("./v1/routes/message.router"));

// middleware

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
app.use(morganMiddleware);

module.exports = http;
