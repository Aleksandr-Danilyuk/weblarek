interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Класс реализует хранение товаров, которые пользователь выбрал для покупки;
export class BoxWithBuy {
    // Поля класса : 
    protected _selectedProduct!: IProduct[] ; // поле хранит массив товаров, выбранных покупателем для покупки 

    // Конструктор класса не принимает параметров. Так как изначально корзина пустая.
    constructor() {
        let _selectedProduct = new Array<IProduct>();
    }

    // Методы класса:   
    // добавление товара, который был получен в параметре, в массив корзины
    addProduct(product: IProduct) {
        this._selectedProduct.push(product);
    }

    // удаление товара, полученного в параметре из массива корзины
    deleteProduct(product: IProduct) {
        let filteredSelectedProduct : IProduct[] = this._selectedProduct.filter(elem => elem != product);
        this._selectedProduct = filteredSelectedProduct;
    }

    // получение массива товаров, которые находятся в корзине
    get selectedProduct(): IProduct[] {
        return this._selectedProduct;
    }

    // очистка корзины
    cleanSelectedProduct() {
        this._selectedProduct = this._selectedProduct.splice(0);
    }

    // получение стоимости всех товаров в корзине
    costSelectedProduct(): number {
        let costProducts: number = 0;
            for (let i : number = 0; i < this._selectedProduct.length; i++) {  
                let priceProduct : number | null = this._selectedProduct[i].price;
                if (priceProduct != null) {
                    costProducts += priceProduct;
                }
            }
        return costProducts;  
    }

    // получение количества товаров в корзине
    numberSelectedProduct(): number {
        return this._selectedProduct.length;
    }

    // проверка наличия товара в корзине по его id, полученного в параметр метода
    checkProduct(id: string): Boolean {
        return this._selectedProduct.some((elem) => elem.id === id);
    }
}
