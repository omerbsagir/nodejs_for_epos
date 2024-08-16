const authHandlers = require('./src/handlers/authHandlers');
const paymentHandlers = require('./src/handlers/paymentHandlers');
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
            case '/getActivation':
                if (method === 'POST') {
                    responseMessage = await dbHandlers.handleGetActivation(event);
                    statusCode = 200;
                } else {
                    responseMessage = 'Method Not Allowed';
                    statusCode = 405;
                }
                break;    
            case '/deleteActivation':
                if (method === 'POST') {
                    responseMessage = await dbHandlers.deleteActivation(event);
                    statusCode = 200;
                } else {
                    responseMessage = 'Method Not Allowed';
                    statusCode = 405;
                }
                break;      
            case '/deleteCompany':
                if (method === 'POST') {
                    responseMessage = await dbHandlers.deleteCompany(event);
                    statusCode = 200;
                } else {
                    responseMessage = 'Method Not Allowed';
                    statusCode = 405;
                }
                break; 
            case '/deleteUser':
                if (method === 'POST') {
                    responseMessage = await dbHandlers.deleteUser(event);
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
            case '/getTransactions':
                if (method === 'POST') {
                    responseMessage = await paymentHandlers.handleGetTransactions(event);
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
            case '/deleteWallet':
                if (method === 'POST') {
                    responseMessage = await walletHandlers.deleteWallet(event);
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
