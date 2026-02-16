import './scss/styles.scss';

import {ProductsСatalog} from './components/models/ProductСatalog';
import {Buyer} from './components/models/Buyer';
import {BoxWithBuy} from './components/models/BoxWithBuy';
import {CommunicationLayer} from './components/communication/CommunicationLayer';
import {Api} from './components/base/Api';
import {EventEmitter} from './components/base/Events';
import {ensureElement} from './utils/utils';

//import {apiProducts} from './utils/data';

import {API_URL} from './utils/constants';
import {CDN_URL} from './utils/constants';

// 9 спринт import Header
import {Header} from './components/view/Header';
import {Modal} from './components/view/Modal';
import {Gallery} from './components/view/Gallery';
import { CardCatalog } from './components/view/Card/CardCatalog';
import { cloneTemplate } from './utils/utils';


const actions = {
    'basket:open': 'событие нажатие копки корзины',
    'catalog:changed' : 'Слой данных Каталог изменён',
    'card:select' : 'Выбор карточки для отображения',
    'modal:close': 'Пока не назначено',
    'modal:changed': 'Содержимое Модального окна изменено'
};

const HeaderHTML = document.querySelector('.header') as HTMLElement;
const galleryHTML = document.querySelector('.gallery') as HTMLElement;
const modalHTML = ensureElement<HTMLElement>('#modal-container');

// Создание экземпляров Base
const events = new EventEmitter;
const urlApi = new Api(API_URL);

// Создание экземпляров слоя Коммуникации
const dataCommunicationLayer  = new CommunicationLayer(urlApi); // Создание экземпляра CommunicationLayer

// Создание экземпляров слоя модели Данных
const buyerModel = new Buyer(); // Создание экземпляра Покупателя
const boxWithBuyModel = new BoxWithBuy(); // Создание экземпляра Корзины
const productsModel = new ProductsСatalog(events); //  // Создание экземпляра Каталог продуктов

// Создание экземпляров слоя Отображения
const headerView = new Header(events, HeaderHTML); // Создание объекта Шапки
const galleryModel = new Gallery(events, galleryHTML); // Создание объекта Галереи
const modalView = new Modal(events, modalHTML);

// Заполнения объектов модели Данных
// Получаем список товаров с сервера методом Get
dataCommunicationLayer.getProduct().then(products => {
    const newProductsWithImage = products.items.map(product => ({  // Пересобираем данные товаров, добавляем полные пути к изображениям
        ...product, 
        image: `${CDN_URL}${product.image.replace(/\.svg$/i, '.png')}`
    }));
    
    productsModel.allProduct = newProductsWithImage; // Запоминаем данные в модель данных Каталог продуктов
}).catch(error => {
    console.log('Ошибка получения списока товаров с сервера методом Get ', error);
});

// Обработка событий

// Событие заполнения Галереи товарами
// Передаём в созданный экземпляр функцию 
events.on('catalog:changed', () => {
    const itemCards = productsModel.allProduct.map((item) => {
        const CardCatalogTemplate = cloneTemplate<HTMLElement>('#card-catalog');//(document.getElementById('card-catalog'));
        const card = new CardCatalog(CardCatalogTemplate, {
            onClick: () => {
                events.emit('card:select', item);
                productsModel.selectedProduct = item; // Записано значение Выбранной карточки в модель дпннвх
            },
        });
        return card.render(item);
    });

    galleryModel.render({ catalog: itemCards }) //gallery.replaceChild({ catalog: itemCards.filter(card => card !== null) });
}); 

// Событие открытия корзины headerView слоя View      +
events.on('basket:open', () => {    // Событие нажатия на кнопку корзины в шапке
	console.log("Сработало событие нажатие копки корзины")
    headerView.counter = 1;     // Render срабатывает автоматически
    headerView.render({counter:2}); // Перпедаём в Render обьект для отрисовки
});  

// Событие Открытие карточки
events.on('card:select', () => {    // Событие нажатия на кнопку корзины в шапке
	console.log(`Сработало событие выбора карточки галареи`);
    headerView.counter = 1;
    // = productsModel.selectedProduct;
    // modalView.content = ;
    modalHTML.classList.add('modal_active');
})  



/*
.allProduct
.selectedProduct
.getProduct

console.log('Экземпляр ProductСatalog'); 
productsModel.allProduct = apiProducts.items; 
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

// Тестирование экземпляра Buyer

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

// Тестирование Экземпляра Корзина
console.log('Экземпляр BoxWithBuy'); 
console.log('Товары выбранные покупателоем (если не выбраны то массив пустой): ', boxWithBuyModel.selectedProducts);
//boxWithBuyModel.addProduct(testProduct);
console.log('Добавляем товар: ', boxWithBuyModel.selectedProducts);
console.log('Получение стоимости всех товаров в корзине: ', boxWithBuyModel.costSelectedProducts());
console.log('Получение количества товаров в корзине: ', boxWithBuyModel.numberSelectedProducts());
console.log('Проверка товара в корзине покупателя: ', boxWithBuyModel.checkProduct("854cef69-976d-4c2a-a18c-2aa45046c390"));
//boxWithBuyModel.deleteProduct(testProduct);
console.log('Удаляем товар: ', boxWithBuyModel.selectedProducts);
*/

/*
inputElement.addEventListener('input', (event: Event) => {
const inputValue = (event.target as HTMLInputElement).value;
console.log('Input value:', inputValue);};
const CardCatalogTemplate = document.getElementById('card-catalog');
*/

