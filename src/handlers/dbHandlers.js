const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');
const cognito = new AWS.CognitoIdentityServiceProvider();

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

    const checkParams = {
        TableName: process.env.ACTIVATION_TABLE,
        FilterExpression: 'companyId = :companyIdValue',
        ExpressionAttributeValues: {
            ':companyIdValue': companyId,
        },
    };

    
    try {
        
        const checkResult = await dynamoDb.scan(checkParams).promise();
        if (checkResult.Items && checkResult.Items.length > 0) {
            console.log('Company already has a activation request');
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Company already has a activation request' }),
            };
        }else{
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
            await dynamoDb.put(params).promise();

            return {
                statusCode: 203,
                body: JSON.stringify({ message: 'Activation added successfully' }),
            };

        }

    } catch (error) {
        console.error("Error: ", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Activation adding is not successfull', error: error.message })
        };
    }

};
const deleteActivation = async (event) => {
    const { ownerId } = JSON.parse(event.body);

    const checkParams = {
        TableName: process.env.ACTIVATION_TABLE,
        FilterExpression: '#ownerId = :ownerIdValue',
        ExpressionAttributeNames: {
            '#ownerId': 'ownerId',
        },
        ExpressionAttributeValues: {
            ':ownerIdValue': ownerId,
        },
        ProjectionExpression: 'id',  // Use ProjectionExpression to retrieve the 'id'
    };

    try {
        const checkResult = await dynamoDb.scan(checkParams).promise();
        
        if (checkResult.Items && checkResult.Items.length > 0) {
            // Assuming there might be multiple items and you want to delete all of them
            const deletePromises = checkResult.Items.map(async (item) => {
                const deleteParams = {
                    TableName: process.env.ACTIVATION_TABLE,
                    Key: {
                        id: item.id,  // Use item.id from the scan result
                    },
                };

                await dynamoDb.delete(deleteParams).promise();
            });

            await Promise.all(deletePromises);

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Aktivasyon başarıyla silindi!' }),
            };
        } else {
            console.log('Bir Aktivasyon Bulunmuyor');
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Bir Aktivasyon Bulunmuyor' }),
            };
        }

    } catch (error) {
        console.error("Error: ", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Aktivasyon silinemedi!', error: error.message }),
        };
    }
};
const deleteCompany = async (event) => {
    const { ownerId } = JSON.parse(event.body);

    const checkParams = {
        TableName: process.env.COMPANIES_TABLE,
        FilterExpression: '#ownerId = :ownerIdValue',
        ExpressionAttributeNames: {
            '#ownerId': 'ownerId',
        },
        ExpressionAttributeValues: {
            ':ownerIdValue': ownerId,
        },
        ProjectionExpression: 'companyId',  // Use ProjectionExpression to retrieve the 'id'
    };

    try {
        const checkResult = await dynamoDb.scan(checkParams).promise();
        
        if (checkResult.Items && checkResult.Items.length > 0) {
            // Assuming there might be multiple items and you want to delete all of them
            const deletePromises = checkResult.Items.map(async (item) => {
                const deleteParams = {
                    TableName: process.env.COMPANIES_TABLE,
                    Key: {
                        companyId: item.companyId,  // Use item.id from the scan result
                    },
                };

                await dynamoDb.delete(deleteParams).promise();
            });

            await Promise.all(deletePromises);

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Şirket başarıyla silindi!' }),
            };
        } else {
            console.log('Bir Şirket Bulunmuyor');
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Bir Şirket Bulunmuyor' }),
            };
        }

    } catch (error) {
        console.error("Error: ", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Şirket silinemedi!', error: error.message }),
        };
    }
};
const deleteUser = async (event) => {
    const { email } = JSON.parse(event.body);

    // Define parameters for DynamoDB
    const checkParams = {
        TableName: process.env.USERS_TABLE,
        FilterExpression: '#email = :emailValue',
        ExpressionAttributeNames: {
            '#email': 'email', // Define the email attribute
        },
        ExpressionAttributeValues: {
            ':emailValue': email,
        },
        ProjectionExpression: '#email', // Only retrieve the email attribute
    };

    try {
        // Scan DynamoDB table to find users
        const checkResult = await dynamoDb.scan(checkParams).promise();
        
        if (checkResult.Items && checkResult.Items.length > 0) {
            // Delete users from DynamoDB
            const deletePromises = checkResult.Items.map(async (item) => {
                const deleteParams = {
                    TableName: process.env.USERS_TABLE,
                    Key: {
                        email: item.email,  // Use the primary key from the scan result
                    },
                };

                await dynamoDb.delete(deleteParams).promise();
            });

            await Promise.all(deletePromises);

            // Delete user from Cognito
            try {
                const cognitoParams = {
                    UserPoolId: process.env.COGNITO_USER_POOL_ID, // Your Cognito User Pool ID
                    Username: email, // Cognito Username
                };

                await cognito.adminDeleteUser(cognitoParams).promise();
            } catch (cognitoError) {
                console.error("Cognito Error: ", cognitoError);
                return {
                    statusCode: 500,
                    body: JSON.stringify({ message: 'Kullanıcı Cognito\'dan silinemedi!', error: cognitoError.message }),
                };
            }

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Kullanıcı başarıyla silindi!' }),
            };
        } else {
            console.log('Bir Kullanıcı Bulunamadı');
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Bir Kullanıcı Bulunamadı' }),
            };
        }

    } catch (error) {
        console.error("Error: ", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Kullanıcı silinemedi!', error: error.message }),
        };
    }
};


module.exports = {handleGetUsersAdmin , handleGetUser, checkActiveStatus , createCompany ,createActivation , handleGetCompany,handleGetWallet,handleGetActivation,deleteActivation,deleteCompany,deleteUser};