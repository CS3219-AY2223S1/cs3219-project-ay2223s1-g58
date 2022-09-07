
import { QuestionsRepository } from "../repository/questions";
import { CategoriesRepository } from "../repository/categories";

export async function createQuestion(req, res) {
    try {
        const { name, type, content, difficulty } = req.body;
        if (name && content && difficulty) {
            difficulty.toLowerCase()
            await QuestionsRepository.createTable()
            await CategoriesRepository.createTable()
            const q_id = await QuestionsRepository.add(name, content);
            const resp = await CategoriesRepository.add(q_id, difficulty, type);
            return res.status(201).json({message: `Create new question successfully!`});
        } else {
            return res.status(400).json({message: 'Question name, difficulty and/or content are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new question! ' + err})
    }
}

export async function getQuestion(req, res) {
    try {
        const {difficulty} = req.body;
        if (difficulty) {
            const q_id = await CategoriesRepository.findByDifficulty(difficulty)
            const result = await QuestionsRepository.findById(q_id)
            return res.status(201).json(result)
        } else {
            return res.status(400).json({message: `Require valid difficulty`})
        }
    } catch ( err ) {
        return res.status(500).json({message: 'Database failure when retrieving the question! ' + err})
    }
}

