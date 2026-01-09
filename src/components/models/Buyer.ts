import {IBuyer} from "../../types";

type TPayment = 'card' | 'cash' | '';

export class Buyer implements IBuyer {
    // Поля класса : 
    private _payment: TPayment; // поле содержит выбранный покупателем способ оплаты заказа. 
    private _address: string; // поле хранит адрес доставки товара.
    private _email: string; // поле для хранения электронного адреса покупателя. 
    private _phone: string; // поле для хранения телефонного номера покупателя. 

    constructor() {
        this._payment = '';
        this._address = '';
        this._email = '';
        this._phone = '';
    }

    // Методы класса:   
    // сохраняет выбранный покупателем способ оплаты заказа.
    set payment(valuePayment: TPayment) {
        this._payment = valuePayment;
    }

    //  получает выбранный покупателем способ оплаты заказа
    get payment(): TPayment {
        return this._payment;
    }

    // сохраняет адрес доставки товара
    set address(valueAddress: string) {
        this._address = valueAddress;
    }

    // получает адрес доставки товара
    get address(): string {
        return this._address;
    }
    
    // сохраняет электронный адрес покупателя
    set email(valueEmail: string) {
        this._email = valueEmail;
    }
    
    // получает электронный адрес покупателя
    get email(): string {
        return this._email;
    }

    // сохраняет выбранный покупателем способ оплаты заказа
    set phone(valuePhone: string) {
        this._phone = valuePhone;
    }

    // получает выбранный покупателем способ оплаты заказа
    get phone(): string  {
        return this._phone;
    }

    // метод реализующий получение всех данных покупателя
    getDataBuyer(): IBuyer {
        return {
            payment : this.payment,
            address : this.address,
            email : this.email,
            phone : this.phone
        }
    }

    // метод реализующий очистку данных покупателя
    clearDataBuyer() {
        this.payment = '';
        this.address = '';
        this.email = '';
        this.phone = '';
    
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
        return this.email === '' ? 'Укажите номер телефона' : '';
    }
}
