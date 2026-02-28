import {Card} from './Card';
import {ensureElement} from '../../../utils/utils';

type ICardActions = { onClick: (event: PointerEvent) => void }; 

interface ICardBasket {  
  basketCardIndex: number; 
};

export class CardBasket extends Card<ICardBasket>  {
    protected indexCardElement: HTMLElement;
    protected buttonDeleteCard: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.indexCardElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.buttonDeleteCard = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        if (actions?.onClick) { 
            this.buttonDeleteCard.addEventListener('click', actions.onClick); 
        }; 
    };

    set basketCardIndex(value: number) {
        this.indexCardElement.textContent = String(value);
    };
};
