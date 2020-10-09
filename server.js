// dependencies
const express = require('express');
const path = require('path');
const fs = require("fs");
const noteText = require(__dirname, "/db/db.json");

// express app
const app = express();
const PORT = process.env.PORT || 8080;

// express app data parsing and reads static files
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static(__dirname + '/public'));


// HTML ROUTES

// return notes.html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
    console.log("notes")
});

// return index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
    console.log("html")
});


// API ROUTES

// returns saved notes as JSON
app.get("/api/notes", (req, res) => {
    return res.json(noteText);
});
// saves new note to db.json and returns note to client
app.post("/api/notes"), (req, res) => {
    const newNote = req.body;
    newNote.id = uniqueID();
    console.log(newNote);

    noteText.push(newNote);
    res.json(true);

}

// receives ID of note to delete
app.delete("/api/notes/:id"), (req, res) => {
    res.send('Delete')
}
// starts server
app.listen(PORT, () => {
    console.log('App listening on PORT: ' + PORT);
});