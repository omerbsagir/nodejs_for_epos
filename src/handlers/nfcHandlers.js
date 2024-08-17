const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();



module.exports = { handleInitiate, handleVerify };