export const messageQuery__createTable = "CREATE TABLE IF NOT EXISTS messages ( sender_ID INT, receiver_ID INT, message VARCHAR(1000000000), id INT PRIMARY KEY AUTO_INCREMENT )";

export const messageQuery__sendMessage = "INSERT INTO messages ( `sender_ID`, `receiver_ID`, `message` ) VALUES (?)";

export const messageQuery__getUsers = "SELECT * FROM users";

export const getBothUsersMessages = (sender_ID, receiver_ID) => {
    const messageQuery__getMessages = `SELECT * FROM messages WHERE ( sender_ID = ${sender_ID} AND receiver_ID = ${receiver_ID} ) OR ( receiver_ID = ${sender_ID} AND sender_ID = ${receiver_ID} )`;

    return messageQuery__getMessages;
};



