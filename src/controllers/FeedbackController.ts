import { Request, Response } from 'express'
import { pool } from '../database'
import { QueryResult } from 'pg';


// get feedback for all courses (ADMIN FUNCTION)
export const getAllFeedback = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response: QueryResult = await pool.query('Select * FROM user_feedback');
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server Error');
    }
}

// get user feedback for specific course (ADMIN FUNCTION)
export const getCourseFeedback = async (req: Request, res: Response): Promise<Response> => {
    const course_id = parseInt(req.params.courseID);

    try {
        const response: QueryResult = await pool.query('Select * FROM user_feedback WHERE course_id = $1', [course_id]);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server Error');
    }
}

// post new feedback about course (USER FUNCTION)
export const postFeedback = async (req: Request, res: Response): Promise<Response> => {
    const { rating, question, user_id, course_id } = req.body;

    try {
        // check if user has given feedback for course before
        const feedback: QueryResult = await pool.query('Select * FROM user_feedback WHERE user_id = $1 AND course_id = $2 AND question = $3', [user_id, course_id, question]);

        if (feedback.rowCount > 0) {
            await pool.query('UPDATE user_feedback SET rating = $1 WHERE user_id = $2 AND course_id = $3 AND question = $4', [rating, user_id, course_id, question]);

            return res.json({
                message: 'Feedback updated succesfully',
                body: {
                    course_feedback: {
                        rating,
                        question,
                        user_id,
                        course_id
                    }
                }
            });
        }
        else {
            await pool.query('INSERT INTO user_feedback (rating, question, user_id, course_id) VALUES ($1, $2, $3, $4)', [rating, question, user_id, course_id]);
            return res.json({
                message: 'Feedback posted succesfully',
                body: {
                    course_feedback: {
                        rating,
                        question,
                        user_id,
                        course_id
                    }
                }
            });
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server Error');
    }
}

export const createApplicationFeedback = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { answer, question, user_id } = req.body;

  try {
    if (!answer || !question || !user_id) {
      return res.status(400).json({
        message: "Missing fields",
      });
    }
    // check if user has given feedback for course before
    const feedback: QueryResult = await pool.query(
      "Select * FROM application_feedback WHERE user_id = $1 AND question = $2",
      [user_id, question]
    );

    if (feedback.rowCount > 0) {
      await pool.query(
        "UPDATE application_feedback SET answer = $1 WHERE user_id = $2 AND question = $3",
        [answer, user_id, question]
      );

      return res.json({
        message: "Feedback updated successfully",
        body: {
          course_feedback: {
            answer,
            question,
            user_id,
          },
        },
      });
    } else {
      await pool.query(
        "INSERT INTO application_feedback (answer, question, user_id) VALUES ($1, $2, $3)",
        [answer, question, user_id]
      );
      return res.json({
        message: "Feedback posted successfully",
        body: {
          application_feedback: {
            answer,
            question,
            user_id,
          },
        },
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json("Internal Server Error");
  }
};