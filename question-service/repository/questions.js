const {questions: sql} = require('../model/sql');
const db = require('../model')


const QuestionRepository = {
    createTable: function() {
        return db.none(sql.create);
    },
    findById: function(id) {
        return db.oneOrNone(sql.find, [id]);
    },
    add: function(name, content) {
        return db.one(sql.add, [name, content]);
    },
    deleteById: function(id) {
        return db.result('DELETE FROM questions where q_id = $1', [id]);
    },
    deleteByName: function(name) {
        return db.result('DELETE FROM questions where q_name = $1', [name])
    }
 
}



module.exports =   QuestionRepository ;