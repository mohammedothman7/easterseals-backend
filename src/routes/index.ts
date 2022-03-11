import {Router} from 'express'
import {getUsers, getUser, createUser, signInUser, updateUser, deleteUser, updateUserPassword} from '../controllers/UsersController'
import {createApplicationFeedback, getAllFeedback, getCourseFeedback, postFeedback} from '../controllers/FeedbackController'
import {getAllGrades, getUserGrades, getCourseGrades, uploadGrade} from '../controllers/GradesController'
import {getUserProgress, saveProgress, updateProgress} from '../controllers/ProgressController'
import {getUserTranscript, getUserDetails} from '../controllers/TranscriptController'

const router = Router();

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
router.get('/users', getUsers) // get all users (ADMIN FUNCTION)
router.get('/users/:userID', getUser) // get specific user (ADMIN FUNCTION)
router.post('/users/signup', createUser) // register user (USER FUNCTION)
router.post('/users/login', signInUser) // log in user (USER FUNCTION)
router.put('/users/:userID', updateUser) // update user details (USER FUNCTION)
router.put('/users/:userID/changePassword', updateUserPassword) // delete user (USER/ ADMIN FUNCTION)
router.delete('/users/:userID', deleteUser) // delete user (USER/ ADMIN FUNCTION)

// feedback-related endpoints
router.get('/feedback', getAllFeedback) // get feedback for all courses (ADMIN FUNCTION)
router.get('/feedback/:courseID', getCourseFeedback) // get feedback for specific course (ADMIN FUNCTION)
router.post('/feedback', postFeedback) // post new feedback about course (USER FUNCTION)
router.post('/application-feedback', createApplicationFeedback) // post new feedback about application (USER FUNCTION)

// grade-related endpoints
router.get('/grades', getAllGrades) // get all grades (ADMIN FUNCTION)
router.get('/grades/user/:userID', getUserGrades) // get grades for specific user (USER/ ADMIN FUNCTION)
router.get('/grades/:course_id', getCourseGrades) // get grades for specific course (ADMIN FUNCTION)
router.post('/grades', uploadGrade) // upload new grade for a course (USER FUNCTION)

// progress-related endpoints
router.get('/progress/user/:userID', getUserProgress) // get progress of all courses for a specific user 
router.post('/progress', saveProgress) // save course progress for a user
router.post('/progress/user/:userID', updateProgress) // update an existing user course progress


// transcript-related endpoints
router.get('/transcript/user/:userID', getUserTranscript) // generate a transcript of completed courses for that user
router.get('/transcript/user/transcript/:userID', getUserDetails) // generate a transcript of completed courses for that user

export default router;