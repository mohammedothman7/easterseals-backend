import { Request, Response } from 'express'
import { pool } from '../database'
import { QueryResult } from 'pg';
const bcryptjs = require('bcryptjs');

// get all users (ADMIN FUNCTION)
export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        // remove personally identifiable information and only display relevant information
        const response: QueryResult = await pool.query('Select date_of_birth, race, gender, address, employment_status, military_affiliated, military_affiliation, military_start_date, military_end_date, last_rank, military_speciality, household_size, income, current_course, completed_courses, referral_source, resources FROM users');
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server Error');
    }
}

// get specific user (ADMIN FUNCTION)
export const getUser = async (req: Request, res: Response): Promise<Response> => {
    const userID = parseInt(req.params.userID);
    const { email, password } = req.body;

    // ensure required fields were entered
    if (!email || !password)
        return res.status(400).json("Please enter required fields!");

    try {
        // retrieve user object
        const user: QueryResult = await pool.query('Select * FROM users WHERE id = $1', [userID]);

        // if current user's email does not match account to be retrieved
        if (email != user.rows[0].email)
            return res.status(401).json("Email does not match account to be retrieved");

        // if current user's password does not match account to be retrieved
        const isMatch: boolean = await bcryptjs.compare(
            password,
            user.rows[0].password
        );

        if (!isMatch)
            return res.status(401).json({ msg: 'Incorrect password' });

        return res.status(200).json(user.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server Error');
    }
}

// register user (USER FUNCTION)
export const createUser = async (req: Request, res: Response): Promise<Response> => {
    var { name, email, password, phone_num, date_of_birth, race, gender, address, employment_status,
        military_affiliated, military_affiliation, military_start_date, military_end_date, last_rank,
        military_speciality, household_size, income, current_course, completed_courses, referral_source, resources } = req.body;

    // ensure required fields were entered
    if (!email || !password)
        return res.status(400).json("Please enter required fields!");

    try {
        // check if email already exists
        const user: QueryResult = await pool.query('Select * FROM users WHERE email = $1', [email]);
        if (user.rowCount > 0)
            return res.status(404).json("Email already exists!");

        // hash password
        const salt = await bcryptjs.genSalt(10);
        password = await bcryptjs.hash(password, salt);

        // create record in users DB
        await pool.query('INSERT INTO users (name, email, password, phone_num, date_of_birth, race, gender, address, employment_status, military_affiliated, military_affiliation, military_start_date, military_end_date, last_rank, military_speciality, household_size, income, current_course, completed_courses, referral_source, resources) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)',
            [name, email, password, phone_num, date_of_birth, race, gender, address, employment_status,
                military_affiliated, military_affiliation, military_start_date, military_end_date, last_rank,
                military_speciality, household_size, income, current_course, completed_courses, referral_source, resources]);

        const newUser: QueryResult = await pool.query('Select * FROM users WHERE email = $1', [email]);
        return res.status(200).json(newUser.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server Error');
    }
}

// log in user (USER FUNCTION)
export const signInUser = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    // ensure required fields were entered
    if (!email || !password)
        return res.status(400).json("Please enter required fields!");

    try {
        // retrieve user to-be-logged-in object
        const user: QueryResult = await pool.query('Select * FROM users WHERE email = $1', [email]);

        // if current user's email does not exist
        if (user.rowCount == 0)
            return res.status(401).json("Email does not exist");

        // if current user's password does not match account to be logged in
        const isMatch: boolean = await bcryptjs.compare(
            password,
            user.rows[0].password
        );

        if (isMatch) {
            // return all except password
            delete user.rows[0].password;

            return res.status(200).json(user.rows[0]);
        }
            
        else
            return res.status(401).json({ msg: 'Incorrect password' });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server Error');
    }
}

// update user details (USER FUNCTION)
export const updateUserPassword = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const userID = parseInt(req.params.userID);
    var {
        name,
        email,
        password,
        new_password,
        phone_num,
        date_of_birth,
        race,
        gender,
        address,
        employment_status,
        military_affiliated,
        military_affiliation,
        military_start_date,
        military_end_date,
        last_rank,
        military_speciality,
        household_size,
        income,
        current_course,
        completed_courses,
        referral_source,
        resources,
    } = req.body;

    // ensure required fields were entered
    if (!email || !password)
        return res.status(400).json("Please enter required fields!");

    try {
        // retrieve user to-be-updated object
        const user: QueryResult = await pool.query(
            "Select * FROM users WHERE id = $1",
            [userID]
        );

        // if current user's email does not match account to be updated
        if (email != user.rows[0].email)
            return res.status(401).json("Email does not match account to be updated");

        // if current user's password does not match account to be updated
        const isMatch: boolean = await bcryptjs.compare(
            password,
            user.rows[0].password
        );

        if (!isMatch) return res.status(401).json({ msg: "Incorrect password" });

        // salt for hashing password
        const salt = await bcryptjs.genSalt(10);

        // set fields equal to either new values specified in request or original user values
        name = name ? name : user.rows[0].name;
        password = new_password
            ? await bcryptjs.hash(new_password, salt)
            : user.rows[0].password;
        phone_num = phone_num ? phone_num : user.rows[0].phone_num;
        date_of_birth = date_of_birth ? date_of_birth : user.rows[0].date_of_birth;
        race = race ? race : user.rows[0].race;
        gender = gender ? gender : user.rows[0].gender;
        address = address ? address : user.rows[0].address;
        employment_status = employment_status
            ? employment_status
            : user.rows[0].employment_status;
        military_affiliated = military_affiliated
            ? military_affiliated
            : user.rows[0].military_affiliated;
        military_affiliation = military_affiliation
            ? military_affiliation
            : user.rows[0].military_affiliation;
        military_start_date = military_start_date
            ? military_start_date
            : user.rows[0].military_start_date;
        military_end_date = military_end_date
            ? military_end_date
            : user.rows[0].military_end_date;
        last_rank = last_rank ? last_rank : user.rows[0].last_rank;
        military_speciality = military_speciality
            ? military_speciality
            : user.rows[0].military_speciality;
        household_size = household_size
            ? household_size
            : user.rows[0].household_size;
        income = income ? income : user.rows[0].income;
        current_course = current_course
            ? current_course
            : user.rows[0].current_course;
        completed_courses = completed_courses
            ? completed_courses
            : user.rows[0].completed_courses;
        referral_source = referral_source
            ? referral_source
            : user.rows[0].referral_source;
        resources = resources ? resources : user.rows[0].resources;

        await pool.query(
            "UPDATE users SET name = $1, email = $2, password = $3, phone_num = $4, date_of_birth = $5, race = $6, gender = $7, address = $8, employment_status = $9, military_affiliated = $10, military_affiliation = $11, military_start_date = $12, military_end_date = $13, last_rank = $14, military_speciality = $15, household_size = $16, income = $17, current_course = $18, completed_courses = $19, referral_source = $20, resources = $21 WHERE id = $22",
            [
                name,
                email,
                password,
                phone_num,
                date_of_birth,
                race,
                gender,
                address,
                employment_status,
                military_affiliated,
                military_affiliation,
                military_start_date,
                military_end_date,
                last_rank,
                military_speciality,
                household_size,
                income,
                current_course,
                completed_courses,
                referral_source,
                resources,
                userID,
            ]
        );
        return res.json("User " + userID + " updated succesfully");
    } catch (e) {
        console.log(e);
        return res.status(500).json("Internal Server Error");
    }
};

