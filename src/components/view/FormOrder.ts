import {Form} from '../view/Form';
import {IEvents} from '../base/Events';
import {ensureElement} from '../../utils/utils';
import { IBuyer, TPayment} from '../../types';

type IFormOrder = Pick<IBuyer, 'payment' | 'address'>;

export class FormOrder extends Form<IFormOrder> {
    protected addressFormInput: HTMLInputElement;
    protected cardFormButton: HTMLButtonElement;
    protected cashFormButton: HTMLButtonElement;

    constructor(protected events:IEvents, container: HTMLFormElement) {
        super(events, container);

        this.addressFormInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.cardFormButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashFormButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);

        this.addressFormInput.addEventListener('input', () => {   // Слой отображения: введён адрес доставки на форме FormOrder
            this.events.emit('form_order:address', {address: this.addressFormInput.value});
        });

        this.cardFormButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.events.emit('form_order:card', {payment: 'card'});  // Слой отображения: выбран способ оплаты card на форме
        });

        this.cashFormButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.events.emit('form_order:cash', {payment: 'cash'});  // Слой отображения: выбран способ оплаты cash на форме
        });
    };

    set payment(value: TPayment) {
        this.cardFormButton.classList.toggle('button_alt-active', value === 'card');
        this.cashFormButton.classList.toggle('button_alt-active', value === 'cash');
    };

    set address(value: string) {
        this.addressFormInput.value = value;
    };
};
