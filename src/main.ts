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
// // Закрываем модальное окно если клик был сделан вне модального окна и его дочерних элементов
// document.addEventListener('click', (event) => {
//     if (event.target === modalHTML) {
//         modalHTML.classList.remove('modal_active'); 
//     };
// });


// Событие изменение Галереи товарами 
events.on('catalog:changed', () => {
    const itemCards = productsModel.allProduct.map((item) => {
        const CardCatalogTemplate = cloneTemplate<HTMLElement>('#card-catalog');
        const card = new CardCatalog(events, CardCatalogTemplate, item);
        // const card = new CardCatalog(events, CardCatalogTemplate, { 
        //     onClick: () => {
        //         events.emit('card:click', {item});
        //         //productsModel.selectedProduct = item; 
        //     },
        // });
        return card.render(item);
    });

    galleryModel.render({ catalog: itemCards });
}); 

// // Событие нажатие на кнопке  слоя View  
 // const modalCardPreview = new CardPreview(events, cardPreviewlHTML, {
//     onClick: () => {
//         if (productsModel.selectedProduct && !boxWithBuyModel.checkProduct(productsModel.selectedProduct?.id)) {
//                 boxWithBuyModel.addProduct(productsModel.selectedProduct);  // Presenter добавляет/удаляет карточку в Корзину
//                 modalCardPreview.textCardButton = 'Удалить из корзины';
//         } else if (productsModel.selectedProduct) {
//                 boxWithBuyModel.deleteProduct(productsModel.selectedProduct);
//                 modalCardPreview.textCardButton = 'Купить';
//         };
//     }
// });
const modalCardPreview = new CardPreview(events, cardPreviewlHTML);

events.on('card:click', (data:{item:IProduct}) => {    // Событие нажатия Карточки в Галерее. Представление событие -> Презентер слушатель -> Модель данных
    productsModel.selectedProduct = data.item; // Присваиваем значение Выбранной карточки в модель данных
    // modalView.content = cardPreviewlHTML; // Переделано управление содержимым через класс
    // const modalCardPreview = new CardPreview(events, cardPreviewlHTML, productsModel.selectedProduct!);
});  

events.on('card:select', () => {    // Модель данных генерирует событие о изменении выбранной карточки, Презентер вызывает отрисовку выбранной карточки
    // modalView.content = modalCardPreview.render();
    // modalView.show();
    //        if (boxWithBuyModel.checkProduct(productsModel.selectedProduct?.id)) {  // Presenter добавляет/удаляет карточку в Корзину
    //            modalCardPreview.textCardButton = 'Удалить из корзины';
    //     } else {
    //            modalCardPreview.textCardButton = 'Купить';
    //     };
    //
    // modalCardPreview.render({
    //     title: productsModel.selectedProduct?.title, 
    //     price: productsModel.selectedProduct?.price, 
    //     description: productsModel.selectedProduct?.description, 
    //     image: productsModel.selectedProduct?.image, 
    //     category: productsModel.selectedProduct?.category
    // });

    modalCardPreview.render(productsModel.selectedProduct!);    // Отрисовываем Выбранную карточку card:select

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

events.on('card:add', () => {    // Событие добавления карточки в корзину. Презентер -> Модель данных
    //boxWithBuyModel.addProduct(data.item); // Присваиваем значение Выбранной карточки в модель данных
       if (productsModel.selectedProduct && !boxWithBuyModel.checkProduct(productsModel.selectedProduct?.id)) {
                boxWithBuyModel.addProduct(productsModel.selectedProduct);  // Presenter добавляет/удаляет карточку в Корзину;
        } else if (productsModel.selectedProduct) {
                boxWithBuyModel.deleteProduct(productsModel.selectedProduct);
        };
});  

// Событие открытия корзины headerView слоя View 
events.on('basket:click', () => {    // Событие нажатия на кнопку корзины в шапке
    // if (boxWithBuyModel.numberSelectedProducts() < 1){
    //     basketView.buttonState = true;
    // } else {
    //     basketView.buttonState = false
    // };
    modalView.content = basketView.render(); 
    modalView.show();
});  

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
    })
    basketView.render({ list: basketCards, prise: boxWithBuyModel.costSelectedProducts()}); // Товары в корзине
});


