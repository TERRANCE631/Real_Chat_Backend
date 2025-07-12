export const userQuery__table = `CREATE TABLE IF NOT EXISTS users ( username VARCHAR(200), email VARCHAR(200), password VARCHAR(200), id INT PRIMARY KEY AUTO_INCREMENT )`;

export const userQuery__credantials = "INSERT INTO users (`username`, `email`, `password`) VALUES (?)";

export const userQuery__checkUser = "SELECT * FROM users";

export const userQuery__createDb = "CREATE DATABASE IF NOT EXISTS chatApp";

export const userQuery__getUserID = "SELECT * FROM users WHERE email = ?";


