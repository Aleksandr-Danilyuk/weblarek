import './scss/styles.scss';

import {ProductsСatalog} from './components/models/ProductСatalog';
import {Buyer} from './components/models/Buyer';
import {BoxWithBuy} from './components/models/BoxWithBuy';
import {CommunicationLayer} from './components/communication/CommunicationLayer';
import {Api} from './components/base/Api';

import {apiProducts} from './utils/data';

import {API_URL} from './utils/constants';

// Создание экземпляра ProductsСatalog
const productsModel = new ProductsСatalog(); 
productsModel.allProduct = apiProducts.items; 

console.log('Экземпляр ProductСatalog'); 
console.log('Массив товаров из каталога: ', productsModel.allProduct); 

const testProduct = {
    category : "софт-скил",
    description : "Если планируете решать задачи в тренажёре, берите два.",
    id : "854cef69-976d-4c2a-a18c-2aa45046c390",
    image : "/5_Dots.svg",
    price : 750,
    title : "+1 час в сутках",
};
productsModel.selectedProduct = testProduct;
console.log('Выбранный товар из каталога: ', productsModel.selectedProduct); 
console.log('Поиск по ID товара из каталога: ', productsModel.getProduct("b06cde61-912f-4663-9751-09956c0eed67")); 




// Создание экземпляра Buyer
const buyerModel = new Buyer();

console.log('Экземпляр Buyer'); 
console.log(`Проверка не заполненного поля оплаты: ${buyerModel.validPayment()}`);
console.log(`Проверка не заполненного поля адреса: ${buyerModel.validAddress()}`);
console.log(`Проверка не заполненного поля почты: ${buyerModel.validEmail()}`);
console.log(`Проверка не заполненного поля телефона: ${buyerModel.validPhone()}`);

buyerModel.payment =  'card';
buyerModel.address = 'Москва, улица Льва Толстого, 16';
buyerModel.email = 'email@yandex.ru';
buyerModel.phone = '89008001010';

 // Валидация полей экземпляра Buyer
console.log(`Проверка заполненного поля оплаты: ${buyerModel.validPayment()}`);
console.log(buyerModel.payment);
console.log(`Проверка заполненного поля адреса: ${buyerModel.validAddress()}`);
console.log(buyerModel.address);
console.log(`Проверка заполненного поля почты: ${buyerModel.validEmail()}`);
console.log(buyerModel.email);
console.log(`Проверка заполненного поля телефона: ${buyerModel.validPhone()}`);
console.log(buyerModel.phone);
console.log('Получение значений экземпляра Buyer', buyerModel.getDataBuyer());

// Создание экземпляра BoxWithBuy
const boxWithBuyModel = new BoxWithBuy(); 
console.log('Экземпляр BoxWithBuy'); 
console.log('Товары выбранные покупателоем (если не выбраны то массив пустой): ', boxWithBuyModel.selectedProducts);
boxWithBuyModel.addProduct(testProduct);
console.log('Добавляем товар: ', boxWithBuyModel.selectedProducts);
console.log('Получение стоимости всех товаров в корзине: ', boxWithBuyModel.costSelectedProducts());
console.log('Получение количества товаров в корзине: ', boxWithBuyModel.numberSelectedProducts());
console.log('Проверка товара в корзине покупателя: ', boxWithBuyModel.checkProduct("854cef69-976d-4c2a-a18c-2aa45046c390"));
boxWithBuyModel.deleteProduct(testProduct);
console.log('Удаляем товар: ', boxWithBuyModel.selectedProducts);

//Создание экземпляра CommunicationLayer
const pingCommunicationLayer = new Api(API_URL); 
const pongCommunicationLayer  = new CommunicationLayer(pingCommunicationLayer);

console.log('Экземпляр CommunicationLayer'); 
pongCommunicationLayer.getProduct().then(product => {
    console.log('Получаем список товаров с сервера методом Get ', product);
}).catch(error => {
    console.log('Ошибка получения списока товаров с сервера методом Get ', error);
});

