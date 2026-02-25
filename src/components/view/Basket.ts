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
            this.events.emit('basket:order');
        });

        this.basketButton.disabled = true;
    };

    set list(value: HTMLElement[]) {
        this.basketList.replaceChildren(...value);
        //this.events.emit('basket:change');
    };

    set prise(value: number) {
        this.basketPrise.textContent = `${value} синапсов`;
    };

    // disabledButton(){
    //     this.basketButton.disabled = true;
    // };

    // enabledButton(){
    //     this.basketButton.disabled = false;
    // };

    set buttonState(value: boolean) {
        this.basketButton.disabled = value;
    };
};
