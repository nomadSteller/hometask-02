const databaseConfig = {
    dialect: process.env.dialect || 'sqlite',
    storage: !process.env.TEST_DB 
        ? './database.sqlite3' 
        : process.env.TEST_DB == 'isolated' 
            ? `./jestTestDb/${Date.now()}.sqlite3`
            : './jestTestDb/db.sqlite3'
}

module.exports = { databaseConfig }