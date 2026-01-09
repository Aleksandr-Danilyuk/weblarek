import './scss/styles.scss';

import {ProductСatalog} from './components/models/ProductСatalog';
import {Buyer} from './components/models/Buyer';
import {BoxWithBuy} from './components/models/BoxWithBuy';
import {CommunicationLayer} from './components/communication/CommunicationLayer';
import {Api} from './components/base/Api';

import {apiProducts} from './utils/data';

import {API_URL} from './utils/constants';

const productsModel = new ProductСatalog(); // Создание экземпляра ProductСatalog
productsModel.allProduct = apiProducts.items; 
console.log('Массив товаров из каталога: ', productsModel.allProduct); 

const buyerModel = new Buyer(); // Создание экземпляра Buyer
buyerModel.payment =  'card';
console.log(buyerModel.payment);


const boxWithBuyModel = new BoxWithBuy(); // Создание экземпляра BoxWithBuy
console.log(`Товары выбранные покупателоем (если не выбраны то undefined): ${boxWithBuyModel.selectedProduct}`);

const pingCommunicationLayer = new Api(API_URL); //Создание экземпляра CommunicationLayer
const pongCommunicationLayer  = new CommunicationLayer(pingCommunicationLayer); // Создание экземпляра CommunicationLayer

pongCommunicationLayer.getProduct().then(product => {
    console.log(`Получаем список товаров с сервера методом Get ${product}`);
}).catch(error => {
    console.log(`Ошибка получения списока товаров с сервера методом Get ${error}`);
});

