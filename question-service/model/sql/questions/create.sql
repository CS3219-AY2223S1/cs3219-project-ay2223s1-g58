/*
    Creates table questions.
*/
CREATE TABLE IF NOT EXISTS questions
(
    q_id serial PRIMARY KEY,
    q_name varchar(50) NOT NULL,
    content text NOT NULL
)