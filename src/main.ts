import './scss/styles.scss';

import {ProductsCatalog} from './components/models/ProductCatalog';
import {Buyer} from './components/models/Buyer';
import {TPayment} from './types/index';
import {IProduct} from './types/index';
import {BoxWithBuy} from './components/models/BoxWithBuy';
import {CommunicationLayer} from './components/communication/CommunicationLayer';
import {Api} from './components/base/Api';
import {EventEmitter} from './components/base/Events';
import {ensureElement} from './utils/utils';
import {API_URL} from './utils/constants';
import {CDN_URL} from './utils/constants';
 
import {Header} from './components/view/Header';
import {Modal} from './components/view/Modal';
import {FormOrder} from './components/view/FormOrder';
import {FormContacts} from './components/view/FormContacts';
import {Gallery} from './components/view/Gallery';
import {CardCatalog} from './components/view/Card/CardCatalog';
import {CardPreview} from './components/view/Card/CardPreview';
import {CardBasket} from './components/view/Card/CardBasket';
import {cloneTemplate} from './utils/utils';
import {OrderSuccess} from './components/view/OrderSuccess';
import {Basket} from './components/view/Basket';

const HeaderHTML = document.querySelector('.header') as HTMLElement;
const galleryHTML = document.querySelector('.gallery') as HTMLElement;
const modalHTML = ensureElement<HTMLElement>('#modal-container');
const cardPreviewlHTML = cloneTemplate('#card-preview');
const basketHTML = cloneTemplate('#basket');
const formOrderHTML =  cloneTemplate('#order') as HTMLFormElement;
const formContactsHTML = cloneTemplate('#contacts') as HTMLFormElement;
const orderSuccessHTML = cloneTemplate('#success');


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
const modalCardPreview = new CardPreview(events, cardPreviewlHTML); // Создание объекта Галереи слоя отображения

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
// Событие изменение Галереи товарами 
events.on('catalog:changed', () => {
    const itemCards = productsModel.allProduct.map((item) => {
        const CardCatalogTemplate = cloneTemplate<HTMLElement>('#card-catalog');
        const card = new CardCatalog(events, CardCatalogTemplate, item);
        return card.render(item);
    });

    galleryModel.render({ catalog: itemCards });
}); 

// Событие нажатия Карточки в Галерее. Представление генерация события -> Презентер слушатель -> Модель данных изменение
events.on('card:click', (data:{item:IProduct}) => {    
    productsModel.selectedProduct = data.item; // Присваиваем значение Выбранной карточки в модель данных
});  

// Модель данных генерирует событие о изменении выбранной карточки, Презентер вызывает отрисовку выбранной карточки
events.on('card:select', () => {    
    modalCardPreview.render(productsModel.selectedProduct!);    // Отрисовываем Выбранную карточку

    if (productsModel.selectedProduct!.price === null) {    // Презентер проверяет полученные данные и блокирует кнопку представления при необходимости
        modalCardPreview.buttonState = true;
    } else {
        modalCardPreview.buttonState = false;
    };

    // Проверяем в модели данных Корзины товар, отрисовываем текст кнопки
    if (boxWithBuyModel.checkProduct(productsModel.selectedProduct?.id!)) { 
            modalCardPreview.textCardButton = 'Удалить из корзины';
    } else if (!boxWithBuyModel.checkProduct(productsModel.selectedProduct?.id!)) {
            modalCardPreview.textCardButton = 'Купить';
    };
    modalView.content = modalCardPreview.render(); // Исправлено управление содержимым модального окна через класс
    modalView.show();
});  

// Событие добавления карточки в корзину
events.on('card:add', () => {    
       if (productsModel.selectedProduct && !boxWithBuyModel.checkProduct(productsModel.selectedProduct?.id)) {
                boxWithBuyModel.addProduct(productsModel.selectedProduct);  // Presenter добавляет/удаляет карточку в Корзину
        } else if (productsModel.selectedProduct) {
                boxWithBuyModel.deleteProduct(productsModel.selectedProduct);
        };
});  

// Событие открытия корзины headerView слоя View 
events.on('basket:click', () => {    // Событие нажатия на кнопку корзины в шапке
    modalView.content = basketView.render(); 
    modalView.show();
});  

// Событие данные корзины изменены
events.on('basket:changed', (data: {product: IProduct})  => {  
    if (boxWithBuyModel.checkProduct(data.product.id)) {    // Изменение названий кнопок: проверка товара в карзине
            modalCardPreview.textCardButton = 'Удалить из корзины';
    } else if (!boxWithBuyModel.checkProduct(data.product.id)) {
            modalCardPreview.textCardButton = 'Купить';
    };
    
    const numberSelectedProducts = boxWithBuyModel.numberSelectedProducts();
    headerView.render({counter: numberSelectedProducts}); // Отрисовывка числа в шапке в корзине
    if (numberSelectedProducts < 1) {
        basketView.buttonState = true;
    } else {
        basketView.buttonState = false;
    };
    
    const basketCards = boxWithBuyModel.selectedProducts.map((item, index) => {
        const cardBasketHTML = cloneTemplate<HTMLElement>('#card-basket');
        const cardBasket = new CardBasket(events, cardBasketHTML, item);
        return cardBasket.render({title: item.title, price: item.price, basketCardIndex: index + 1});
    });
    
    basketView.render({ list: basketCards, prise: boxWithBuyModel.costSelectedProducts()}); // Товары в корзине
});


