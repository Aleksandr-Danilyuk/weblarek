import {Form} from '../view/Form';
import {IEvents} from '../base/Events';
import {ensureElement} from '../../utils/utils';
import { IBuyer } from '../../types';

type IFormContacts = Pick<IBuyer, 'email' | 'phone'>;

export class FormContacts extends Form<IFormContacts> {
    protected emailFormInput: HTMLInputElement;
    protected phoneFormInput: HTMLInputElement;

    constructor(protected events:IEvents, container: HTMLFormElement) {
        super(events, container);

        this.emailFormInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneFormInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this.emailFormInput.addEventListener('input', () => {   // Слой отображения: введён адрес электронной почты на форме
            this.events.emit('form_contacts:email', {email: this.emailFormInput.value});
        });

        this.phoneFormInput.addEventListener('input', () => {   // Слой отображения: введён телефонный номер покупателя на форме
            this.events.emit('form_contacts:phone', {phone: this.phoneFormInput.value});
        });
    };

    set email(value: string) {
        this.emailFormInput.value = value;
    };

    set phone(value: string) {
        this.phoneFormInput.value = value;
    };
};
