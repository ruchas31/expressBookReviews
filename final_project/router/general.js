const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorValue = req.params.author;
    let keys = Object.keys(books);
    let newBookList = [];

    keys.forEach( k => {
        if(books[k].author === authorValue){
            newBookList.push(books[k]);
        }
    });

    if(newBookList.length > 0){
        res.send(JSON.stringify(newBookList,null,4));
    }
    else {
        res.status(200).json({message: "Not found"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const titleValue = req.params.title;
    let keys = Object.keys(books);
    let newBookList = [];

    keys.forEach( k => {
        if(books[k].title === titleValue){
            newBookList.push(books[k]);
        }
    });

    if(newBookList.length > 0){
        res.send(JSON.stringify(newBookList,null,4));
    }
    else {
        res.status(200).json({message: "Not found"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]["reviews"]);

});

module.exports.general = public_users;