// Событие нажатие удаления Карточки в Корзине. Представление событие -> Презентер слушатель -> Модель данных
events.on('card:click_delete', (data:{item:IProduct}) => {  
    boxWithBuyModel.deleteProduct(data.item);
});

events.on('basket:clean', () => {  
    modalCardPreview.textCardButton = 'Купить';
    headerView.render({counter:boxWithBuyModel.numberSelectedProducts()});

    // let itemCount = 0;
    // const basketCards = boxWithBuyModel.selectedProducts.map((item) => {
    //     itemCount += 1;
    //     const cardBasketHTML = cloneTemplate<HTMLElement>('#card-basket');
    //     const cardBasket = new CardBasket(events, cardBasketHTML, {
    //         onClick: () => {
    //             boxWithBuyModel.deleteProduct(item);
    //             if (boxWithBuyModel.numberSelectedProducts() < 1){
    //                 basketView.buttonState = true;
    //             };
    //         },
    //     });
        
    //     return cardBasket.render({title: item.title, price: item.price, basketCardIndex: itemCount});

    // });

    // basketView.render({ list: basketCards, prise: boxWithBuyModel.costSelectedProducts()}); // Товары в корзине
});

// Работа Презентера с первой формой заказа
events.on('basket:order', () => {       // Нажата кнопка в корзине Basket basket:order
    formOrderView.render({payment: buyerModel.payment, address: buyerModel.address});
    modalView.content = formOrderView.render(); 
    modalView.show();
}); 

events.on('form_order:card', (data:{payment:TPayment}) => {     // Выбран способ оплаты card на форме FormOrder form_order:card
    buyerModel.payment = data.payment;
}); 

events.on('form_order:cash', (data:{payment:TPayment}) => {     // Выбран способ оплаты cash на форме FormOrder form_order:cash
    buyerModel.payment = data.payment;
}); 

events.on('form_order:address', (data:{address:string}) => {    // Указан адрес доставки на форме FormOrder form_order:address
    buyerModel.address = data.address;
}); 

events.on('buyer_order:changed', () => {   // Изменились данные покупателя по заказу
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

events.on('order:submit', () => {    // Нажата кнопка перехода ко второй форме оформления заказа FormOrder
    formContactsView.render({email: buyerModel.email, phone: buyerModel.phone});
    modalView.content = formContactsView.render();
}); 

events.on('form_contacts:email', (data:{email:string}) => {    // Введён адрес электронной почты на форме FormContacts form_contacts:email
    buyerModel.email = data.email;
}); 

events.on('form_contacts:phone', (data:{phone:string}) => {    // Введён телефонный номер покупателя на форме FormContacts form_contacts:phone
    buyerModel.phone = data.phone;
}); 

events.on('buyer_contacts:changed', () => {      // Изменились контактные данные покупателя
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

events.on('contacts:submit', () => {    // Нажата кнопка завершения оформления заказа во второй форме FormContacts
    //const sendOderRequest = new CommunicationLayer(urlApi);
    //const request = sendOderRequest.postBuy({
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

            //console.log('Ответ от сервера:', request);
            return request;
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error); // Обработка ошибок, которые могут возникнуть при отправке запроса
        };
    };

    handlePostBuyResponse().then((request) => {
        //console.log('Ответ then:', request?.total);
        if (request?.id) {
            orderSuccessView.render({description: request.total});
            modalView.content = orderSuccessView.render();
            buyerModel.clearDataBuyer();
            boxWithBuyModel.cleanSelectedProducts();
        };
    });

    //orderSuccessView.render({description: request.total});

    // if (sendOderRequest) {
    //     orderSuccessView.render({description: boxWithBuyModel.costSelectedProducts()});
    //     modalView.content = orderSuccessView.render();
    // };
});

events.on('order_success:close', () => {
    //headerView.render({counter:boxWithBuyModel.numberSelectedProducts()});
    modalView.close();
});
