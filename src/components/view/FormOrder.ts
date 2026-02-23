import {Form} from '../view/Form';
import {IEvents} from '../base/Events';
import {ensureElement} from '../../utils/utils';
import { IBuyer, TPayment} from '../../types';

type IFormOrder = Pick<IBuyer, 'payment' | 'address'>;

export class FormOrder extends Form<IFormOrder> {
    protected addressFormInput: HTMLInputElement;
    protected cardFormButton: HTMLButtonElement;
    protected cashFormButton: HTMLButtonElement;
    protected orderButtonNext: HTMLButtonElement;

    constructor(protected events:IEvents, container: HTMLFormElement) {
        super(container);

        this.addressFormInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.cardFormButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashFormButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.orderButtonNext = ensureElement<HTMLButtonElement>('.order__button', this.container);

        this.addressFormInput.addEventListener('input', () => {
            this.events.emit('form_order:address', {address: this.addressFormInput.value});
        });

        this.cardFormButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.events.emit('form_order:card', {payment: 'card'});
        });

        this.cashFormButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.events.emit('form_order:cash', {payment: 'cash'});
        });

        this.orderButtonNext.addEventListener('click', (event) => {
            event.preventDefault();
            this.events.emit('form_order:next');  // Кнопка перехода ко второй форме нажата
        });
    };

    set payment(value: TPayment) {
        switch (value) {
            case 'card': {
                this.cardFormButton.classList.add('button_alt-active'); 
                this.cashFormButton.classList.remove('button_alt-active'); 
                break;};
            case 'cash': {
                this.cardFormButton.classList.remove('button_alt-active'); 
                this.cashFormButton.classList.add('button_alt-active'); 
                break;};
            default: {
                this.cardFormButton.classList.remove('button_alt-active'); 
                this.cashFormButton.classList.remove('button_alt-active'); 
                break;};
        };
    };

    set address(value: string) {
        this.addressFormInput.value = value;
    };

    activateButton(data: boolean){
        this.orderButtonNext.disabled = data;
    };
};
