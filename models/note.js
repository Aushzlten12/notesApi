const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minlength: [5, "Must have minimum 5 characters"],
    required: [true, "Content is required"],
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
