const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();



const handleGetUser = async (event) => {
    const { email } = JSON.parse(event.body);

    const params = {
        TableName: process.env.USERS_TABLE,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: {
            ':email': email
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
            body: JSON.stringify({ message: 'Could not fetch user', error: error.message })
        };
    }
};

const handleGetUsersAdmin = async (event) => {

    const { adminId } = JSON.parse(event.body);
    
    const params = {
        TableName: process.env.USERS_TABLE,
        FilterExpression: 'adminId = :adminId',
        ExpressionAttributeValues: {
            ':adminId': adminId
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
            body: JSON.stringify({ message: 'Could not fetch users', error: error.message })
        };
    }
};

module.exports = {handleGetUsersAdmin , handleGetUser};