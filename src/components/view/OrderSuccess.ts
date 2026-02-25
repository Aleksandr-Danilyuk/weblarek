import {Component} from '../base/Component';
import {ensureElement} from '../../utils/utils';
import {IEvents} from '../base/Events';

interface IOrderSuccess {  
  description: number; 
};

export class OrderSuccess extends Component<IOrderSuccess>  {
    protected orderSuccessDescription: HTMLElement;
    protected orderSuccessButtonClose: HTMLButtonElement;

    constructor(protected events:IEvents, container: HTMLElement) {
        super(container);

        this.orderSuccessDescription = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.orderSuccessButtonClose = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this.orderSuccessButtonClose.addEventListener('click', () => {
            this.events.emit('order_success:close');
            //this.container.classList.toggle('modal_active');
        });
    };

    set description(value: number) {
        const message = `Списано ${value} синапсов`;
        this.orderSuccessDescription.textContent = message;
    };
};
