const {categories: sql} = require('../model/sql');
import { db } from '../model';

const CategoriesRepository = {
    createTable : function() {
        return db.none(sql.create);
    },
    add(id, difficulty, type) {
        return db.one(sql.add, id, difficulty, type);
    },
    findByDifficulty(difficulty) {
        return db.oneOrNone('SELECT q_id FROM categories WHERE difficulty = $1 ORDER BY random() LIMIT 1', difficulty);
    }
}

export { CategoriesRepository }
