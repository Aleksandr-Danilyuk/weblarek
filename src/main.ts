import './scss/styles.scss';

import {ProductСatalog} from './components/models/ProductСatalog';
import {Buyer} from './components/models/Buyer';
import {BoxWithBuy} from './components/models/BoxWithBuy';
import {CommunicationLayer} from './components/communication/CommunicationLayer';

import {apiProducts} from './utils/data';

const productsModel = new ProductСatalog(); // Создание экземпляра ProductСatalog
productsModel.allProduct = apiProducts.items; 
console.log('Массив товаров из каталога: ', productsModel.allProduct); 

const buyerModel = new Buyer(); // Создание экземпляра Buyer
buyerModel.payment =  'card';
console.log(buyerModel.payment);


const boxWithBuyModel = new BoxWithBuy(); // Создание экземпляра BoxWithBuy
console.log(`Товары выбранные покупателоем (если не выбраны то undefined): ${boxWithBuyModel.selectedProduct}`);

const pingCommunicationLayer = new CommunicationLayer(); // Создание экземпляра CommunicationLayer
const pongCommunicationLayer  = pingCommunicationLayer.get;
console.log(`Получаем список товаров с сервера методом Get " ${pongCommunicationLayer}`)

