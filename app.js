
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/public'));

mongoose.connect("mongodb://localhost:27017/userDB",
{ userNewUrlParser: true, useUnifiedTopology: true });

// new schema to set up our new user database
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// our encryption, for password field only
userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ['password']});

// set up a new user model
const User = new mongoose.model("User", userSchema);

// want to be able to view our website, need app.get for each page
app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

// creating our register route

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  // if a new user has been successfully registered then they will be able to view
  // the secrets page

  newUser.save(function(err){
    if(err){
      console.log(err);
    } else {
      res.render("secrets");
    }
  })
})


// app.post for our login route
app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

// look thru our collection of users and find one where the email field matches
// with our username field
  User.findOne({email: username}, function(err, foundUser){
    if (err){
      console.log(err);
    } else {
      if (foundUser){
        if (foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  })
})



app.listen(3000, function(){
  console.log('server started on port 3000');
})
