import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
mongoose.connect(process.env.MONGO_URI);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
const Schema = new mongoose.Schema({
  uid: String,
  sem1: Number,
  sem2: Number,
  cgpa: Number,
});

var GradeSchema = mongoose.model("grades", Schema);

const data = [
  { uid: "A001", sem1: 3.5, sem2: 3.8, cgpa: 3.65 },
  { uid: "A002", sem1: 3.2, sem2: 3.6, cgpa: 3.4 },
  { uid: "A003", sem1: 3.8, sem2: 4.0, cgpa: 3.9 },
  { uid: "A004", sem1: 3.0, sem2: 3.5, cgpa: 3.25 },
  { uid: "A005", sem1: 3.7, sem2: 3.9, cgpa: 3.8 },
];

app.get("/students", async (req, res) => {
  try {
    const grade = await GradeSchema.find();
    res.status(200).json(grade);
  } catch (error) {
    res.status(500).json(error);
  }
  //   res.send(data);
});

app.post("/students", async (req, res) => {
  const data = req.body;
  const newData = new GradeSchema(data);
  try {
    await newData.save();
    res.status(201).json(newData);
  } catch (error) {
    console.error(error);
    res.status(409).json({ message: error.message });
  }
});

app.put("/students/:uid", (req, res) => {
  const index = data.findIndex((student) => student.uid === req.params.uid);
  if (index === -1) {
    res.status(404).send("Student not found");
  } else {
    data[index] = { ...data[index], ...req.body };
    res.send("Course updated");
  }
});

app.patch("/students/v1/:uid", (req, res) => {
  const index = data.findIndex((student) => student.uid === req.params.uid);
  if (index === -1) {
    res.status(404).send("Course not found");
  } else {
    const dataToUpdate = data[index];
    // Update specific fields if they exist in the request body
    if (req.body.sem1) dataToUpdate.sem1 = req.body.sem1;
    if (req.body.sem2) dataToUpdate.sem2 = req.body.sem2;
    if (req.body.cgpa) dataToUpdate.cgpa = req.body.cgpa;

    res.send("Student data partially updated");
  }
});

app.delete("/students/d1/:uid", (req, res) => {
  const index = data.findIndex((student) => student.uid === req.params.uid);

  if (index === -1) {
    res.status(404).send("Student not found");
  } else {
    data.splice(index, 1);
    res.send("Student data deleted");
  }
});

app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
