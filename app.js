const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use('/static', express.static('static'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/static/index.html");
});

const dbURL = "mongodb://localhost:27017/todos";

app.use(bodyParser.json());

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("Success connected to Mongodb");
  })
  .catch(err => {
    console.log("Error: ", err);
  });

app.get("/todos", function(req, res) {
  Todo.find().then(tasks => {
    res.json(tasks);
  });
});

app.post("/todos", function(req, res) {
  let task = req.body;
  let newTask = new Todo(task);
  newTask.save().then(item => {
    res.json(item);
  });
});

app.get("/todos/:id", (req, res) => {
  Todo.findOne({ _id: req.params.id })
    .then(foundTodo => {
      res.json(foundTodo);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.put("/todos/:id", (req, res) => {
  Todo.updateOne({ _id: req.params.id }, req.body)
    .then(updateTodo => {
      res.json(updateTodo);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.patch("/api/todos/:id", (req, res) => {
  Todo.updateOne({ _id: req.params.id }, req.body)
    .then(updateTodo => {
      res.json(updateTodo);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.delete("/api/todos/:id", (req, res) => {
  Todo.deleteOne({ _id: req.params.id })
    .then(() => {
      res.json({ msg: "deleted" });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.listen(3000, function () {
    console.log('Express running on port 3000/.');
});
