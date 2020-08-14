const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require('./api/routes/user');
const http = require('http');


const database = "resume"
const port = "27017"

if (process.env.NODE_ENV == "test") {
  mongoose.connect('mongodb://localhost:' + port + '/' + database);
} else {
  mongoose.connect('mongodb://mongo:' + port + '/' + database);
}

if(process.env.NODE_ENV != "test"){
  app.use(morgan("dev"));
}
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/user", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

const portserver = 5000;
var server
if(process.env.NODE_ENV != "test"){
  server = http.createServer(app).listen(portserver);
} else {
  server = http.createServer(app);
}

module.exports = server;