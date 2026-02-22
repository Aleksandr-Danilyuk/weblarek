import './scss/styles.scss';

import {ProductsCatalog} from './components/models/ProductCatalog';
import {Buyer} from './components/models/Buyer';
import {TPayment} from './types/index';
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
import {FormOrder} from './components/view/FormOrder';
import {FormContacts} from './components/view/FormContacts';
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
    'form_order:changed': 'изменение данных покупателя',
    'form_order:clean': 'обнуление данных покупателя',
    'form:complete': 'Нажата кнопка оформления заказа',
    'cardBasket:click_delete': 'Нажатие удаления карточки из корзины',
    'cardPreview:click': 'Пока не назначено',
    'card:click': 'Событие нажатие кнопки карточки в Галереи View',
    'basket:order': 'Событие нажатие кнопки оформления заказа в Корзине View',
    'form_order:card': 'Выбран способ оплаты card на форме FormOrder form_order:card',
    'form_order:cash': 'Выбран способ оплаты cash на форме FormOrder form_order:cash',
    'form_order:address': 'Указан адрес доставки на форме FormOrder form_order:address',
    'form_order:next': 'Нажата кнопка перехода ко второй форме оформления заказа',
    'form_order:email': 'Указан адрес электронной почты на форме FormOrder form_order:email',
    'form_order:phone': 'Указан телефонный номер покупателя на форме FormOrder form_order:phone'
};

const HeaderHTML = document.querySelector('.header') as HTMLElement;
const galleryHTML = document.querySelector('.gallery') as HTMLElement;
const modalHTML = ensureElement<HTMLElement>('#modal-container');
const cardPreviewlHTML = cloneTemplate('#card-preview');
const orderSuccessHTML = cloneTemplate('#success');
const basketHTML = cloneTemplate('#basket');
const formOrderHTML =  cloneTemplate('#order') as HTMLFormElement;
const formContactsHTML = cloneTemplate('#contacts') as HTMLFormElement;;

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
const formOrderView = new FormOrder(events, formOrderHTML); // Создание формы заказа слоя отображения
const formContactsView = new FormContacts(events, formContactsHTML); // Создание формы контактных данных слоя отображения
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
	console.log("Сработало событие нажатие копки корзины !");
    if (boxWithBuyModel.numberSelectedProducts() < 1){
        basketView.disabledButton();
    } else (
        basketView.enabledButton()
    );
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
                if (boxWithBuyModel.numberSelectedProducts() < 1){
                    basketView.disabledButton();
                };
            },
        });
        return cardBasket.render({title: item.title, price: item.price, basketCardIndex: itemCount});
    });

    basketView.render({ list: basketCards, prise: boxWithBuyModel.costSelectedProducts()}) 
    //
    console.log(`Товары в корзине`);
    console.log(boxWithBuyModel.selectedProducts);
});

// Работы Презентера с первой формой заказа

events.on('basket:order', () => { 
    console.log('Нажата кнопка в корзине Basket basket:order');
    formOrderView.render({payment: buyerModel.payment, address: buyerModel.address});
    modalView.content = formOrderHTML; 
    modalView.show();
}); 

events.on('form_order:card', (data:{payment:TPayment}) => { 
    console.log('Выбран способ оплаты card на форме FormOrder form_order:card');
    buyerModel.payment = data.payment;
}); 

events.on('form_order:cash', (data:{payment:TPayment}) => { 
    console.log('Выбран способ оплаты cash на форме FormOrder form_order:cash');
    buyerModel.payment = data.payment;
}); 

events.on('form_order:address', (data:{address:string}) => { 
    console.log('Указан адрес доставки на форме FormOrder form_order:address');
    buyerModel.address = data.address;
}); 

events.on('form_order:changed', () => { 
    console.log('Изменились данные заказа на форме FormOrder form_order:changed');

    const falsePaymentValid = buyerModel.validPayment();     // Валидация первой формы заказа 
    const falseAddressValid = buyerModel.validAddress();
    if (!falsePaymentValid && !falseAddressValid) {
        formOrderView.validationError = '';
        formOrderView.activateButton(false);
    } else if (!falsePaymentValid) {
        formOrderView.validationError = buyerModel.validAddress();
        formOrderView.activateButton(true);
    } else if (!falseAddressValid) {
        formOrderView.validationError = buyerModel.validPayment();
        formOrderView.activateButton(true);
    } else {
        formOrderView.validationError = `${buyerModel.validPayment()} , ${buyerModel.validAddress()}`;
        formOrderView.activateButton(true);
    }

    formOrderView.render({payment: buyerModel.payment, address: buyerModel.address});
}); 

events.on('form_order:next', () => {    // Нажата кнопка перехода ко второй форме оформления заказа FormOrder form_order:next
    console.log('Нажата кнопка перехода ко второй форме оформления заказа FormOrder form_order:next');
    formContactsView.render({email: buyerModel.email, phone: buyerModel.phone});
    modalView.content = formContactsHTML; 
}); 


// ===================================================================

events.on('form_order:email', (data:{email:string}) => {    // Введён адрес электронной почты на форме FormOrder form_order:email
    console.log('Введён адрес электронной почты на форме FormOrder form_order:email');
    console.log(data.email);
    buyerModel.address = data.email;
}); 

events.on('form_order:phone', (data:{phone:string}) => {    // Введён телефонный номер покупателя на форме FormOrder form_order:phone
    console.log('Введён телефонный номер покупателя на форме FormOrder form_order:phone');
    console.log(data.phone);
    buyerModel.address = data.phone;
}); 

