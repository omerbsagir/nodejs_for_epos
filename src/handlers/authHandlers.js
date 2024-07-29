const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

const cognito = new AWS.CognitoIdentityServiceProvider();

const handleLogin = async (event) => {
    const { email, password } = JSON.parse(event.body);
    // Login iş mantığı
    return { message: 'Login successful' };
};

const handleRegister = async (event) => {
    const { name, email, phone, password } = JSON.parse(event.body);
    // Register iş mantığı
    return { message: 'Registration successful' };
};

module.exports = { handleLogin, handleRegister };
