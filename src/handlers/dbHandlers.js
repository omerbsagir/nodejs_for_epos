const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');


const handleGetUser = async (event) => {
    const { userId } = JSON.parse(event.body);

    const params = {
        TableName: process.env.USERS_TABLE,
        FilterExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
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
const handleGetCompany = async (event) => {
    const { ownerId } = JSON.parse(event.body);

    const params = {
        TableName: process.env.COMPANIES_TABLE,
        FilterExpression: 'ownerId = :ownerId',
        ExpressionAttributeValues: {
            ':ownerId': ownerId
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
            body: JSON.stringify({ message: 'Could not fetch company', error: error.message })
        };
    }
};
const handleGetWallet = async (event) => {
    const { ownerId } = JSON.parse(event.body);

    const params = {
        TableName: process.env.WALLETS_TABLE,
        FilterExpression: 'ownerId = :ownerId',
        ExpressionAttributeValues: {
            ':ownerId': ownerId
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
            body: JSON.stringify({ message: 'Could not fetch company', error: error.message })
        };
    }
};
const handleGetActivation = async (event) => {
    const { companyId } = JSON.parse(event.body);

    const params = {
        TableName: process.env.ACTIVATION_TABLE,
        FilterExpression: 'companyId = :companyId',
        ExpressionAttributeValues: {
            ':companyId': companyId
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
            body: JSON.stringify({ message: 'Could not fetch activation docs', error: error.message })
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
        Limit: 1 
    };
    
    try {
        const result = await dynamoDb.scan(params).promise();
        if (result.Items && result.Items.length > 0) {
            const item = result.Items[0];
            console.log('isActive:', item.isActive);
            return {
                statusCode: 204,
                body: JSON.stringify({
                    isActive: item.isActive
                })
            };
        } else {
            console.log('No items found, first you need to create activation!');
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'No items found, first you need to create activation!'
                })
            };
        }

        
    } catch (error) {
        console.error('Error scanning DynamoDB:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error scanning DynamoDB',
                error: error.message
            })
        };
    }
};


const createCompany = async (event) => {
    const { name, ownerId, iban } = JSON.parse(event.body);

    const companyId = uuidv4(); 
    const activationStatus = false;

    
    const checkParams = {
        TableName: process.env.COMPANIES_TABLE,
        FilterExpression: 'ownerId = :ownerIdValue',
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

    const id = uuidv4(); 
    const isActive = false;

    const params = {
        TableName: process.env.ACTIVATION_TABLE, 
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


module.exports = {handleGetUsersAdmin , handleGetUser, checkActiveStatus , createCompany ,createActivation , handleGetCompany,handleGetWallet,handleGetActivation};