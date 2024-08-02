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

const checkActiveStatus = async (event) => {
    const { companyId } = JSON.parse(event.body);

    const params = {
        TableName: process.env.ACTIVATION_TABLE,
        FilterExpression: '#companyId = :companyIdValue',
        ExpressionAttributeNames: {
            '#companyId': 'companyId',
        },
        ExpressionAttributeValues: {
            ':isActiveValue': isActive,
        },
        ProjectionExpression: 'isActive', // Sadece companyId alanını seç
        Limit: 1 // Sadece bir öğe döndür
    };

    try {
        const result = await dynamoDb.scan(params).promise();
        if (result.Items && result.Items.length > 0) {
            const item = result.Items[0];
            console.log('isActive:', item.isActive);
        return item.isActive;
        } else {
            console.log('No items found');
            return null;
        }       
    } catch (error) {
        console.error('Error scanning DynamoDB:', error);
        throw new Error('Error scanning DynamoDB');
    }
    

};

const createCompany = async (event) => {
    const { name , ownerId , iban } = JSON.parse(event.body);

    const companyId = uuidv4(); // Benzersiz kullanıcı ID'si oluşturma
    const activationStatus = false;

    const params = {
        TableName: process.env.COMPANIES_TABLE, // DynamoDB tablosu adı
        Item: {
            companyId,
            ownerId,
            name,
            iban,
            activationStatus
        }
    };

    try {
        // Kullanıcıyı DynamoDB'ye ekleme
        await dynamoDb.put(params).promise();

        return {
            statusCode: 202,
            body: JSON.stringify({ message: 'Company registration successful' })
        };
    } catch (error) {
        console.error("Error: ", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Could not register company', error: error.message })
        };
    }

}


module.exports = {handleGetUsersAdmin , handleGetUser, checkActiveStatus , createCompany };