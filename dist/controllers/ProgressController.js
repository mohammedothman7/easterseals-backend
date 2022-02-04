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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProgress = exports.saveProgress = exports.getUserProgress = void 0;
const database_1 = require("../database");
// get progress of all courses for a specific user
const getUserProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = parseInt(req.params.userID);
    try {
        const response = yield database_1.pool.query("SELECT * FROM course_progress WHERE user_id = $1", [user_id]);
        if (response.rows.length < 1) {
            res.status(404).json({
                message: "No progress found for this user",
            });
        }
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json("Internal Server Error");
    }
});
exports.getUserProgress = getUserProgress;
// save course progress for a user
const saveProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { progression, total_pages, user_id, course_id } = req.body;
    if (!progression || !total_pages || !user_id || !course_id) {
        return res.status(400).json({
            message: "Please provide all required fields",
        });
    }
    try {
        const response = yield database_1.pool.query("SELECT * FROM course_progress WHERE user_id = $1 AND course_id = $2", [user_id, course_id]);
        if (((_a = response === null || response === void 0 ? void 0 : response.rows) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            return res.status(400).json({
                message: "Row already exists, please use the update endpoint to update row"
            });
        }
        yield database_1.pool.query("INSERT INTO course_progress (progression, total_pages, user_id, course_id) VALUES ($1, $2, $3, $4)", [progression, total_pages, user_id, course_id]);
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
    }
    catch (e) {
        console.log(e);
        return res.status(500).json("Internal Server Error " + e);
    }
});
exports.saveProgress = saveProgress;
// update an existing user course progress
const updateProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            yield database_1.pool.query("UPDATE course_progress SET progression = $1, date_completed = CURRENT_DATE WHERE user_id = $2 AND course_id = $3", [progression, user_id, course_id]);
        }
        // user has not yet completed course
        else {
            // update the progression value in database using record that matches the user_id and course_id
            yield database_1.pool.query("UPDATE course_progress SET progression = $1 WHERE user_id = $2 AND course_id = $3", [progression, user_id, course_id]);
        }
        return res.json("Progress updated for course " + course_id + " for user " + user_id);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json("Internal Server Error");
    }
});
exports.updateProgress = updateProgress;
