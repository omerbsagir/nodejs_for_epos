const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');


const handleUpdateWallet = async (event) => {
    const { walletId } = JSON.parse(event.body);

    const params = {
        TableName: process.env.TRANSACTION_TABLE,
        FilterExpression: '#walletId = :walletIdValue',
        ExpressionAttributeNames: {
            '#walletId': 'walletId',
        },
        ExpressionAttributeValues: {
            ':walletIdValue': walletId,
        },
        ProjectionExpression: 'amount',
        
    };

    const params2 = {
        TableName: process.env.WALLETS_TABLE,
        Key: {
            walletId: walletId // Güncellenecek öğenin birincil anahtarı
        },
        UpdateExpression: 'set amount = :amount', // Güncellenmek istenen alan
        ExpressionAttributeValues: {
            ':amount': toplam // Yeni değer
        },
        ReturnValues: 'UPDATED_NEW' // Güncellenen değerlerin döndürülmesini sağlar
    };
    

    let toplam = 0;

    try {
        const result = await dynamoDb.scan(params).promise();
        

        if (result.Items && result.Items.length > 0) {
            result.Items.forEach(item => {
                toplam+=item;
            });
    
        } else {
            console.log('No items found, first you need to create transaction!');
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'No items found, first you need to create transaction!'
                })
            };
        }

        const result2 = await dynamoDb.scan(params2).promise();
        
        if (result2.Items && result2.Items.length > 0) {
            try {
                const result3 = await dynamoDb.update(params2).promise();
                console.log('Update successful:', result3);
                return result3;
            } catch (e2) {
                console.error('Update error:', e2);
                throw new Error('Update failed');
            }
    
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
    const walletId = uuidv4(); // Benzersiz cüzdan ID'si oluşturma
    let amount = 0;

    // Önce ownerId'ye ait bir şirket olup olmadığını kontrol et
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
            // Owner ID'ye ait bir şirket bulunduysa cüzdanı oluştur
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


module.exports = { handleUpdateWallet , createWallet};
