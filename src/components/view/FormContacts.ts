import {Form} from '../view/Form';
import {IEvents} from '../base/Events';
import {ensureElement} from '../../utils/utils';
import { IBuyer } from '../../types';
//import {GalleryData} from "../../types";

// Шаблон для работы с инпут
//const inputElement = document.getElementById('inputId') as HTMLInputElement;
//const value = inputElement.value;
//console.log(value);
//  // inputElement.addEventListener('input', (event: Event) => {
    //   const inputValue = (event.target as HTMLInputElement).value;
    //   console.log('Input value:', inputValue);}


// Пример определения ICardActions с функцией
//type ICardActions = { onClick: (event: PointerEvent) => void };
// При создании экземпляра CardCatalog передайте функцию:
//      const cardCatalog = new CardCatalog(container, {
//          onClick: (event) => {console.log('Card selected');}
//      });

type IFormContacts = Pick<IBuyer, 'email' | 'phone'> 

export class FormContacts extends Form<IFormContacts> {
    protected emailFormInput: HTMLInputElement;
    protected phoneFormInput: HTMLInputElement;
    protected orderButtonSubmit: HTMLButtonElement;

    constructor(protected events:IEvents, container: HTMLFormElement) {
        super(container);

        this.emailFormInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneFormInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        this.orderButtonSubmit = ensureElement<HTMLButtonElement>('.button', this.container);
        //this.orderButtonSubmit = this.container.querySelector('.button') as HTMLButtonElement;

        this.emailFormInput.addEventListener('input', () => {
            this.events.emit('form_order:email', {email: this.emailFormInput.value});
        });

        this.phoneFormInput.addEventListener('input', () => {
            this.events.emit('form_order:phone', {phone: this.orderButtonSubmit.value});
        });

        this.orderButtonSubmit.addEventListener('click', () => {
            this.events.emit('form_order:next');
        });
    }

    enabledButton(){
        this.orderButtonSubmit.disabled = false;
    }

}
