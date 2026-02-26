import {IBuyer} from "../../types";
import {IEvents} from '../base/Events';

type TPayment = 'card' | 'cash' | '';

export class Buyer implements IBuyer {
    // Поля класса : 
    private _payment: TPayment; // поле содержит выбранный покупателем способ оплаты заказа. 
    private _address: string; // поле хранит адрес доставки товара.
    private _email: string; // поле для хранения электронного адреса покупателя. 
    private _phone: string; // поле для хранения телефонного номера покупателя. 

    constructor(protected events:IEvents) {
        this._payment = '';
        this._address = '';
        this._email = '';
        this._phone = '';
    }

    // Методы класса:   
    // сохраняет выбранный покупателем способ оплаты заказа.
    set payment(valuePayment: TPayment) {
        this._payment = valuePayment;
        this.events.emit('buyer_order:changed');
    }

    //  получает выбранный покупателем способ оплаты заказа
    get payment(): TPayment {
        return this._payment;
    }

    // сохраняет адрес доставки товара
    set address(valueAddress: string) {
        this._address = valueAddress;
        this.events.emit('buyer_order:changed');
    }

    // получает адрес доставки товара
    get address(): string {
        return this._address;
    }
    
    // сохраняет электронный адрес покупателя
    set email(valueEmail: string) {
        this._email = valueEmail;
        this.events.emit('buyer_contacts:changed');
    }
    
    // получает электронный адрес покупателя
    get email(): string {
        return this._email;
    }

    // сохраняет выбранный покупателем способ оплаты заказа
    set phone(valuePhone: string) {
        this._phone = valuePhone;
        this.events.emit('buyer_contacts:changed');
    }

    // получает выбранный покупателем способ оплаты заказа
    get phone(): string  {
        return this._phone;
    }

    // метод реализующий очистку данных покупателя
    clearDataBuyer() {
        this.payment = '';
        this.address = '';
        this.email = '';
        this.phone = '';
        this.events.emit('buyer_order:changed');
        this.events.emit('buyer_contacts:changed');
    }

    // метод реализующий валидацию способа оплаты заказа
    validPayment(): string {
        return this.payment === '' ? 'Способ оплаты не выбран' : '';
    }

    // метод реализующий валидацию адреса доставки товара
    validAddress(): string {
        return this.address === '' ? 'Адрес доставки не задан' : '';
    }

    // метод реализующий электронного адреса покупателя
    validEmail(): string {
        return this.email === '' ? 'Укажите емэйл' : '';
    }

    // метод реализующий телефонного номера покупателя
    validPhone(): string {
        return this.phone === '' ? 'Укажите номер телефона' : '';
    }
}
