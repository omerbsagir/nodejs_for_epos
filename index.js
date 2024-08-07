const authHandlers = require('./src/handlers/authHandlers');
const paymentHandlers = require('./src/handlers/paymentHandlers');
const userHandlers = require('./src/handlers/userHandlers');
const activationHandlers = require('./src/handlers/activationHandlers');
const walletHandlers = require('./src/handlers/walletHandlers');
const nfcHandlers = require('./src/handlers/nfcHandlers');
const dbHandlers = require('./src/handlers/dbHandlers');

exports.handler = async (event) => {
    try {
        const path = event.resource; // API Gateway'den gelen yol bilgisi
        const method = event.httpMethod; // API Gateway'den gelen HTTP metodu

        let responseMessage;
        let statusCode;

        switch (path) {

            // auth

            case '/login':
                if (method === 'POST') {
                    responseMessage = await authHandlers.handleLogin(event);
                    statusCode = 200;
                } else {
                    responseMessage = 'Method Not Allowed';
                    statusCode = 405;
                }
                break;

            case '/register':
                if (method === 'POST') {
                    responseMessage = await authHandlers.handleRegister(event);
                    statusCode = 200;
                } else {
                    responseMessage = 'Method Not Allowed';
                    statusCode = 405;
                }
                break;
            case '/registerNewUser':
                if (method === 'POST') {
                    responseMessage = await authHandlers.handleRegisterForUserRole(event);
                    statusCode = 200;
                } else {
                    responseMessage = 'Method Not Allowed';
                    statusCode = 405;
                }
                break;
            case '/protected':
                if (method === 'POST') {
                    responseMessage = await authHandlers.handleProtected(event);
                    statusCode = 200;
                } else {
                    responseMessage = 'Method Not Allowed';
                    statusCode = 405;
                }
                break;    
            case '/validateToken':
                if (method === 'POST') {
                    responseMessage = await authHandlers.handleValidateToken(event);
                    statusCode = 200;
                } else {
                    responseMessage = 'Method Not Allowed';
                    statusCode = 405;
                }
                break;        
            
            //calisanlar
    
            case '/getUser':
                if (method === 'POST') {
                    responseMessage = await dbHandlers.handleGetUser(event);
                    statusCode = 200;
                } else {
                    responseMessage = 'Method Not Allowed';
                    statusCode = 405;
                }
                break;
            case '/getUsersAdmin':
                if (method === 'POST') {
                    responseMessage = await dbHandlers.handleGetUsersAdmin(event);
                    statusCode = 200;
                } else {
                    responseMessage = 'Method Not Allowed';
                    statusCode = 405;
                }
                break;
            case '/getCompany':
                if (method === 'POST') {
                    responseMessage = await dbHandlers.handleGetCompany(event);
                    statusCode = 200;
                } else {
                    responseMessage = 'Method Not Allowed';
                    statusCode = 405;
                }
                break;
            //nfc

            case '/verify':
                if (method === 'POST') {
                    responseMessage = await nfcHandlers.handleVerify(event);
                    statusCode = 200;
                } else {
                    responseMessage = 'Method Not Allowed';
                    statusCode = 405;
                }
                break;

            case '/initiate':
                if (method === 'GET') {
                    responseMessage = await nfcHandlers.handleInitiate(event);
                    statusCode = 200;
                } else {
                    responseMessage = 'Method Not Allowed';
                    statusCode = 405;
                }
                break;


            //payment

            case '/charge':
                if (method === 'GET') {
                    responseMessage = await paymentHandlersHandlers.handleCharge(event);
                    statusCode = 200;
                } else {
                    responseMessage = 'Method Not Allowed';
                    statusCode = 405;
                }
                break;    
                case '/refund':
                    if (method === 'GET') {
                        responseMessage = await paymentHandlersHandlers.handleRefund(event);
                        statusCode = 200;
                    } else {
                        responseMessage = 'Method Not Allowed';
                        statusCode = 405;
                    }
                    break;
                case '/transaction-id':
                if (method === 'GET') {
                    responseMessage = await paymentHandlersHandlers.returnTransactionId(event);
                    statusCode = 200;
                } else {
                    responseMessage = 'Method Not Allowed';
                    statusCode = 405;
                }
                break;    
                
            // activation
            case '/createActivation':
                if (method === 'POST') {
                    responseMessage = await dbHandlers.createActivation(event);
                    statusCode = 200;
                } else {
                    responseMessage = 'Method Not Allowed';
                    statusCode = 405;
                }
                break;    
            case '/company-id':
                if (method === 'GET') {
                    responseMessage = await activationHandlers.returnCompanyId(event);
                    statusCode = 200;
                } else {
                    responseMessage = 'Method Not Allowed';
                    statusCode = 405;
                }
                break;
            case '/checkActiveStatus':
                if (method === 'POST') {
                    responseMessage = await dbHandlers.checkActiveStatus(event);
                    statusCode = 200;
                } else {
                    responseMessage = 'Method Not Allowed';
                    statusCode = 405;
                }
                break;  
            case '/createCompany':
                if (method === 'POST') {
                    responseMessage = await dbHandlers.createCompany(event);
                    statusCode = 200;
                } else {
                    responseMessage = 'Method Not Allowed';
                    statusCode = 405;
                }
                break;           
            
            //wallet

            case '/update-wallet':
                if (method === 'GET') {
                    responseMessage = await walletHandlers.handleUpdateWallet(event);
                    statusCode = 200;
                } else {
                    responseMessage = 'Method Not Allowed';
                    statusCode = 405;
                }
                break;        
            default:
                responseMessage = 'Not Found';
                statusCode = 404;
                break;
        }

        return {
            statusCode: statusCode,
            body: JSON.stringify(responseMessage),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }
};
