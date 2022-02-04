CREATE DATABASE easterseals;
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(40),
    email TEXT,
    password TEXT,
    phone_num VARCHAR(15),
    date_of_birth DATE,
    race VARCHAR(127),
    gender VARCHAR(127),
    address VARCHAR(255),
    employment_status VARCHAR(127),
    military_affiliated BOOLEAN,
    military_affiliation VARCHAR(30),
    military_start_date DATE,
    military_end_date DATE,
    last_rank VARCHAR(20),
    military_speciality VARCHAR(20),
    household_size INTEGER,
    income VARCHAR(127),
    current_course VARCHAR(20),
    completed_courses VARCHAR(40),
    referral_source VARCHAR(40),
    resources VARCHAR(50)
);
CREATE TABLE courses(
    id SERIAL PRIMARY KEY,
    course_name VARCHAR(40)
);
CREATE TABLE user_grades(
    id SERIAL PRIMARY KEY,
    grade DECIMAL,
    user_id SERIAL NOT NULL,
    course_id SERIAL NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (course_id) REFERENCES courses (id)
);

CREATE TABLE user_feedback(
    id SERIAL PRIMARY KEY,
    rating DECIMAL,
    question TEXT,
    user_id SERIAL NOT NULL,
    course_id SERIAL NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (course_id) REFERENCES courses (id)
);

CREATE TABLE course_progress(
    id SERIAL PRIMARY KEY,
    user_id SERIAL NOT NULL,
    course_id SERIAL NOT NULL,
    progression DECIMAL,
    total_pages DECIMAL,
    date_completed DATE,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (course_id) REFERENCES courses (id)
);