// dependencies
const express = require('express');
const path = require('path');
const fs = require("fs");
const crypto = require("crypto");
const util = require("util") // DO I NEED 

// express app set up
const app = express();
const PORT = process.env.PORT || 9080;

// sets up data parsing and reading static files
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(express.static(__dirname + "/public"));


//______________ API ROUTES ______________

// global array using promise to read the JSON 
let savedNotesGlobal = util.promisify(fs.readFile)

function getSavedNotes() {
  console.log("Saved Notes", savedNotesGlobal("./db/db.json", "utf8"))
  return savedNotes = savedNotesGlobal("./db/db.json", "utf8")
};

// returns all saved notes as JSON
app.get("/api/notes", (req, res) => {
  getSavedNotes()
    .then((savedNotes) => {
      res.send(JSON.parse(savedNotes))
    })
    .catch((err) => res.status(500).json(err));
});

// saves new note to db.json and returns note to client
app.post("/api/notes", (req, res) => {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let id = crypto.randomBytes(16).toString("hex");
  let newNote = {
    title: req.body.title,
    text: req.body.text,
    id: id,
  }
  console.log("newNote:", newNote)

  // pushes new notes to notes.index
  savedNotes.push(newNote);

  // writes new notes to db.json
  fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes), (err) => {
    if (err) throw err;
    console.log("error");
  });
  console.log("A note new has been written");
  return res.json(savedNotes);
});

// query parameter containing ID of deleted note
app.delete("/api/notes/:id", (req, res) => {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let noteID = savedNotes.filter(x => x.id != req.params.id)
  console.log("NOTE ID", noteID)
  console.log("REQ.PARAMS.ID", req.params.id)

  // writes new notes to db.json
  fs.writeFileSync("./db/db.json", JSON.stringify(noteID), (err) => {
    if (err) throw err;
    console.log("error");
  });
  console.log("Your note has been deleted");
  return res.json(savedNotes);
});


//______________ HTML ROUTES ______________

// returns notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// returns index.html 
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// starts the server
app.listen(PORT, () => {
  console.log('App listening on PORT: ' + PORT);
});