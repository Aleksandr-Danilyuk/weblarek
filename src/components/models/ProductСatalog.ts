interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export class ProductСatalog {
    // Поля класса : 
    protected _allProduct!: IProduct[];     // хранит массив всех товаров;
    protected _selectedProduct!: IProduct;  // хранит товар, выбранный для подробного отображения;

    constructor(allProduct: IProduct[]) {
        this.allProduct = allProduct;
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
    get selectedProduct(): IProduct {
        return this._selectedProduct;
    }

    // получение одного товара по его id;
    getProduct(idProduct: string): IProduct | undefined { 
        const foundProduct = this.allProduct.find(product => product.id === idProduct);
        if (foundProduct) {
            return foundProduct;
        } else {
            return undefined;
        }
        
    }
}
