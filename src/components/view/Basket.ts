import {Component} from '../base/Component';
import {ensureElement} from '../../utils/utils';
import {IEvents} from '../base/Events';

interface IBasket {  
  list: HTMLElement[];
  prise: number;
  buttonState?: boolean;
};  

export class Basket extends Component<IBasket>  {
    protected basketList: HTMLElement;
    protected basketPrise: HTMLElement;
    protected basketButton: HTMLButtonElement;

    constructor(protected events:IEvents, container: HTMLElement) {
        super(container);

        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.basketPrise = ensureElement<HTMLElement>('.basket__price', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:order');  // Слой отображения: нажатие кнопки оформления заказа в Корзине
        });

        this.basketButton.disabled = true;
    };

    set list(value: HTMLElement[]) {
        this.basketList.replaceChildren(...value);
    };

    set prise(value: number) {
        this.basketPrise.textContent = `${value} синапсов`;
    };

    set buttonState(value: boolean) {
        this.basketButton.disabled = value;
    };
};
