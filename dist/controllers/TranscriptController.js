"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserTranscript = void 0;
const database_1 = require("../database");
// get required packages
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
// TODO: Endpoint to generate PDF of user's completed courses
const getUserTranscript = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = parseInt(req.params.userID);
    try {
        // retrieve student name
        const student = yield database_1.pool.query("SELECT name FROM users WHERE id = $1", [user_id]);
        // get all completed courses
        const completed_courses = yield database_1.pool.query("SELECT course_id, date_completed FROM course_progress WHERE user_id = $1 AND date_completed IS NOT NULL", [user_id]);
        console.log({ completed_courses });
        // retrieve course details (course title) from courses table
        // for each completed course
        for (let index = 0; index < completed_courses.rows.length; index++) {
            // retrieve the course name
            const course_name = yield database_1.pool.query("SELECT course_name FROM courses WHERE id = $1", [completed_courses.rows[index].course_id]);
            // add the course name to the object
            completed_courses.rows[index].course_name =
                course_name.rows[0].course_name;
        }
        student.rows[0].message = "Courses Completed Transcript";
        student.rows[0].completed_courses = completed_courses.rows;
        // instantiate the library
        let theOutput = new pdfkit_1.default();
        // pipe to a writable stream which would save the result into the same directory
        theOutput.pipe(fs_1.default.createWriteStream("TestDocument.pdf"));
        theOutput
            .text("Courses Completed Transcript", {
            align: "right",
            fontSize: 32,
            bold: true,
        })
            .image("./html/transcript-logo.png", {
            fit: [200, 200],
            align: "left",
        })
            .text(`Name: ${student.rows[0].name}`, {
            align: "right",
        });
        // theOutput.moveDown();
        theOutput
            .moveTo(0, 100) // set the current point
            .lineTo(0, 0) // draw a line
            // .quadraticCurveTo(130, 200, 150, 120) // draw a quadratic curve
            // .bezierCurveTo(190, -40, 200, 200, 300, 150) // draw a bezier curve
            // .lineTo(400, 90) // draw another line
            .stroke();
        theOutput.text(`test ${student.rows[0].name}`, {
            align: "left",
            fontSize: 32,
            bold: true,
        });
        // theOutput.text("Courses Completed Transcript", {
        //   bold: true,
        //   fontSize: 20,
        //   align: "right",
        // });
        // write out file
        theOutput.end();
        res.status(200).json({
            message: "Transcript generated successfully",
            student: student.rows[0],
        });
        // use ejs to render the .ejs file
        // ejs.renderFile(
        //   "./html/transcript.ejs",
        //   { completed_courses: student.rows[0].completed_courses },
        //   function (err: string, data: any) {
        //     if (err) {
        //       // display error if any
        //       console.log("line 34");
        //       res.send(err + " line 34");
        //     } else {
        //       // create pdf
        //       let options = {
        //         height: "8.5in",
        //         width: "11.25in",
        //         header: {
        //           height: "20mm",
        //         },
        //         footer: {
        //           height: "20mm",
        //         }
        //       };
        //       pdf
        //         .create(data, options)
        //         .toFile("transcript.pdf", function (err: any, data: any) {
        //           if (err) {
        //             // display error if any
        //             console.log("line 53");
        //             res.send(err);
        //           } else {
        //             console.log({ data });
        //             return res
        //               .status(200)
        //               .json({ message: "Transcript created successfully" });
        //           }
        //         });
        //     }
        //   }
        // );
    }
    catch (e) {
        console.log(e);
        return res.status(500).json("Internal Server Error");
    }
});
exports.getUserTranscript = getUserTranscript;
