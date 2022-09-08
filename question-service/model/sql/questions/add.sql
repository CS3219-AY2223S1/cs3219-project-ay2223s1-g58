INSERT INTO questions(q_name, content)
VALUES($1, $2)
RETURNING q_id