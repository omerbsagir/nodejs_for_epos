const authHandlers = require('./handlers/authHandlers');
const paymentHandlers = require('./handlers/paymentHandlers');
const userHandlers = require('./handlers/userHandlers');
const activationHandlers = require('./handlers/activationHandlers');
const walletHandlers = require('./handlers/walletHandlers');
const walletHandlers = require('./handlers/nfcHandlers');

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
            case '/logout':
                if (method === 'POST') {
                    responseMessage = await authHandlers.handleLogout(event);
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
            case '/activate':
                if (method === 'GET') {
                    responseMessage = await activationHandlersrHandlers.handleActivate(event);
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
