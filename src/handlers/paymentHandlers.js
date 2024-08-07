const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');


const handleCreateTransaction = async (event) => {
    const { walletId ,cardNumber, expiryDate , cardName,amount} = JSON.parse(event.body);

    const transactionId = uuidv4(); // Benzersiz kullanıcı ID'si oluşturma

    const params = {
        TableName: process.env.TRANSACTIONS_TABLE, // DynamoDB tablosu adı
        Item: {
            transactionId,
            walletId,
            cardNumber,
            expiryDate,
            cardName,
            amount
        }
    };

    try {
        // Kullanıcıyı DynamoDB'ye ekleme
        await dynamoDb.put(params).promise();

        return {
            statusCode: 204,
            body: JSON.stringify({ message: 'Transaction added successfully' })
        };
    } catch (error) {
        console.error("Error: ", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Transaction adding is not successfull', error: error.message })
        };
    }

};




module.exports = { handleCreateTransaction };
