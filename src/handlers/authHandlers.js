const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();

const JWT_SECRET = process.env.JWT_SECRET; // JWT imzalama anahtarı
const JWT_EXPIRES_IN = '1h'; // JWT'nin geçerlilik süresi

const handleLogin = async (event) => {
    const { email, password } = JSON.parse(event.body);

    const params = {
        TableName: process.env.USERS_TABLE,
        Key: { email }
    };

    try {
        const result = await dynamoDb.get(params).promise();
        const user = result.Item;

        if (!user || !await bcrypt.compare(password, user.password)) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid email or password' })
            };
        }

        // JWT oluşturma
        const token = jwt.sign(
            { email: user.email, userId: user.userId , role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Login successful',
                token
            })
        };
    } catch (error) {
        console.error("Login error: ", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Login failed', error: error.message })
        };
    }
};


const handleRegister = async (event) => {
    const { email, phone, password ,role,adminId} = JSON.parse(event.body);

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
            createdAt,
            role:1,
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
                { Name: 'phone_number', Value: phone } ,
                { Name: 'custom-role', Value: role}
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

const handleRegisterForUserRole = async (event) => {
    const { email, phone, password ,role,adminId} = JSON.parse(event.body);

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
            createdAt,
            role: 2,
            adminId
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
                { Name: 'phone_number', Value: phone } ,
                { Name: 'custom-role', Value: role}
            ],
            MessageAction: 'SUPPRESS', // Do not send welcome email
            TemporaryPassword: password // Geçici parola, kullanıcı ilk girişte değiştirmeli
        };

        await cognito.adminCreateUser(cognitoParams).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'User Registration successful' })
        };
    } catch (error) {
        console.error("Error: ", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Could not register user', error: error.message })
        };
    }
};

const handleProtected = async (event) => {
    try {
        // Authorization header'ından token'ı al
        const token = event.headers.Authorization || event.headers.authorization;

        if (!token) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'No token provided' })
            };
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        // Kullanıcı rolünü kontrol et
        const userRole = decoded.role;
        if (userRole !== 'admin') {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'Access denied' })
            };
        }
        // Yetkili kullanıcıya erişim izni ver
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Access granted', user: decoded })
        };
        
    } catch (error) {
        console.error('Authorization error: ', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Authorization failed', error: error.message })
        };
    }
};


module.exports = { handleLogin ,handleRegister , handleProtected};
