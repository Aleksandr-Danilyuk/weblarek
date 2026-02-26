import {IProduct} from "../../types";
import {IEvents} from '../base/Events';

// Класс реализует хранение товаров, которые пользователь выбрал для покупки;
export class BoxWithBuy {
    // Поля класса : 
    private _selectedProducts: IProduct[] ; // поле хранит массив товаров, выбранных покупателем для покупки 

    // Конструктор класса не принимает параметров. Так как изначально корзина пустая.
    constructor(protected events:IEvents) {
        this._selectedProducts = new Array<IProduct>();
        this.events.emit('basket:clean');
    }

    // Методы класса:   
    // добавление товара, который был получен в параметре, в массив корзины
    addProduct(product: IProduct) {
        this._selectedProducts.push(product);
        this.events.emit('basket:changed', {product});
    }

    // удаление товара, полученного в параметре из массива корзины
    deleteProduct(product: IProduct) {
        this._selectedProducts = this._selectedProducts.filter(elem => elem != product);
        this.events.emit('basket:changed', {product});
    }

    // получение массива товаров, которые находятся в корзине
    get selectedProducts(): IProduct[] {
        return this._selectedProducts;
    }

    // очистка корзины
    cleanSelectedProducts() {
        this._selectedProducts = new Array<IProduct>();
        this.events.emit('basket:clean');
    }

    // получение стоимости всех товаров в корзине
    costSelectedProducts(): number {
        let costProducts: number = 0;
            for (let i : number = 0; i < this._selectedProducts.length; i++) {  
                const priceProduct : number | null = this._selectedProducts[i].price;
                if (priceProduct != null) {
                    costProducts += priceProduct;
                }
            }
        return costProducts;  
    }

    // получение количества товаров в корзине
    numberSelectedProducts(): number {
        return this._selectedProducts.length;
    }

    // проверка наличия товара в корзине по его id, полученного в параметр метода
    checkProduct(id: string): Boolean {
        return this._selectedProducts.some((elem) => elem.id === id);
    }
}
