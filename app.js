// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const lodash = require("lodash");

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

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

const Item = mongoose.model("Item", itemsSchema);

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
      res.render("list", {
        ListTitle: "Today",
        newListItems: foundItems
      });
    }
  });
});

app.get("/:newList", function(req, res) {
  const customListName = lodash.capitalize(req.params.newList);
  List.findOne({
    name: customListName
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        console.log("Doesn't Exist!");
        // Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.render("list", {
          ListTitle: customListName,
          newListItems: defaultItems
        });

      } else {
        console.log("Already Exists!");
        // Show an existing list
        res.render("list", {
          ListTitle: foundList.name,
          newListItems: foundList.items
        });
      }
    }

  });

});

app.post("/", function(req, res) {

  let itemName = req.body.newItem;
  let listName = req.body.addButton;

  console.log(listName);

  const newItem = new Item({
    name: itemName
  });

  if (listName === "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      if (err) {
        console.log(err);
      } else {
        foundList.items.push(newItem);
        foundList.save();
        res.redirect("/" + listName);
      }
    });
  }

});

app.post("/delete", function(req, res) {
  const deleteItem = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(deleteItem, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully deleted item.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: deleteItem
        }
      }
    }, function(err, foundList) {
      if (!err) {
        res.redirect("/" + listName);
      }
    });
  }

});

app.listen(8888, function() {
  console.log("Server started on port 8888");
});
