//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);
const WorkItem = mongoose.model("WorkItem", itemsSchema);

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/", function(req, res) {
  var today = new Date();

  var options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  Item.find({}, function(err, foundItems) {
    res.render("list", {
      ListTitle: day,
      newListItems: foundItems
    });
  });

  var day = today.toLocaleDateString("en-US", options);
});

app.get("/work", function(req, res) {

  WorkItem.find({}, function(err, foundItems) {
    res.render("list", {
      ListTitle: "Work List",
      newListItems: foundItems
    });
  });
});

app.post("/", function(req, res) {

  let item = req.body.newItem;

  if (req.body.addButton === "Work") {
    WorkItem.insertMany([{
      name: item
    }]);

    res.redirect("/work");
  } else {
    Item.insertMany([{
      name: item
    }]);
    res.redirect("/");
  }
});

app.listen(8888, function() {
  console.log("Server started on port 8888");
});
