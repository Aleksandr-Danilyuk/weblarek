type TPayment = 'card' | 'cash' | '';

interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export class Buyer implements IBuyer {
    // Поля класса : 
    protected _payment!: TPayment; // поле содержит выбранный покупателем способ оплаты заказа. 
    protected _address!: string; // поле хранит адрес доставки товара.
    protected _email!: string; // поле для хранения электронного адреса покупателя. 
    protected _phone!: string; // поле для хранения телефонного номера покупателя. 

    constructor(payment: TPayment, address: string, email: string, phone: string) {
        this.payment = payment;
        this.address = address;
        this.email = email;
        this.phone = phone;
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
    clearDataBuyer(): IBuyer {
        return {
            payment : '',
            address : '',
            email : '',
            phone : ''
        }
    }

    // метод реализующий валидацию способа оплаты заказа
    validPayment(): string {
        if (this.payment === '') {
            return 'Способ оплаты не выбран'
        } else {
            return '';
        } 
    }

    // метод реализующий валидацию адреса доставки товара
    validAddress(): string {
        if (this.address === '') {
            return 'Адрес доставки не задан'
        } else {
            return '';
        } 
    }

    // метод реализующий электронного адреса покупателя
    validEmail(): string {
        if (this.email === '') {
            return 'Укажите емэйл'
        } else {
            return '';
        } 
    }

    // метод реализующий телефонного номера покупателя
    validPhone(): string {
        if (this.phone === '') {
            return 'Укажите номер телефона'
        } else {
            return '';
        } 
    }
}
