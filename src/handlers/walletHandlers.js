const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');


const handleUpdateWallet = async (event) => {
    const { walletId } = JSON.parse(event.body);

    const params = {
        TableName: process.env.TRANSACTIONS_TABLE,
        FilterExpression: '#walletId = :walletIdValue',
        ExpressionAttributeNames: {
            '#walletId': 'walletId',
        },
        ExpressionAttributeValues: {
            ':walletIdValue': walletId,
        },
        ProjectionExpression: 'amount',
    };

    
    let toplam = 0;

    
    try {
        
        const result = await dynamoDb.scan(params).promise();
        
        if (result.Items && result.Items.length > 0) {
            
            result.Items.forEach(item => {
                toplam += parseFloat(item.amount); 
            });

            
            const params2 = {
                TableName: process.env.WALLETS_TABLE,
                Key: {
                    walletId: walletId 
                },
                UpdateExpression: 'set amount = :amount', 
                ExpressionAttributeValues: {
                    ':amount': toplam 
                },
                ReturnValues: 'UPDATED_NEW' 
            };

           
            const result2 = await dynamoDb.update(params2).promise();
            console.log('Update successful:', result2);
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Update successful', result: result2 }),
            };
        } else {
            console.log('No items found, first you need to create transaction!');
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'No items found, first you need to create transaction!'
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


const createWallet = async (event) => {
    const { ownerId, companyId, iban } = JSON.parse(event.body);
    const walletId = uuidv4(); 
    let amount = 0;

 
    const checkParams = {
        TableName: process.env.COMPANIES_TABLE,
        FilterExpression: 'ownerId = :ownerIdValue',
        ExpressionAttributeValues: {
            ':ownerIdValue': ownerId,
        },
    };
    const checkParams2 = {
        TableName: process.env.WALLETS_TABLE,
        FilterExpression: 'ownerId = :ownerIdValue',
        ExpressionAttributeValues: {
            ':ownerIdValue': ownerId,
        },
    };

    try {
        const checkResult = await dynamoDb.scan(checkParams).promise();
        const checkResult2 = await dynamoDb.scan(checkParams2).promise();

        if (checkResult.Items && checkResult.Items.length > 0 && checkResult2.Items.length == 0) {
            
            const params = {
                TableName: process.env.WALLETS_TABLE,
                Item: {
                    walletId,
                    ownerId,
                    companyId,
                    iban,
                    amount,
                }
            };

            const result = await dynamoDb.put(params).promise();

            return {
                statusCode: 201,
                body: JSON.stringify({ message: 'Wallet creation successful', result }),
            };
        } else {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'No company found for the given owner' }),
            };
        }
    } catch (error) {
        console.error('Error: ', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Could not create wallet', error: error.message }),
        };
    }
};

const deleteWallet = async (event) => {
    const { ownerId } = JSON.parse(event.body);

    const checkParams = {
        TableName: process.env.WALLETS_TABLE,
        FilterExpression: '#ownerId = :ownerIdValue',
        ExpressionAttributeNames: {
            '#ownerId': 'ownerId',
        },
        ExpressionAttributeValues: {
            ':ownerIdValue': ownerId,
        },
        ProjectionExpression: 'walletId',  // Use ProjectionExpression to retrieve the 'id'
    };

    try {
        const checkResult = await dynamoDb.scan(checkParams).promise();
        
        if (checkResult.Items && checkResult.Items.length > 0) {
            // Assuming there might be multiple items and you want to delete all of them
            const deletePromises = checkResult.Items.map(async (item) => {
                const deleteParams = {
                    TableName: process.env.WALLETS_TABLE,
                    Key: {
                        walletId: item.walletId,  // Use item.id from the scan result
                    },
                };

                await dynamoDb.delete(deleteParams).promise();
            });

            await Promise.all(deletePromises);

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Cüzdan başarıyla silindi!' }),
            };
        } else {
            console.log('Bir Şirket Bulunmuyor');
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Bir Cüzdan Bulunmuyor' }),
            };
        }

    } catch (error) {
        console.error("Error: ", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Cüzdan silinemedi!', error: error.message }),
        };
    }
};

module.exports = { handleUpdateWallet , createWallet , deleteWallet};
