import {Card} from './Card';
import {ensureElement} from '../../../utils/utils';
import {IEvents} from '../../base/Events';



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

type ICardBasketActions = { onClick: (event: PointerEvent) => void };

interface ICardBasket {  
  basketCardIndex: number; 
} 

export class CardBasket extends Card<ICardBasket>  {
    protected IndexCardElement: HTMLElement;
    protected ButtonDeleteCard: HTMLButtonElement;

    constructor(protected events:IEvents, container: HTMLElement, actions?: ICardBasketActions) {
        super(container);

        this.IndexCardElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.ButtonDeleteCard = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        if (actions?.onClick) {
            this.ButtonDeleteCard.addEventListener('click', actions.onClick);
            this.events.emit('cardBasket:click_delete');
        };
    }

    // Инструментарий для работы с DOM в дочерних компонентах

    set basketCardIndex(value: number) {
        this.IndexCardElement.textContent = String(value);
    }

}
