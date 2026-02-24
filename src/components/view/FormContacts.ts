import {Form} from '../view/Form';
import {IEvents} from '../base/Events';
import {ensureElement} from '../../utils/utils';
import { IBuyer } from '../../types';


type IFormContacts = Pick<IBuyer, 'email' | 'phone'>;

export class FormContacts extends Form<IFormContacts> {
    protected emailFormInput: HTMLInputElement;
    protected phoneFormInput: HTMLInputElement;
    //protected orderButtonSubmit: HTMLButtonElement;

    constructor(protected events:IEvents, container: HTMLFormElement) {
        super(events, container);

        this.emailFormInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneFormInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        //this.orderButtonSubmit = ensureElement<HTMLButtonElement>('.button', this.container);

        this.emailFormInput.addEventListener('input', () => {
            this.events.emit('form_contacts:email', {email: this.emailFormInput.value});
        });

        this.phoneFormInput.addEventListener('input', () => {
            this.events.emit('form_contacts:phone', {phone: this.phoneFormInput.value});
        });

        // this.orderButtonSubmit.addEventListener('click', (event) => {
        //     event.preventDefault();
        //     this.events.emit('form_contacts:complete');
        // });
        // this.container.addEventListener('submit', (event) => {
        //     event.preventDefault();
        //     this.events.emit('order:submit');
        // });

    };

    set email(value: string) {
        this.emailFormInput.value = value;
    };

    set phone(value: string) {
        this.phoneFormInput.value = value;
    };

    // activateButton(data: boolean){
    //     this.orderButtonSubmit.disabled = data;
    // };

    // set buttonState(value: boolean) {
    //     this.orderButtonSubmit.disabled = value;
    // };
};
