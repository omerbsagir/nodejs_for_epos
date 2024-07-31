const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();



const handleGetUser = async (email) => {
    const params = {
        TableName: process.env.USERS_TABLE,
        Key: { email },
    };
    
    try {
        const result = await dynamoDb.get(params).promise();
        console.log('User data:', result.Item);
        return result.Item;

        
    } catch (err) {
        console.error('Error getting user:', err);
    }
};

const handleGetUsersAdmin = async (event) => {

    const { adminId } = JSON.parse(event.body);
    
    const params = {
        TableName: process.env.USERS_TABLE,
        IndexName: 'adminId-index',
        KeyConditionExpression: 'adminId = :adminId',
        ExpressionAttributeValues: {
            ':adminId': adminId
        }
    };

    try {
        const result = await dynamoDb.query(params).promise();
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