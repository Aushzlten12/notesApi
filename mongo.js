const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argmuent: node mongo.js <password>",
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.lurzutg.mongodb.net/note-app?retryWrites=true&w=majority`;

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

Note.find({ important: true }).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});

// const note2 = new Note({
//   content: "MongoDB is a NoSQL Database",
//   date: new Date(),
//   important: false,
// });
//
// note2
//   .save()
//   .then((result) => {
//     console.log("Second note saved!");
//     mongoose.connection.close();
//   })
//   .catch((error) => {
//     console.error("Error saving second note:", error);
//   });