export const updateUser = async (
    req: Request,
    res: Response
): Promise<Response> => {
  if (!req.params.userID) {
    return res.status(400).json("Please enter required fields!");
  }

  const userID = parseInt(req.params.userID);
  var {
    name,
    new_password,
    phone_num,
    date_of_birth,
    race,
    gender,
    address,
    employment_status,
    military_affiliated,
    military_affiliation,
    military_start_date,
    military_end_date,
    last_rank,
    military_speciality,
    household_size,
    income,
    current_course,
    completed_courses,
    referral_source,
    resources,
  } = req.body;

  try {
    // retrieve user to-be-updated object
    const user: QueryResult = await pool.query(
      "Select * FROM users WHERE id = $1",
      [userID]
    );

    // set fields equal to either new values specified in request or original user values
    name = name ? name : user.rows[0].name;
    const password = user.rows[0].password;
    const email = user.rows[0].email;
    phone_num = phone_num ? phone_num : user.rows[0].phone_num;
    date_of_birth = date_of_birth ? date_of_birth : user.rows[0].date_of_birth;
    race = race ? race : user.rows[0].race;
    gender = gender ? gender : user.rows[0].gender;
    address = address ? address : user.rows[0].address;
    employment_status = employment_status
      ? employment_status
      : user.rows[0].employment_status;
    military_affiliated = military_affiliated
      ? military_affiliated
      : user.rows[0].military_affiliated;
    military_affiliation = military_affiliation
      ? military_affiliation
      : user.rows[0].military_affiliation;
    military_start_date = military_start_date
      ? military_start_date
      : user.rows[0].military_start_date;
    military_end_date = military_end_date
      ? military_end_date
      : user.rows[0].military_end_date;
    last_rank = last_rank ? last_rank : user.rows[0].last_rank;
    military_speciality = military_speciality
      ? military_speciality
      : user.rows[0].military_speciality;
    household_size = household_size
      ? household_size
      : user.rows[0].household_size;
    income = income ? income : user.rows[0].income;
    current_course = current_course
      ? current_course
      : user.rows[0].current_course;
    completed_courses = completed_courses
      ? completed_courses
      : user.rows[0].completed_courses;
    referral_source = referral_source
      ? referral_source
      : user.rows[0].referral_source;
    resources = resources ? resources : user.rows[0].resources;

    await pool.query(
      "UPDATE users SET name = $1, phone_num = $2, date_of_birth = $3, race = $4, gender = $5, address = $6, employment_status = $7, military_affiliated = $8, military_affiliation = $9, military_start_date = $10, military_end_date = $11, last_rank = $12, military_speciality = $13, household_size = $14, income = $15, current_course = $16, completed_courses = $17, referral_source = $18, resources = $19 WHERE id = $20",
      [
        name,
        phone_num,
        date_of_birth,
        race,
        gender,
        address,
        employment_status,
        military_affiliated,
        military_affiliation,
        military_start_date,
        military_end_date,
        last_rank,
        military_speciality,
        household_size,
        income,
        current_course,
        completed_courses,
        referral_source,
        resources,
        userID,
      ]
    );
    return res.json("User " + userID + " updated succesfully");
  } catch (e) {
    console.log(e);
    return res.status(500).json("Internal Server Error");
  }
};

// delete user (USER/ ADMIN FUNCTION)
export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    const userID = parseInt(req.params.userID);
    const { email, password } = req.body;

    // ensure required fields were entered
    if (!email || !password)
        return res.status(400).json("Please enter required fields!");

    try {
        // retrieve user to-be-deleted object
        const user: QueryResult = await pool.query('Select * FROM users WHERE id = $1', [userID]);

        // if current user's email does not match account to be deleted
        if (email != user.rows[0].email)
            return res.status(401).json("Email does not match account to be deleted");

        // if current user's password does not match account to be deleted
        const isMatch: boolean = await bcryptjs.compare(
            password,
            user.rows[0].password
        );

        if (!isMatch)
            return res.status(401).json({ msg: 'Incorrect password' });

        // delete rows in grades and feedback table that are referencing user
        await pool.query('DELETE FROM user_grades WHERE user_id = $1', [userID]);
        await pool.query('DELETE FROM user_feedback WHERE user_id = $1', [userID]);

        // delete user
        await pool.query('DELETE FROM users WHERE id = $1', [userID]);

        return res.status(200).json('User ' + userID + ' account deleted succesfully');
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server Error');
    }
}
