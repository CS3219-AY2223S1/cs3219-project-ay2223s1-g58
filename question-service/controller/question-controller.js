
const QuestionRepository = require('../repository/questions')
const CategoryRepository = require('../repository/categories');
const md = require('markdown-it')();

async function createQuestion(req, res) {
    try {
        const { name, type, content, difficulty } = req.body;
        if (name && content && difficulty) {
            difficulty.toLowerCase()
            await QuestionRepository.createTable();
            await CategoryRepository.createTable();
            console.log("Table created/initialized successfully")
            QuestionRepository.add(name, content).then(id => { 
                console.log("Question inserted succesfully with question id: " + id.q_id)
                CategoryRepository.add(id.q_id, difficulty, [type]);
                console.log("Category inserted succesfully")
                return res.status(201).json({message: `Create new question successfully!`});
            })

        } else {
            return res.status(400).json({message: 'Question name, difficulty and/or content are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new question! ' + err})
    }
}

async function getQuestionByDifficulty(req, res) {
    try {
        const {difficulty} = req.body;
        if (difficulty) {
            await CategoryRepository.findByDifficulty(difficulty).then(id => {
                console.log("Question id retrieved: " + id.q_id)
                const result = QuestionRepository.findById(id.q_id).then(result => {
                    console.log("Question Id: " + id.q_id)
                    console.log("Question Name: " + result.q_name)
                    return res.status(201).json({
                        "Name": result.q_name,
                        "Content": parseMarkDown(result.content)
                    })
                })
            })
        } else {
            return res.status(400).json({message: `Difficulty is missing!`})
        }
    } catch ( err ) {
        return res.status(500).json({message: 'Database failure when retrieving the question! ' + err})
    }
}

async function deleteQuestionById(req, res) {
    try {
        const {id} = req.body;
        if (id) {
            await QuestionRepository.deleteById(id).then(result => {
                console.log("Question delete succesfully")
                return res.status(201).json({message: `Question deleted succesfully`});
            }).catch(err => {
                console.log("Error occurs when deleting question: " + err)
            })
        } else {
            return res.status(400).json({message: 'Question id is missing for deletion'})
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when retrieving the question! ' + err})
    }
}

function parseMarkDown(text) {
    return md.render(text)
}

module.exports = {createQuestion, getQuestionByDifficulty, deleteQuestionById}

