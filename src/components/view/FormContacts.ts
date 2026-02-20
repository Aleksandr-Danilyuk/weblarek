import {Form} from '../view/Form';
import {IEvents} from '../base/Events';
import {ensureElement} from '../../utils/utils';
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


export class FormContacts extends Form {
    protected emailFormInput: HTMLInputElement;
    protected phoneFormInput: HTMLInputElement;
    protected orderButtonSubmit: HTMLButtonElement;

    constructor(protected events:IEvents, container: HTMLFormElement) {
        super(container);

        this.emailFormInput = this.container.getElementById('email') as HTMLInputElement;
        this.phoneFormInput = this.container.getElementById('phone') as HTMLInputElement;
        this.orderButtonSubmit = ensureElement<HTMLButtonElement>('.button', this.container);

        this.orderButtonSubmit.addEventListener('click', () => {
            this.events.emit('formOrder:submit');
        });

    }

}
