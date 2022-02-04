"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsersController_1 = require("../controllers/UsersController");
const FeedbackController_1 = require("../controllers/FeedbackController");
const GradesController_1 = require("../controllers/GradesController");
const ProgressController_1 = require("../controllers/ProgressController");
const TranscriptController_1 = require("../controllers/TranscriptController");
const router = express_1.Router();
router.get('/', (req, res) => {
    res.send(`<b>user-related endpoints</b>
            <ul>
            <li>/users [GET]: get all users <p style="color:orange; display:inline">(ADMIN FUNCTION)</p></li>
            <li>/users/:userID [GET]: get specific user <p style="color:blue; display:inline">(USER/ ADMIN FUNCTION)</p></li>
            <li>/users/signup [POST]: register user <p style="color:green; display:inline">(USER FUNCTION)</p></li>
            <li>/users/login [POST]: log in user <p style="color:green; display:inline">(USER FUNCTION)</p></li>
            <li>/users/:userID [PUT]: update user details <p style="color:green; display:inline">(USER FUNCTION)</p></li>
            <li>/users/:userID [DELETE]: delete user <p style="color:blue; display:inline">(USER/ ADMIN FUNCTION)</p></li>
            </ul><br/>
            <b>feedback-related endpoints</b>
            <ul>
            <li>/feedback [GET]: get feedback for all courses <p style="color:orange; display:inline">(ADMIN FUNCTION)</p></li>
            <li>/feedback/:courseID [GET]: get feedback for specific course <p style="color:orange; display:inline">(ADMIN FUNCTION)</p></li>
            <li>/feedback [POST]: post new feedback about course <p style="color:green; display:inline">(USER FUNCTION)</p></li>
            </ul><br/>
            <b>grade-related endpoints</b>
            <ul>
            <li>/grades [GET]: get all grades <p style="color:orange; display:inline">(ADMIN FUNCTION)</p></li>
            <li>/grades/user/:userID [GET]: get grades for specific user <p style="color:blue; display:inline">(USER/ ADMIN FUNCTION)</p></li>
            <li>/grades/:course_id [GET]: get grades for specific course <p style="color:orange; display:inline">(ADMIN FUNCTION)</p></li>
            <li>/grades [POST]: upload new grade for a course <p style="color:green; display:inline">(USER FUNCTION)</p></li>
            </ul>`);
});
// user-related endpoints
router.get('/users', UsersController_1.getUsers); // get all users (ADMIN FUNCTION)
router.get('/users/:userID', UsersController_1.getUser); // get specific user (ADMIN FUNCTION)
router.post('/users/signup', UsersController_1.createUser); // register user (USER FUNCTION)
router.post('/users/login', UsersController_1.signInUser); // log in user (USER FUNCTION)
router.put('/users/:userID', UsersController_1.updateUser); // update user details (USER FUNCTION)
router.put('/users/:userID/changePassword', UsersController_1.updateUserPassword); // delete user (USER/ ADMIN FUNCTION)
router.delete('/users/:userID', UsersController_1.deleteUser); // delete user (USER/ ADMIN FUNCTION)
// feedback-related endpoints
router.get('/feedback', FeedbackController_1.getAllFeedback); // get feedback for all courses (ADMIN FUNCTION)
router.get('/feedback/:courseID', FeedbackController_1.getCourseFeedback); // get feedback for specific course (ADMIN FUNCTION)
router.post('/feedback', FeedbackController_1.postFeedback); // post new feedback about course (USER FUNCTION)
// grade-related endpoints
router.get('/grades', GradesController_1.getAllGrades); // get all grades (ADMIN FUNCTION)
router.get('/grades/user/:userID', GradesController_1.getUserGrades); // get grades for specific user (USER/ ADMIN FUNCTION)
router.get('/grades/:course_id', GradesController_1.getCourseGrades); // get grades for specific course (ADMIN FUNCTION)
router.post('/grades', GradesController_1.uploadGrade); // upload new grade for a course (USER FUNCTION)
// progress-related endpoints
router.get('/progress/user/:userID', ProgressController_1.getUserProgress); // get progress of all courses for a specific user 
router.post('/progress', ProgressController_1.saveProgress); // save course progress for a user
router.post('/progress/user/:userID', ProgressController_1.updateProgress); // update an existing user course progress
// transcript-related endpoints
router.get('/transcript/user/:userID', TranscriptController_1.getUserTranscript); // generate a transcript of completed courses for that user
exports.default = router;
