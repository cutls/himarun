const mysql = require('mysql')
const dotenv = require('dotenv')
dotenv.config()
const config = process.env
const dbConfig = {
	host: config.DB_HOST,
	user: config.DB_USER,
	password: config.DB_PASSWORD,
	database: config.DB_DATABASE,
}
const table = config.DB_TABLE
const con = mysql.createConnection(dbConfig)

con.query(`SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";`, (error, results) => {
	if(error) console.error(error)
})
con.query(`SET AUTOCOMMIT = 0;`, (error, results) => {
	if(error) console.error(error)
})
con.query(`START TRANSACTION;`, (error, results) => {
	if(error) console.error(error)
})
con.query(`SET time_zone = "+09:00"`, (error, results) => {
	if(error) console.error(error)
})
con.query(`CREATE TABLE \`${table}\` (
	\`ID\` int(10) NOT NULL,
	\`Acct\` varchar(100) NOT NULL,
	\`URL\` varchar(100) NOT NULL,
	\`StatusCreatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	\`GetAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	\`Date\` varchar(10) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`, (error, results) => {
	if(error) console.error(error)
})
con.query(`ALTER TABLE \`${table}\`
ADD PRIMARY KEY (\`ID\`);`, (error, results) => {
	if(error) console.error(error)
})
con.query(`ALTER TABLE \`${table}\`
MODIFY \`ID\` int(10) NOT NULL AUTO_INCREMENT;`, (error, results) => {
	if(error) console.error(error)
})
con.query(`COMMIT;`, (error, results) => {
	if(error) console.error(error)
})
console.log('If you can see no error, it is completed. So you can Ctrl+C or something to exit.')