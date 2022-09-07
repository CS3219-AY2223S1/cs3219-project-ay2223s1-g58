const {categories: sql} = require('../model/sql');
const db = require('../model')


const CategoriesRepository = {
    createTable: function() {
        return db.none(sql.create);
    },
    add: function(id, difficulty, type) {
        return db.none(sql.add, [id, difficulty, type]);
    },
    findByDifficulty: function(difficulty) {
        return db.oneOrNone('SELECT q_id FROM categories WHERE difficulty = $1 ORDER BY random() LIMIT 1', [difficulty]);
    }
}

module.exports =  CategoriesRepository;
