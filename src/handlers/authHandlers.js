const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const cognito = new AWS.CognitoIdentityServiceProvider();

const handleLogin = async (event) => {
    const { email,phone, password } = JSON.parse(event.body);
    
    const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthParameters: {
            USERNAME: email,
            PHONE : phone,
            PASSWORD: password
        }
    };

    try {
        const authResult = await cognito.initiateAuth(params).promise();

        const idToken = authResult.AuthenticationResult.IdToken;
        const accessToken = authResult.AuthenticationResult.AccessToken;
        const refreshToken = authResult.AuthenticationResult.RefreshToken;

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Login successful',
                idToken,
                accessToken,
                refreshToken
            })
        };
    } catch (error) {
        console.error("Login error: ", error);

        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Login failed', error: error.message })
        };
    }
};

const handleRegister = async (event) => {
    const { email, phone, password } = JSON.parse(event.body);
    
    const userId = uuidv4(); // Benzersiz kullanıcı ID'si oluşturma
    const hashedPassword = await bcrypt.hash(password, 10); // Parolayı hashleme
    const createdAt = new Date().toISOString();

    const params = {
        TableName: process.env.USERS_TABLE, // DynamoDB tablosu adı
        Item: {
            userId,
            email,
            phone,
            password: hashedPassword, // Hashlenmiş parolayı kaydetme
            createdAt
        }
    };

    try {
        // Kullanıcıyı DynamoDB'ye ekleme
        await dynamoDb.put(params).promise();

        // Kullanıcıyı Cognito'ya ekleme
        const cognitoParams = {
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Username: email,
            UserAttributes: [
                { Name: 'email', Value: email },
                { Name: 'phone_number', Value: phone }
            ],
            MessageAction: 'SUPPRESS', // Do not send welcome email
            TemporaryPassword: password // Geçici parola, kullanıcı ilk girişte değiştirmeli
        };

        await cognito.adminCreateUser(cognitoParams).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Registration successful' })
        };
    } catch (error) {
        console.error("Error: ", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Could not register user', error: error.message })
        };
    }
};

module.exports = { handleLogin ,handleRegister };
