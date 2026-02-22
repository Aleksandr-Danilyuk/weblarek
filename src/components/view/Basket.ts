import {Component} from '../base/Component';
import {ensureElement} from '../../utils/utils';
import {IEvents} from '../base/Events';



// Шаблон для работы с инпут
//const inputElement = document.getElementById('inputId') as HTMLInputElement;
//const value = inputElement.value;
//console.log(value);
//  // inputElement.addEventListener('input', (event: Event) => {
    //   const inputValue = (event.target as HTMLInputElement).value;
    //   console.log('Input value:', inputValue);}


// Пример определения ICardActions с функцией
//type ICardActions = { onClick: (event: PointerEvent) => void };
// При создании экземпляра CardCatalog передайте функцию:
//      const cardCatalog = new CardCatalog(container, {
//          onClick: (event) => {console.log('Card selected');}
//      });

interface IBasket {  
  list: HTMLElement[];
  prise: number;
}  


export class Basket extends Component<IBasket>  {
    protected basketList: HTMLElement;
    protected basketPrise: HTMLElement;
    protected basketButton: HTMLButtonElement;

    constructor(protected events:IEvents, container: HTMLElement) {
        super(container);

        //this.orderSuccessDescription = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.basketPrise = ensureElement<HTMLElement>('.basket__price', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:order');
        });
    };

    // Инструментарий для работы с DOM в дочерних компонентах
    set list(value: HTMLElement[]) {
        //this.galleryElement.replaceChildren(...value);
        this.basketList.replaceChildren(...value);
        this.events.emit('basket:change');
    };

    set prise(value: number) {
        this.basketPrise.textContent = `${value} синапсов`;
    };

    disabledButton(){
        this.basketButton.disabled = true;
    }

    enabledButton(){
        this.basketButton.disabled = false;
    }
   // set description(value: number = 0) {
    //    const cost = String(value);
    //    this.orderSuccessDescription.textContent = `Списано ${cost} синапсов`;
   // }
}
