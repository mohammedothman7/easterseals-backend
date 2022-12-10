# easterseals-backend 

## Setup

##### Clone the repository

```
git clone git@github.com:bhavrish/easterseals-backend.git
```

##### Install dependencies

```
npm install
```

##### Setup env file

Create a `.env` file in your root directory, paste the following and replace your username and password with your Postgres credentials

```
DB_USER = user
DB_HOST = localhost
DB_PASSWORD = password
DATABASE = database
DB_PORT = 5432
PORT = 3000
```

## Database

```bash
brew install postgresql
brew services start postgresql
psql postgres
```

```sql
CREATE ROLE [username] WITH LOGIN PASSWORD [password];
CREATE DATABASE easterseals;
GRANT ALL PRIVILEGES ON DATABASE easterseals TO [username];

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(40),
    email TEXT,
    password TEXT,
    phone_num VARCHAR(15),
    date_of_birth DATE,
    race VARCHAR(20),
    gender VARCHAR(20),
    address VARCHAR(50),
    employment_status VARCHAR(15),
    military_affiliated BOOLEAN,
    military_affiliation VARCHAR(30),
    military_start_date DATE,
    military_end_date DATE,
    last_rank VARCHAR(20),
    military_speciality VARCHAR(20),
    household_size INTEGER,
    income FLOAT,
    current_course VARCHAR(20),
    completed_courses VARCHAR(40)
);

CREATE TABLE courses_content(
    id SERIAL PRIMARY KEY,
    courseName VARCHAR(40),
    pageTitle TEXT,
    pageNumber INTEGER,
    pageType TEXT,
    content TEXT,
    choices TEXT,
    correctAnswer INTEGER
);

CREATE TABLE courses_grades(
    id INTEGER PRIMARY KEY,
    FOREIGN KEY(id) REFERENCES users(id),
    coverLetter_current_page INTEGER DEFAULT 1,
    elevatorPitch_current_page INTEGER DEFAULT 1,
    emails_current_page INTEGER DEFAULT 1,
    establishingSchedule_current_page INTEGER DEFAULT 1,
    interviewPreparation_current_page INTEGER DEFAULT 1,
    personalMotivation_current_page INTEGER DEFAULT 1,
    selfAssessment_current_page INTEGER DEFAULT 1,
    transferableSkills_current_page INTEGER DEFAULT 1,
    typesOfInterviews_current_page INTEGER DEFAULT 1
);
