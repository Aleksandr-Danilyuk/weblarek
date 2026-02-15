import {Component} from '../base/Component';
import {IEvents} from '../base/Events';
import {ensureElement} from '../../utils/utils';
//import {GalleryData} from "../../types";

// работа с инпут
//const inputElement = document.getElementById('inputId') as HTMLInputElement;
//const value = inputElement.value;
//console.log(value);
//  // inputElement.addEventListener('input', (event: Event) => {
    //   const inputValue = (event.target as HTMLInputElement).value;
    //   console.log('Input value:', inputValue);}

interface IHeader {  
  counter: number; 
}  

export class Header extends Component<IHeader> {
    protected counterElement: HTMLElement;
    protected basketButton: HTMLButtonElement;

    constructor(protected events:IEvents, container: HTMLElement) {
        super(container);

        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);


        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    // Инструментарий для работы с DOM в дочерних компонентах
    set counter(value: number) {
        this.counterElement.textContent = String(value);
    }
}
