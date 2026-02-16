import {Component} from '../base/Component';
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

interface IModal {  
  content: HTMLElement; 
}  

export class Modal extends Component<IModal> {
    protected modalCloseButton: HTMLButtonElement;
    protected modalContent: HTMLElement;
    

    constructor(protected events:IEvents, container: HTMLElement) {
        super(container);

        this.modalCloseButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.modalContent = ensureElement<HTMLElement>('.modal__content', this.container);
        
        this.modalCloseButton.addEventListener('click', () => {
            this.events.emit('modal:close');
            this.container.classList.toggle('modal_active');
        });
    }

    // Инструментарий для работы с DOM в дочерних компонентах
    set content(value: HTMLElement) {
        this.modalContent.innerHTML = '';
        this.modalContent.appendChild(value);
        // this.modalContent.replaceChild(value, this.modalContent.firstChild);
        this.events.emit('modal:changed');

    }
}

