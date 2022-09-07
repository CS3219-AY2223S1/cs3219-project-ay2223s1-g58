
const QuestionsRepository = require('../repository/questions')
const CategoriesRepository = require('../repository/categories');
const md = require('markdown-it')();
async function createQuestion(req, res) {
    try {
        const { name, type, content, difficulty } = req.body;
        if (name && content && difficulty) {
            difficulty.toLowerCase()
            await QuestionsRepository.createTable();
            await CategoriesRepository.createTable();
            console.log("Table created/initialized successfully")
            QuestionsRepository.add(name, content).then(id => { 
                console.log("Question inserted succesfully with question id: " + id.q_id)
                CategoriesRepository.add(id.q_id, difficulty, [type]);
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

async function getQuestion(req, res) {
    try {
        const {difficulty} = req.body;
        if (difficulty) {
            await CategoriesRepository.findByDifficulty(difficulty).then(id => {
                console.log("Question id retrieved: " + id.q_id)
                const result = QuestionsRepository.findById(id.q_id).then(result => {
                    console.log("Result: " + result.q_name)
                    console.log("html: " +  parseMarkDown(result.content))
                    return res.status(201).json(result)
                })
            })
        } else {
            return res.status(400).json({message: `Difficulty is missing!`})
        }
    } catch ( err ) {
        return res.status(500).json({message: 'Database failure when retrieving the question! ' + err})
    }
}

function parseMarkDown(text) {
    return md.render(text)
}

module.exports = {createQuestion, getQuestion}

