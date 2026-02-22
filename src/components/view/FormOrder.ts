import {Form} from '../view/Form';
import {IEvents} from '../base/Events';
import {ensureElement} from '../../utils/utils';
import { IBuyer, TPayment} from '../../types';
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

//payment(data: TPayment
type IFormOrder = Pick<IBuyer, 'payment' | 'address'> 


export class FormOrder extends Form<IFormOrder> {
    protected addressFormInput: HTMLInputElement;
    protected cardFormButton: HTMLButtonElement;
    protected cashFormButton: HTMLButtonElement;
    protected orderButtonNext: HTMLButtonElement;

    constructor(protected events:IEvents, container: HTMLFormElement) {
        super(container);

        this.addressFormInput = this.container.getElementById('address') as HTMLInputElement;
        this.cardFormButton = ensureElement<HTMLButtonElement>('card', this.container);
        this.cashFormButton = ensureElement<HTMLButtonElement>('cash', this.container);
        this.orderButtonNext = ensureElement<HTMLButtonElement>('.order__button', this.container);

        this.cardFormButton.addEventListener('click', () => {
            this.events.emit('formOrder:card');
        });

        this.cashFormButton.addEventListener('click', () => {
            this.events.emit('formOrder:cash');
        });

        this.orderButtonNext.addEventListener('click', () => {
            this.events.emit('formOrder:next');
        });

    }

    set payment(value: TPayment) {
        switch (value) {
            case 'card': {
                this.cardFormButton.setAttribute('button_alt-active'); 
                break;};
            case 'cash': {
                this.cashFormButton.setAttribute('button_alt-active'); 
                break;};
            default: {
                this.cardFormButton.removeAttribute('button_alt-active'); 
                this.cashFormButton.removeAttribute('button_alt-active'); 
                break;};
        };
    }

    set address(value: string) {
        this.addressFormInput.value = value;
    }

}
