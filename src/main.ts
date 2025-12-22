import './scss/styles.scss';

import {ProductСatalog} from './components/models/ProductСatalog';
import {Buyer} from './components/models/Buyer';
import {BoxWithBuy} from './components/models/BoxWithBuy';

import {apiProducts} from './utils/data';

const productsModel = new ProductСatalog();
productsModel.allProduct(apiProducts.items); 

console.log('Массив товаров из каталога: ', productsModel.allProduct()); 