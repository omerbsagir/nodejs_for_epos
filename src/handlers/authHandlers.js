const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();

const JWT_SECRET = process.env.JWT_SECRET; 
const JWT_EXPIRES_IN = '1h'; 

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
    const { email, phone, password } = JSON.parse(event.body);

    const userId = uuidv4(); 
    const hashedPassword = await bcrypt.hash(password, 10); 
    const createdAt = new Date().toISOString();
    const role = 'admin';

    const params = {
        TableName: process.env.USERS_TABLE, 
        Item: {
            userId,
            email,
            phone,
            password: hashedPassword,
            createdAt,
            role
        }
    };

    try {
        
        
        const cognitoParams = {
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Username: email,
            UserAttributes: [
                { Name: 'email', Value: email },
                { Name: 'phone_number', Value: phone } ,
                { Name: 'custom:role', Value: role}
            ],
            MessageAction: 'SUPPRESS', 
            TemporaryPassword: password 
        };

        await cognito.adminCreateUser(cognitoParams).promise();
        await dynamoDb.put(params).promise();


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
    const { email, phone, password,adminId } = JSON.parse(event.body);

    const userId = uuidv4(); 
    const hashedPassword = await bcrypt.hash(password, 10); 
    const createdAt = new Date().toISOString();
    const role = 'user';


    const checkParams = {
        TableName: process.env.USERS_TABLE,
        FilterExpression: 'adminId = :adminId',
        ExpressionAttributeValues: {
            ':adminId': adminId
        }
    };


    const params = {
        TableName: process.env.USERS_TABLE,
        Item: {
            userId,
            email,
            phone,
            password: hashedPassword, 
            createdAt,
            role,
            adminId
        }
    };

    try {
        
        const checkResult = dynamoDb.scan(checkParams).promise();
        const lengthCurrentOfUsers = (await checkResult).Items.length;
        
        if(lengthCurrentOfUsers<5) {
            const cognitoParams = {
                UserPoolId: process.env.COGNITO_USER_POOL_ID,
                Username: email,
                UserAttributes: [
                    { Name: 'email', Value: email },
                    { Name: 'phone_number', Value: phone } ,
                    { Name: 'custom:role', Value: role}
                ],
                MessageAction: 'SUPPRESS', 
                TemporaryPassword: password 
            };
    
            await cognito.adminCreateUser(cognitoParams).promise();
            await dynamoDb.put(params).promise();
    
            return {
                statusCode: 201,
                body: JSON.stringify({ message: 'User Registration successful' })
            };
        }else{
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Users are above the limit', error: error.message })
            };
        }
        
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
        
        const token = event.headers.Authorization || event.headers.authorization;

        if (!token) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'No token provided' })
            };
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        
        const userRole = decoded.role;
        if (userRole !== 'admin') {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'Access denied' })
            };
        }
        
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

const handleValidateToken = async (event) => {
    const { token } = JSON.parse(event.body);

    try {
        if (!token) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Token is required' })
            };
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Token is valid', decoded })
        };
    } catch (error) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Invalid token', error: error.message })
        };
    }
};

module.exports = { handleLogin ,handleRegister ,handleRegisterForUserRole, handleProtected,handleValidateToken};
