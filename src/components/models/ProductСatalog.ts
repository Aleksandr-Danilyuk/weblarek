import {IProduct} from "../../types";

export class ProductsСatalog {
    // Поля класса : 
    private _allProduct!: IProduct[];     // хранит массив всех товаров;
    private _selectedProduct: IProduct | null = null;  // хранит товар, выбранный для подробного отображения, изначально товар не выбран;

    constructor() {
        this.allProduct = [];
    }
    
    // Методы класса:   
    // сохранение массива товаров полученного в параметрах метода;
    public set allProduct (arrayProduct: IProduct[]) {
        this._allProduct = arrayProduct;
    }
    
    // получение массива товаров из модели;
    get allProduct(): IProduct[] {
        return this._allProduct;
    }
    
    // сохранение товара для подробного отображения;
    set selectedProduct(product: IProduct) {
        this._selectedProduct = product;
    }

    // получение товара для подробного отображения
    get selectedProduct(): IProduct | null {
        return this._selectedProduct;
    }

    // получение одного товара по его id;
    getProduct(idProduct: string): IProduct | undefined { 
        return this.allProduct.find(product => product.id === idProduct);
    }
}
