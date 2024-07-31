const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();


// Kullanıcı verilerini almak için örnek fonksiyon
const getUser = async (email) => {
    const params = {
        TableName: 'accountsSanalPos',
        Key: { email },
    };
    
    try {
        const result = await dynamodb.get(params).promise();
        console.log('User data:', result.Item);
        return result.Item;
    } catch (err) {
        console.error('Error getting user:', err);
    }
};

