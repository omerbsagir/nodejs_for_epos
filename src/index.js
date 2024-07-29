const authHandlers = require('./handlers/authHandlers');
const paymentHandlers = require('./handlers/paymentHandlers');
const userHandlers = require('./handlers/userHandlers');

exports.handler = async (event) => {
    try {
        const path = event.resource; // API Gateway'den gelen yol bilgisi
        const method = event.httpMethod; // API Gateway'den gelen HTTP metodu

        let responseMessage;
        let statusCode;

        switch (path) {
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

            case '/payment':
                if (method === 'POST') {
                    responseMessage = await paymentHandlers.handlePayment(event);
                    statusCode = 200;
                } else {
                    responseMessage = 'Method Not Allowed';
                    statusCode = 405;
                }
                break;

            case '/user':
                if (method === 'GET') {
                    responseMessage = await userHandlers.handleGetUser(event);
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
