import { createConnection } from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const db = createConnection({
    host: process.env.MYSQL_HOST,
    password: process.env.MYSQL_PASSWORD,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE
});

const connectdb = async () => {
    try {
        db.connect();
        console.log("MySQL is running 👍👍");
    } catch (error) {
        console.log("Database connection error!");
        console.log(error);
        // db.end()
    }
};

export { db, connectdb }