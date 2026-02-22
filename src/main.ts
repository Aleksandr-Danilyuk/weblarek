import './scss/styles.scss';

import {ProductsCatalog} from './components/models/ProductCatalog';
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
import {CardCatalog} from './components/view/Card/CardCatalog';
import {CardPreview} from './components/view/Card/CardPreview';
import {CardBasket} from './components/view/Card/CardBasket';
import {cloneTemplate} from './utils/utils';
import {OrderSuccess} from './components/view/orderSuccess';
import {Basket} from './components/view/Basket';


const actions = {
    'basket:click': 'событие нажатие копки корзины',
    'catalog:changed' : 'Слой данных Каталог изменён',
    'card:select' : 'Запись карточки для отображения Model' ,
    'modal:close': 'Пока не назначено',
    'modal:changed': 'Содержимое Модального окна изменено',
    'product:add': 'Товар добавлен в корзину',
    'order_success:close': 'Событие в модалоьном окне успешного заказа - не назначено',
    'basket:change': 'Слой данных корзины изменён',
    'buyer_data:changed': 'изменение данных покупателя',
    'buyer:clean': 'обнуление данных покупателя',
    'buyer_payment': 'Изменён способ оплаты заказа',
    'buyer_address': 'Изменён адрес заказа',
    'buyer_email': 'Изменён электронный адрес покупателя',
    'buyer_phone': 'Изменён телефонный номер покупателя',
    'form:order': 'Нажата кнопка перехода ко второй форме оформления заказа',
    'form:complete': 'Нажата кнопка оформления заказа',
    'cardBasket:click_delete': 'Нажатие удаления карточки из корзины',
    'cardPreview:click': 'Пока не назначено',
    'card:click': 'Событие нажатие копки карточки в Галереи View'
};

const HeaderHTML = document.querySelector('.header') as HTMLElement;
const galleryHTML = document.querySelector('.gallery') as HTMLElement;
const modalHTML = ensureElement<HTMLElement>('#modal-container');
const cardPreviewlHTML = cloneTemplate('#card-preview');
const orderSuccessHTML = cloneTemplate('#success');
const basketHTML = cloneTemplate('#basket');

// Создание экземпляров Base
const events = new EventEmitter;
const urlApi = new Api(API_URL);

// Создание экземпляров слоя Коммуникации
const dataCommunicationLayer  = new CommunicationLayer(urlApi); // Создание экземпляра CommunicationLayer

// Создание экземпляров слоя модели Данных
const buyerModel = new Buyer(events); // Создание экземпляра Покупателя
const boxWithBuyModel = new BoxWithBuy(events); // Создание экземпляра Корзины
const productsModel = new ProductsCatalog(events); //  // Создание экземпляра Каталог продуктов

// Создание экземпляров слоя Отображения
const modalView = new Modal(events, modalHTML); // Создание объекта Модальное Окно
const headerView = new Header(events, HeaderHTML); // Создание объекта Шапки
const galleryModel = new Gallery(events, galleryHTML); // Создание объекта Галереи

// Создание экземпляров Модальных окон слоя Отображения
const basketView = new Basket(events, basketHTML); // Создание объекта корзины слоя отображения
const orderSuccessView = new OrderSuccess(events, orderSuccessHTML); // Создание объекта Галереи слоя отображения


/*
const testProduct = {
    category : "софт-скил",
    description : "Если планируете решать задачи в тренажёре, берите два.",
    id : "854cef69-976d-4c2a-a18c-2aa45046c390",
    image : "/5_Dots.svg",
    price : 750,
    title : "+1 час в сутках",
};
*/

// Заполнения объектов модели Данных
// Получаем список товаров с сервера методом Get
dataCommunicationLayer.getProduct().then(products => {
    const newProductsWithImage = products.items.map(product => ({  // Пересобираем данные товаров, добавляем полные пути к изображениям
        ...product, 
        image: `${CDN_URL}${product.image.replace(/\.svg$/i, '.png')}`
    }));
    
    productsModel.allProduct = newProductsWithImage; // Запоминаем данные в модель данных Каталог продуктов
}).catch(error => {
    console.log('Ошибка получения списока товаров от сервера методом Get ', error);
});

// Обработка событий
// Передаём в созданный экземпляр функцию 
//orderSuccessView.description= 1;

// Закрываем модальное окно если клик был сделан вне модального окна и его дочерних элементов
document.addEventListener('click', (event) => {
    if (event.target === modalHTML) {
        modalHTML.classList.remove('modal_active');
        
    };
});


