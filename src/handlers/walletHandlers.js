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

    // `toplam` değişkenini tanımlama
    let toplam = 0;

    // `params2` tanımından önce `toplam` hesaplamasını yapmalısınız
    try {
        // İşlemleri al
        const result = await dynamoDb.scan(params).promise();
        
        if (result.Items && result.Items.length > 0) {
            // Amount toplamını hesapla
            result.Items.forEach(item => {
                toplam += item.amount; // `item.amount` ile `amount` özelliğini referans al
            });

            // Cüzdanı güncelle
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

            // Güncelleme işlemi
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
