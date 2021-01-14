const base = {
    user:{
        id: 'binary(16) NOT NULL PRIMARY KEY',
        userName: 'varchar(40) DEFAULT NULL UNIQUE',
        password: 'varchar(255) DEFAULT NULL',
        createdAt: 'timestamp NULL DEFAULT current_timestamp()',
        deletedAt: 'datetime DEFAULT NULL'
    },
    user_role:{}
}

module.exports = {
    base,
    migrations: []
}