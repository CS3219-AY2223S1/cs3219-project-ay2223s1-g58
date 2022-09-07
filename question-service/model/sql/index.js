
const { QueryFile } = require('pg-promise')();
const {join: joinPath} = require('path');


function sql(file) {

    const fullPath = joinPath(__dirname, file); 

    const options = {
        minify: true

    };

    const qf = new QueryFile(fullPath, options);

    if (qf.error) {
        console.error(qf.error);
    }

    return qf;
}

module.exports = {
    questions: {
        create: sql('questions/create.sql'),
        add: sql('questions/add.sql'),
        find: sql('questions/find.sql')
    },
    categories: {
        create: sql('categories/create.sql'),
        add: sql('categories/add.sql')
    }
};
