const handlePayment = async (event) => {
    const { cardNumber, amount } = JSON.parse(event.body);
    // Ödeme iş mantığı
    return { message: 'Payment processed successfully' };
};

module.exports = { handlePayment };
