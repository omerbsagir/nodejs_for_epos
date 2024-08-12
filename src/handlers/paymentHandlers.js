const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');


const handleCreateTransaction = async (event) => {
    const { walletId ,cardNumber, expiryDate , cardName,amount} = JSON.parse(event.body);

    const transactionId = uuidv4(); 

    const params = {
        TableName: process.env.TRANSACTIONS_TABLE, 
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
const handleGetTransactions = async (event) => {
    const { walletId } = JSON.parse(event.body);

    const params = {
        TableName: process.env.TRANSACTIONS_TABLE_TABLE,
        FilterExpression: 'walletId = :walletId',
        ExpressionAttributeValues: {
            ':walletId': walletId
        }
    };
    
    try {
        const result = await dynamoDb.scan(params).promise();
        
        return {
            statusCode: 200,
            body: JSON.stringify(result.Items)
        };
        
        
    } catch (error) {
        console.error("Error: ", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Could not fetch transactions', error: error.message })
        };
    }
};



module.exports = { handleCreateTransaction , handleGetTransactions };
