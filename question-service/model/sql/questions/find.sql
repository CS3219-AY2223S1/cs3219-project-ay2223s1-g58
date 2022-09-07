/*
    Find a question name & content by question id.
*/
SELECT q_name, content FROM questions
WHERE q_id = ${QuestionId}