import express from 'express';
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const app = express();
app.use(express.json());

const uri = "mongodb+srv://tempuser:123@cluster0.f9d6o.gcp.mongodb.net/Exam";

const data = [
    { name : "Ivan Fung",
        sid : "300371938"
    }
];

// Create and/or connect to the database
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

console.log('Connected');

const quizSchema = new Schema({
    name: String,
    sid: String,
});

// Use the "bookInfo" collection
const Stud = model("QuizSchema", quizSchema, "quizes");

app.get("/", async (req, res, next) => {
    try {
        const records = [];
        data.forEach((record) => {
            records.push(new Stud(record));
        })
        await Stud.insertMany(records);
        res.json({
            message: "Successful insert.",
            dbserver: uri,
        })
        res.status(204).end();
    } catch(err){
        next(err);
    }
})

app.get("/test", async (req, res, next) => {
    try {
        const records = await Stud.find({});
        res.json(records);
        res.status(204).end();
    }
    catch(err) {
        next(err);
    }
})

app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message,
            dbserver: uri,
        }
    })
});

app.listen(7000, () => console.log('user API listening on port 7000!'));
