const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

const handleInitiate = async (event) => {
    // iş mantığı
    return { message: 'Initiate Successful' };
};

const handleVerify = async (event) => {
    
    // iş mantığı
    return { message: 'Verify Successful' };
};

module.exports = { handleInitiate, handleVerify };