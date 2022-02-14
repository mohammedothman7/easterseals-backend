import { Request, Response } from 'express'
import { pool } from '../database'
import { QueryResult } from 'pg';

// get required packages
let ejs = require("ejs")
let pdf = require("html-pdf");
let path = require("path");
import PDFGenerator from "pdfkit";
import fs from "fs";

// TODO: Endpoint to generate PDF of user's completed courses
export const getUserTranscript = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user_id = parseInt(req.params.userID);

  try {
    // retrieve student name
    const student: QueryResult = await pool.query(
      "SELECT name FROM users WHERE id = $1",
      [user_id]
    );

    // get all completed courses
    const completed_courses: QueryResult = await pool.query(
      "SELECT course_id, date_completed FROM course_progress WHERE user_id = $1 AND date_completed IS NOT NULL",
      [user_id]
    );

    console.log({ completed_courses });
    // retrieve course details (course title) from courses table
    // for each completed course
    for (let index = 0; index < completed_courses.rows.length; index++) {
      // retrieve the course name
      const course_name: QueryResult = await pool.query(
        "SELECT course_name FROM courses WHERE id = $1",
        [completed_courses.rows[index].course_id]
      );

      // add the course name to the object
      completed_courses.rows[index].course_name =
        course_name.rows[0].course_name;
    }

    student.rows[0].message = "Courses Completed Transcript";
    student.rows[0].completed_courses = completed_courses.rows;

    // instantiate the library
    let theOutput = new PDFGenerator();

    // pipe to a writable stream which would save the result into the same directory
    theOutput.pipe(fs.createWriteStream("TestDocument.pdf"));

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
  } catch (e) {
    console.log(e);
    return res.status(500).json("Internal Server Error");
  }
};