// Событие заполнения Галереи товарами      +
events.on('catalog:changed', () => {
    const itemCards = productsModel.allProduct.map((item) => {
        const CardCatalogTemplate = cloneTemplate<HTMLElement>('#card-catalog');//(document.getElementById('card-catalog'));
        const card = new CardCatalog(events, CardCatalogTemplate, {
            onClick: () => {
                events.emit('card:click');
                productsModel.selectedProduct = item; // Присваиваем значение Выбранной карточки в модель данных
            },
        });
        return card.render(item);
    });

    galleryModel.render({ catalog: itemCards }) //gallery.replaceChild({ catalog: itemCards.filter(card => card !== null) });
}); 

// Событие нажатие на кнопке  слоя View      +
const modalCardPreview = new CardPreview(events, cardPreviewlHTML, {
    onClick: () => {
        //console.log('Presenter добавляет карточку в корзину');
        if (productsModel.selectedProduct && !boxWithBuyModel.checkProduct(productsModel.selectedProduct?.id)) {
                boxWithBuyModel.addProduct(productsModel.selectedProduct);
                console.log('Товар добавлен в корзину');
                modalCardPreview.textCardButton = 'Удалить из корзины';
        } else if (productsModel.selectedProduct) {
                boxWithBuyModel.deleteProduct(productsModel.selectedProduct);
                console.log('Товар удалён из корзины');
                modalCardPreview.textCardButton = 'Купить';
        };
    }
});

events.on('card:click', () => {    // Событие нажатия на кнопку корзины в шапке
	console.log("Сработало событие нажатие Карточки в Галерее")
    modalView.content = cardPreviewlHTML;
    modalView.show();
});  

events.on('card:select', () => {    // Событие нажатия на кнопку корзины в шапке
    console.log('Сохранение товара для подробного отображения card:select Класс ProductsCatalog');
    if (productsModel.selectedProduct?.price === null) {
        modalCardPreview.disabledButton();
    } else {
        modalCardPreview.enabledButton();
    };
    if (!boxWithBuyModel.checkProduct(productsModel.selectedProduct!.id)) {
        modalCardPreview.textCardButton = 'Купить';
        console.log('Отрисовываем кнопку Купить');
    };

    modalCardPreview.render({
        title: productsModel.selectedProduct?.title, 
        price: productsModel.selectedProduct?.price, 
        description: productsModel.selectedProduct?.description, 
        image: productsModel.selectedProduct?.image, 
        category: productsModel.selectedProduct?.category
    });
});  

// Событие открытия корзины headerView слоя View      +
events.on('basket:click', () => {    // Событие нажатия на кнопку корзины в шапке
	console.log("Сработало событие нажатие копки корзины !")
    modalView.content = basketHTML; 
    modalView.show();
});  


// Событие Добавление товара в корзину +
events.on('basket:changed', () => {   
    headerView.render({counter:boxWithBuyModel.numberSelectedProducts()});
    let itemCount = 0;
    const basketCards = boxWithBuyModel.selectedProducts.map((item) => {
        itemCount += 1;
        const cardBasketHTML = cloneTemplate<HTMLElement>('#card-basket');
        const cardBasket = new CardBasket(events, cardBasketHTML, {
            onClick: () => {
                boxWithBuyModel.deleteProduct(item);
                console.log('Сработала функция в экземпляре карточки CardBasket events');
            },
        });
        return cardBasket.render({title: item.title, price: item.price, basketCardIndex: itemCount});
    });

    basketView.render({ list: basketCards, prise: boxWithBuyModel.costSelectedProducts()}) 
    //
    console.log(`Товары в корзине`);
    console.log(boxWithBuyModel.selectedProducts);
});


/*
// Событие закрытие модального окна при клике за пределами --
document.addEventListener('click', (event) => {
//    const withinBoundaries = event.composedPath().includes(modalView.content);
//   if (!withinBoundaries) {
//        modalView.close();
//        console.log('1')
//   //};
//    };

    if (!modal.contains(event.target)) {
        // Закрываем модальное окно
        modalView.close();
        console.log('2')
    } else {
        // Закрываем модальное окно
        console.log('1')
    }
});
*/
/*
// Событие очистка данных покупателя
events.on('buyer:clean', () => { 
    FormOrder.render({});
    FormContacts.render({});   
    console.log('Данные покупателя сброшены');
});
*/




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

