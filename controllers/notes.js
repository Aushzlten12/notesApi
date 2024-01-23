const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({});
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

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  const savedNote = await note.save();
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
