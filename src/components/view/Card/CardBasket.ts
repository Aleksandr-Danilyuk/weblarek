import {Card} from './Card';
import {ensureElement} from '../../../utils/utils';
import {IEvents} from '../../base/Events';

type ICardBasketActions = { onClick: (event: PointerEvent) => void };

interface ICardBasket {  
  basketCardIndex: number; 
};

export class CardBasket extends Card<ICardBasket>  {
    protected IndexCardElement: HTMLElement;
    protected ButtonDeleteCard: HTMLButtonElement;

    constructor(protected events:IEvents, container: HTMLElement, actions?: ICardBasketActions) {
        super(container);

        this.IndexCardElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.ButtonDeleteCard = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        if (actions?.onClick) {
            this.ButtonDeleteCard.addEventListener('click', actions.onClick);
        };
    };

    set basketCardIndex(value: number) {
        this.IndexCardElement.textContent = String(value);
    };
};
