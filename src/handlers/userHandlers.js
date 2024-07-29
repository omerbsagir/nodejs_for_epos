const handleGetUser = async (event) => {
    const userId = event.queryStringParameters.userId;
    // Kullanıcı bilgilerini getirme iş mantığı
    return { message: `User details for ${userId}` };
};

module.exports = { handleGetUser };
