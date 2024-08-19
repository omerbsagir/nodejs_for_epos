# E-POS (Backend Kodu)



Bu proje, **AWS altyapısını kullanarak (Lambda, API Gateway, Cognito, DynamoDB)** geliştirilmiş bir **Flutter** (https://github.com/omerbsagir/flutter-sanalpos) uygulamasının backend kodlarını içerir. Backend kodları **Node.js** ile yazılmış ve AWS Lambda fonksiyonu olarak yüklenmiştir.

## Kullanılan AWS Teknolojileri

- **AWS Lambda:** Sunucusuz mimari ile kodların çalıştırıldığı ortam.
- **AWS API Gateway:** RESTful API endpoint'lerinin yönetildiği servis.
- **AWS Cognito:** Kullanıcı doğrulama ve yetkilendirme işlemleri.
- **AWS DynamoDB:** NoSQL veritabanı hizmeti.


## Kurulum

1. **Node.js** ve **npm** yüklü olduğundan emin olun.
2. Bu repository'yi klonlayın:
    ```bash
    git clone https://github.com/kullaniciadi/proje-adi.git
    ```
3. Proje dizinine gidin:
    ```bash
    cd proje-adi
    ```
4. Gerekli bağımlılıkları yükleyin:
    ```bash
    npm install
    ```
5. AWS CLI yapılandırmasını yapın ve gerekli erişim izinlerine sahip olduğunuzdan emin olun.

## AWS Lambda'ya Yükleme ve Yapılandırma

1. **AWS Lambda** üzerinde yeni bir fonksiyon oluşturun.
2. `index.js` dosyasının kök dizinde olduğundan emin olduktan sonra projeyi zipleyin.
3. Zip dosyasını Lambda fonksiyonunuza yükleyin.
4. Lambda fonksiyonunuza uygun politika izinlerini eklediğinizden emin olun.
5. Lambda fonksiyonunuzda gerekli **çevre değişkenlerini (environment variables)** yapılandırın. Örneğin:
   
    - `ACTIVATION_TABLE`
    - `COGNITO_CLIENT_ID`
    - `COGNITO_USER_POOL_ID`
    - `COMPANIES_TABLE`
    - `JWT_SECRET`
    - `TRANSACTIONS_TABLE`
    - `USERS_TABLE`
    - `WALLETS_TABLE`
      
7. Lambda fonksiyonunuzun zaman aşımı (timeout) ve bellek boyutunu (memory size) ihtiyaca göre yapılandırın.

## API Gateway Yapılandırması

1. **API Gateway** üzerinde yeni bir API oluşturun.
2. Lambda fonksiyonunuzdaki endpointleri oluşturun.
3. API Gateway üzerinde gerekli izinleri ve API anahtarlarını yapılandırın.

## Cognito Yapılandırması

1. **Cognito User Pool** oluşturun.
2. API Gateway ve Lambda fonksiyonları ile entegrasyon sağlayın.
3. Kullanıcı doğrulama ve yetkilendirme işlemlerini yapılandırın.

## DynamoDB Yapılandırması

1. **DynamoDB** tablosu oluşturun.
2. Lambda fonksiyonları üzerinden DynamoDB erişimini sağlayın.

## Kullanım

Uygulamanızda AWS servisleriyle entegrasyon sağlamak için yukarıdaki adımları takip edin. Gerekli API endpoint'lerini ve kullanıcı doğrulama süreçlerini tanımladıktan sonra uygulamanız backend ile tam entegrasyon sağlayacaktır.

## Katkıda Bulunma

Katkıda bulunmak isterseniz, lütfen bir `pull request` gönderin veya bir `issue` açın. Her türlü geri bildirime açığız!

---

İşte README dosyasının İngilizce çevirisi:

---




# E-POS (Backend Code)




This project contains the backend code for a **Flutter** (https://github.com/omerbsagir/flutter-sanalpos) application developed using **AWS infrastructure (Lambda, API Gateway, Cognito, DynamoDB)**. The backend code is written in **Node.js** and deployed as an AWS Lambda function.

## AWS Technologies Used

- **AWS Lambda:** Serverless environment for running the code.
- **AWS API Gateway:** Service for managing RESTful API endpoints.
- **AWS Cognito:** User authentication and authorization.
- **AWS DynamoDB:** NoSQL database service.

## Installation

1. Make sure you have **Node.js** and **npm** installed.
2. Clone this repository:
    ```bash
    git clone https://github.com/username/project-name.git
    ```
3. Navigate to the project directory:
    ```bash
    cd project-name
    ```
4. Install the required dependencies:
    ```bash
    npm install
    ```
5. Configure AWS CLI and ensure you have the necessary access permissions.

## Deploying and Configuring AWS Lambda

1. Create a new function in **AWS Lambda**.
2. Ensure `index.js` is in the root directory, then zip the project.
3. Upload the zip file to your Lambda function.
4. Make sure to add the appropriate policy permissions to your Lambda function.
5. Configure the required **environment variables** in your Lambda function. For example:

    - `ACTIVATION_TABLE`
    - `COGNITO_CLIENT_ID`
    - `COGNITO_USER_POOL_ID`
    - `COMPANIES_TABLE`
    - `JWT_SECRET`
    - `TRANSACTIONS_TABLE`
    - `USERS_TABLE`
    - `WALLETS_TABLE`

7. Adjust the timeout and memory size of your Lambda function as needed.

## API Gateway Configuration

1. Create a new API in **API Gateway**.
2. Set up the endpoints in your Lambda function.
3. Configure the necessary permissions and API keys in API Gateway.

## Cognito Configuration

1. Create a **Cognito User Pool**.
2. Integrate with API Gateway and Lambda functions.
3. Configure user authentication and authorization.

## DynamoDB Configuration

1. Create a **DynamoDB** table.
2. Provide access to DynamoDB through Lambda functions.

## Usage

Follow the above steps to integrate AWS services into your application. Once you define the necessary API endpoints and user authentication processes, your application will be fully integrated with the backend.

## Contributing

If you wish to contribute, please submit a `pull request` or open an `issue`. All feedback is welcome!
