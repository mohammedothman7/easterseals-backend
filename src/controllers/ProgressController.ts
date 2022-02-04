import { Request, Response } from 'express'
import { pool } from '../database'
import { QueryResult } from 'pg';

// get progress of all courses for a specific user
export const getUserProgress = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const user_id = parseInt(req.params.userID);

    try {
        const response: QueryResult = await pool.query(
            "SELECT * FROM course_progress WHERE user_id = $1",
            [user_id]
        );
        if (response.rows.length < 1) {
            res.status(404).json({
                message: "No progress found for this user",
            });
        }
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json("Internal Server Error");
    }
};

// save course progress for a user
export const saveProgress = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const { progression, total_pages, user_id, course_id } = req.body;
    if (!progression || !total_pages || !user_id || !course_id) {
        return res.status(400).json({
            message: "Please provide all required fields",
        });
    }

  try {
    const response: QueryResult = await pool.query(
      "SELECT * FROM course_progress WHERE user_id = $1 AND course_id = $2",
      [user_id, course_id]
    );

    if (response?.rows?.length > 0) {
      return res.status(400).json({
        message: "Row already exists, please use the update endpoint to update row"
      });
    }

    await pool.query(
      "INSERT INTO course_progress (progression, total_pages, user_id, course_id) VALUES ($1, $2, $3, $4)",
      [progression, total_pages, user_id, course_id]
    );
    return res.json({
      message: "Progress saved successfully",
      body: {
        user_grade: {
          progression,
          total_pages,
          user_id,
          course_id,
        },
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json("Internal Server Error " + e);
  }
};

// update an existing user course progress
export const updateProgress = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const user_id = parseInt(req.params.userID);
    const { progression, course_id, total_pages } = req.body; //send total_pages from the front-end

    if (!user_id || !progression || !course_id) {
        return res.status(422).json({
            error: "Missing field",
        });
    }

    try {
        // check if user has completed the course
        if (progression == total_pages) {
            await pool.query(
                "UPDATE course_progress SET progression = $1, date_completed = CURRENT_DATE WHERE user_id = $2 AND course_id = $3",
                [progression, user_id, course_id]
            );
        }
        // user has not yet completed course
        else {
            // update the progression value in database using record that matches the user_id and course_id
            await pool.query(
                "UPDATE course_progress SET progression = $1 WHERE user_id = $2 AND course_id = $3",
                [progression, user_id, course_id]
            );
        }

        return res.json(
            "Progress updated for course " + course_id + " for user " + user_id
        );
    } catch (e) {
        console.log(e);
        return res.status(500).json("Internal Server Error");
    }
};