const express = require("express");
const cors = require("cors");
const classroomsRouter = require("../classroom_manage-backend/app/routes/classroom.route");
const studentsRouter = require("../classroom_manage-backend/app/routes/student.route");
const teachersRouter = require("../classroom_manage-backend/app/routes/teacher.route");

const fileUpload = require('express-fileupload');
const bodyParser =require('body-parser');
const ApiError = require("./app/api-error");
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(fileUpload());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to classroom application." });
});
// file upload api
app.post('/api/upload', (req, res) => {

    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
        // accessing the file
    const myFile = req.files.file;

    //  mv() method places the file inside public directory
    myFile.mv(`${__dirname}/public/${myFile.name}`, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Error occured" });
        }
        // returing the response with file path and name
        return res.send({name: myFile.name, path: `/${myFile.name}`});
    });
})
//lay anh
app.use("/images", express.static('public'));
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(bodyParser.json({limit: '50mb'}));


app.use("/api/classrooms", classroomsRouter);
app.use("/api/students", studentsRouter);
app.use("/api/teachers", teachersRouter);

app.use((req, res, next) => {
    return next(new ApiError(404, "Resoure not found"));
});
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Sever Error",
    });
});
module.exports = app;