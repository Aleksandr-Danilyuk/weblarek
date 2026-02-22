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

interface IOrderSuccess {  
  description: number; 
}  


export class OrderSuccess extends Component<IOrderSuccess>  {
    protected orderSuccessDescription: HTMLElement;
    protected orderSuccessButtonClose: HTMLButtonElement;

    constructor(protected events:IEvents, container: HTMLElement) {
        super(container);

        //this.orderSuccessDescription = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.orderSuccessDescription = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.orderSuccessButtonClose = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this.orderSuccessButtonClose.addEventListener('click', () => {
            this.events.emit('order_success:close');
            this.container.classList.toggle('modal_active');
        });
    };

    // Инструментарий для работы с DOM в дочерних компонентах
    set description(value: number) {
        const message = `Списано ${value} синапсов`;
        this.orderSuccessDescription.textContent = message;
    }
}
