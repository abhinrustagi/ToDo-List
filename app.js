// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// Establish a connection
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Verify the connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connection established to the database.");
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

const item1 = new Item({
  name: "Welcome to your ToDo List!"
});

const item2 = new Item({
  name: "Hit the + button to add new tasks!"
});

const item3 = new Item({
  name: "<-- Check this box, to remove an item."
});

const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to database.");
        }
      });
    } else {
      var today = new Date();

      var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
      };

      var day = today.toLocaleDateString("en-US", options);

      res.render("list", {
        ListTitle: day,
        newListItems: foundItems
      });
    }
  });
});

app.get("/work", function(req, res) {

  WorkItem.find({}, function(err, foundItems) {
    if (err) {
      console.log(err);
    } else {
      res.render("list", {
        ListTitle: "Work List",
        newListItems: foundItems
      });
    }
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
