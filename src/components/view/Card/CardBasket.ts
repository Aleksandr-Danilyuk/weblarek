import {Card} from './Card';
import {ensureElement} from '../../../utils/utils';
import {IEvents} from '../../base/Events';
import {IProduct} from '../../../types';

// type ICardBasketActions = { onClick: (event: PointerEvent) => void };

interface ICardBasket {  
  basketCardIndex: number; 
};

export class CardBasket extends Card<ICardBasket>  {
    protected indexCardElement: HTMLElement;
    protected buttonDeleteCard: HTMLButtonElement;

    // constructor(protected events:IEvents, container: HTMLElement, actions?: ICardBasketActions) {
    constructor(protected events:IEvents, container: HTMLElement, item: IProduct) {
        super(container);

        this.indexCardElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.buttonDeleteCard = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        // if (actions?.onClick) {
        //     this.ButtonDeleteCard.addEventListener('click', actions.onClick);
        // };
        this.buttonDeleteCard.addEventListener('click', () => 
            this.events.emit('card:click_delete', {item})   // Представление -> Презентеру, клик на удаление товара из корзины    
        );
    };

    set basketCardIndex(value: number) {
        this.indexCardElement.textContent = String(value);
    };
};
