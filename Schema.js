import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  sem1: Number,
  sem2: Number,
  cgpa: Number
});

var MarksSchema = mongoose.model("marks", Schema);

export default MarksSchema;
