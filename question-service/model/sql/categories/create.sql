/*
    Creates table categories of question.
*/
CREATE TABLE IF NOT EXISTS categories
(
    q_id integer unique,
    difficulty varchar(7) NOT NULL constraint valid_difficulty check (difficulty in ('easy', 'medium', 'hard')),
    q_type varchar[],
    FOREIGN KEY(q_id) REFERENCES questions(q_id) ON DELETE CASCADE ON UPDATE CASCADE
)