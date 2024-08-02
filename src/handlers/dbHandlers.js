const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');


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
            ':companyIdValue': companyId,
        },
        ProjectionExpression: 'isActive', 
        Limit: 1 // Sadece bir öğe döndür
    };

    try {
        const result = await dynamoDb.scan(params).promise();
        if (result.Items && result.Items.length > 0) {
            const item = result.Items[0];
            console.log('isActive:', item.isActive);
        return item.isActive;
        } else {
            console.log('No items found , first you need to create activation!');
            return null;
        }       
    } catch (error) {
        console.error('Error scanning DynamoDB:', error);
        throw new Error('Error scanning DynamoDB');
    }
    

};

const createCompany = async (event) => {
    const { name, ownerId, iban } = JSON.parse(event.body);

    const companyId = uuidv4(); // Benzersiz şirket ID'si oluşturma
    const activationStatus = false;

    // Önce ownerId'ye ait bir şirket olup olmadığını kontrol et
    const checkParams = {
        TableName: process.env.COMPANIES_TABLE,
        KeyConditionExpression: 'ownerId = :ownerIdValue',
        ExpressionAttributeValues: {
            ':ownerIdValue': ownerId,
        },
    };

    try {
        const checkResult = await dynamoDb.scan(checkParams).promise();
        if (checkResult.Items && checkResult.Items.length > 0) {
            console.log('Owner already has a company');
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Owner already has a company' }),
            };
        } else {
            // Eğer ownerId'ye ait bir şirket yoksa, yeni şirket oluştur
            const params = {
                TableName: process.env.COMPANIES_TABLE,
                Item: {
                    companyId,
                    ownerId,
                    name,
                    iban,
                    activationStatus,
                },
            };

            await dynamoDb.put(params).promise();

            return {
                statusCode: 202,
                body: JSON.stringify({ message: 'Company registration successful' }),
            };
        }
    } catch (error) {
        console.error('Error: ', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Could not register company', error: error.message }),
        };
    }
};
const createActivation = async (event) => {
    const { ownerId ,companyId, tcNo , vergiNo} = JSON.parse(event.body);

    const id = uuidv4(); // Benzersiz kullanıcı ID'si oluşturma
    const isActive = false;

    const params = {
        TableName: process.env.ACTIVATION_TABLE, // DynamoDB tablosu adı
        Item: {
            id,
            ownerId,
            companyId,
            tcNo,
            vergiNo,
            isActive
        }
    };

    try {
        // Kullanıcıyı DynamoDB'ye ekleme
        await dynamoDb.put(params).promise();

        return {
            statusCode: 203,
            body: JSON.stringify({ message: 'Activation added successfully' })
        };
    } catch (error) {
        console.error("Error: ", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Activation adding is not successfull', error: error.message })
        };
    }

};


module.exports = {handleGetUsersAdmin , handleGetUser, checkActiveStatus , createCompany ,createActivation };