// Событие нажатие удаления Карточки в Корзине. Представление событие -> Презентер слушатель -> Модель данных
events.on('card:click_delete', (data:{item:IProduct}) => {  
    boxWithBuyModel.deleteProduct(data.item);
});

// Очистка Корзины. Модель данных событие -> Презентер слушатель -> Представление отрисовка
events.on('basket:clean', () => {  
    basketView.buttonState = true;
    basketView.render({ list: [], prise: boxWithBuyModel.costSelectedProducts()})  
    headerView.render({counter:boxWithBuyModel.numberSelectedProducts()});
});

// Работа Презентера с первой формой заказа
events.on('basket:order', () => {       // Нажата кнопка в корзине Basket
    formOrderView.render({payment: buyerModel.payment, address: buyerModel.address});
    modalView.content = formOrderView.render(); 
    modalView.show();
}); 

// Событие выбран способ оплаты card на форме FormOrder
events.on('form_order:card', (data:{payment:TPayment}) => {     
    buyerModel.payment = data.payment;
}); 

// Событие выбран способ оплаты cash на форме FormOrder
events.on('form_order:cash', (data:{payment:TPayment}) => {     
    buyerModel.payment = data.payment;
}); 

// Событие указан адрес доставки на форме FormOrder
events.on('form_order:address', (data:{address:string}) => {    
    buyerModel.address = data.address;
}); 

// Событие изменились данные покупателя по заказу
events.on('buyer_order:changed', () => {   
    const falsePaymentValid = buyerModel.validPayment();     // Валидация первой формы заказа 
    const falseAddressValid = buyerModel.validAddress();
    if (!falsePaymentValid && !falseAddressValid) {
        formOrderView.validationError = '';
        formOrderView.buttonState = false;
    } else if (!falsePaymentValid) {
        formOrderView.validationError = buyerModel.validAddress();
        formOrderView.buttonState = true;
    } else if (!falseAddressValid) {
        formOrderView.validationError = buyerModel.validPayment();
        formOrderView.buttonState = true;
    } else {
        formOrderView.validationError = `${buyerModel.validPayment()} , ${buyerModel.validAddress()}`;
        formOrderView.buttonState = true;
    }

    formOrderView.render({payment: buyerModel.payment, address: buyerModel.address});
}); 

// Событие нажата кнопка перехода ко второй форме оформления заказа
events.on('order:submit', () => {    
    formContactsView.render({email: buyerModel.email, phone: buyerModel.phone});
    modalView.content = formContactsView.render();
}); 

// Событие введён адрес электронной почты на форме FormContacts
events.on('form_contacts:email', (data:{email:string}) => {    
    buyerModel.email = data.email;
}); 

// Событие введён телефонный номер покупателя на форме FormContacts
events.on('form_contacts:phone', (data:{phone:string}) => {    
    buyerModel.phone = data.phone;
}); 

// Событие изменились контактные данные покупателя
events.on('buyer_contacts:changed', () => {      
    const falseEmailValid = buyerModel.validEmail();     // Валидация второй формы заказа 
    const falsePhoneValid = buyerModel.validPhone();
    if (!falseEmailValid && !falsePhoneValid) {
        formContactsView.validationError = '';
        formContactsView.buttonState = false;
    } else if (!falseEmailValid) { 
        formContactsView.validationError = buyerModel.validPhone();
        formContactsView.buttonState = true; 
    } else if (!falsePhoneValid) {
        formContactsView.validationError = buyerModel.validEmail();
        formContactsView.buttonState = true;
    } else {
        formContactsView.validationError = `${buyerModel.validEmail()} , ${buyerModel.validPhone()}`;
        formContactsView.buttonState = true;
    };
    formContactsView.render({email: buyerModel.email, phone: buyerModel.phone});
}); 

// Событие нажата кнопка завершения оформления заказа во второй форме FormContacts
events.on('contacts:submit', () => {    
    async function handlePostBuyResponse() {
        try {
            const request = await dataCommunicationLayer.postBuy({
                items: boxWithBuyModel.selectedProducts.map((item) => item.id),
                total: boxWithBuyModel.costSelectedProducts(),
                payment: buyerModel.payment,
                address: buyerModel.address,
                email: buyerModel.email,
                phone: buyerModel.phone
            });

            return request;
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error); // Обработка ошибок, которые могут возникнуть при отправке запроса
        };
    };

    handlePostBuyResponse().then((request) => {
        if (request?.id) {
            buyerModel.clearDataBuyer();
            boxWithBuyModel.cleanSelectedProducts();
            orderSuccessView.render({description: request.total});
            modalView.content = orderSuccessView.render();
        };
    });
});

// Событие нажата кнопка закрытия в модальном окне успешного заказа
events.on('order_success:close', () => {
    modalView.close();
});
