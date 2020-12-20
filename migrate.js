const fs = require('fs');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

let config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
};

let connection = null;

async function main() {
    await createDataBase();
    const migrations = getMigrations();
    await processMigration(dynamicLoad(migrations))
}

async function processMigration(migrations) {
    config.database = process.env.DB_DATABASE;
    connection = await mysql.createConnection(config);
    for (let i = 0; i < migrations.length; i++) {
        await createTable(migrations[i].base)
        for (let k = 0; k < migrations[i].migrations.length; k++) {
            await connection.query(migrations[i].migrations[k])
        }
    }
    return true;
}

async function createTable(migration) {

    for(const table in migration){
        if(migration.hasOwnProperty(table)){
            let operation = `CREATE TABLE IF NOT EXISTS  \`${table}\` (`
            Object.keys(migration[table]).forEach((field,i) => {
                operation += (i > 0 ? ', ': '') + `\`${field}\` ` + migration[table][field];
            })
            operation += ')';
            console.log(await connection.query(operation))
        }
    }
}

async function createDataBase() {
    const init = await mysql.createConnection(config)
    await init.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`);
}



function dynamicLoad(list) {
    const models = [];
    list.forEach(item => {
        models.push(require(item));
    })
    return models;
}

function getMigrations() {
    const modelPath = __dirname + '/src/models';
    const migrationPaths = [];
    const folders = fs.readdirSync(modelPath, 'utf8');
    folders.forEach(folder => {
        const migrateCandidate = modelPath + '/' + folder + '/migration.js';
        if (fs.lstatSync(modelPath + '/' + folder).isDirectory() && fs.existsSync(migrateCandidate)) {
            migrationPaths.push(`./src/models/${folder}/migration`);
        }
    })
    return migrationPaths;
}

main().then(() => {
    console.log('done');
    process.exit();
})



