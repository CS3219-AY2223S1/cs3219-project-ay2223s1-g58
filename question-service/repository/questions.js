const {questions: sql} = require('../model/sql');
import db from '../model';

const QuestionsRepository = {
    createTable : function() {
        return this.db.none(sql.create);
    },
    findById : function(id) {
        return db.one(sql.find, id);
    },
    add : function(name, content) {
        return db.one(sql.add, name, content);
    },
    deleteById : function(id) {
        return db.result('DELETE FROM questions where q_id = $1', id);
    }
    
}




export { QuestionsRepository }