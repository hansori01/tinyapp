// run server: npm start

const express = require("express");
const app = express();
const PORT = 8080;

// middleware

const bodyParser = require("body-parser");
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
app.use(bodyParser.urlencoded({ extended: true })); //formats the form POST requests
app.set("view engine", "ejs");
app.use(morgan('dev'));
app.use(cookieParser());





// 🌍 GLOBAL SCOPE VARIABLES
// object placeholder of pre-loaded URLs

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// function: generates random key

const generateRandomString = () => {
  const crypto = require("crypto");
  const id = crypto.randomBytes(3).toString('hex');
  return id;
};





// 🔑  LOGIN / LOGOUT 🔑 

// users object

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

app.post("/login", (req, res) => {
  const { username } = req.body;
  res.cookie('username', username)
  res.redirect(`/urls`);
});
app.post("/logout", (req, res) => {
  res.clearCookie('username', {path: '/'});
  res.redirect(`/urls`);
});
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
const userID = generateRandomString();
users[userID] = {id: userID, email, password}
res.cookie('username', userID);
res.redirect(`/urls`);
});
app.get('/register', (req, res) => {
  const templateVars = {
    username: req.cookies["username"]
  };
  res.render('register', templateVars);
});

//  ❗️ routes should be ordered from most specific to least specific ❗️

// 📗  get 📗

app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render('urls_index', templateVars);
});
app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies['username'] }
  res.render("urls_new", templateVars);
});

// ✏️  post ✏️

// user submits longURL
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});
// user clicks on DELETE button
app.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params
  delete urlDatabase[shortURL]
  res.redirect(`/urls`);
});
// user clicks on UPDATE button
app.post("/urls/:shortURL/update", (req, res) => {
  // this line is same as req.params.shortURL
  const { shortURL } = req.params;
  //update the key value with the new body
  urlDatabase[shortURL] = req.body.longURL;
  res.cookie
  res.redirect(`/urls`);
});


/* ❇️  specific shortURL GET*/
app.get('/urls/:shortURL', (req, res) => {
  if (req.params.shortURL in urlDatabase) {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL],
      username: req.cookies["username"]
    };
    res.render('urls_show', templateVars);
  } else {
    res.send('this short URL does not exist! 🤷🏽‍♂️'); //TODO redirect button
  }
});
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});





app.listen(PORT, () => { console.log(`(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ tinyapp is running on PORT: ${PORT}`) });