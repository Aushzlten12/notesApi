const notesRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Note = require("../models/note");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");

  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }

  return null;
};
notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 });
  response.json(notes);
});

notesRouter.get("/:id", async (request, response) => {
  const id = request.params.id;

  const note = await Note.findById(id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

notesRouter.post("/", async (request, response) => {
  const body = request.body;
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    user: user._id,
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();

  response.json(savedNote);
});

notesRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  await Note.findByIdAndDelete(id);
  response.status(204).end();
});

notesRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  const id = request.params.id;

  const updatedNote = await Note.findByIdAndUpdate(id, note, { new: true });
  response.json(updatedNote);
});

module.exports = notesRouter;
