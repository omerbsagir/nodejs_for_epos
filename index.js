const authHandlers = require('./src/handlers/authHandlers');
const paymentHandlers = require('./src/handlers/paymentHandlers');
const userHandlers = require('./src/handlers/userHandlers');
const activationHandlers = require('./src/handlers/activationHandlers');
const walletHandlers = require('./src/handlers/walletHandlers');
const nfcHandlers = require('./src/handlers/nfcHandlers');
const dbHandlers = require('./src/handlers/dbHandlers');

exports.handler = async (event) => {
    try {
        const path = event.resource; 
        const method = event.httpMethod; 

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
            case '/getWallet':
                if (method === 'POST') {
                    responseMessage = await dbHandlers.handleGetWallet(event);
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

            case '/createTransaction':
                if (method === 'POST') {
                    responseMessage = await paymentHandlers.handleCreateTransaction(event);
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

            case '/updateWallet':
                if (method === 'POST') {
                    responseMessage = await walletHandlers.handleUpdateWallet(event);
                    statusCode = 200;
                } else {
                    responseMessage = 'Method Not Allowed';
                    statusCode = 405;
                }
                break;     
            case '/createWallet':
                if (method === 'POST') {
                    responseMessage = await walletHandlers.createWallet(event);
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
