import {Component} from '../base/Component';
import {ensureElement} from '../../utils/utils';
//import {GalleryData} from "../../types";

// Шаблон для работы с инпут
//const inputElement = document.getElementById('inputId') as HTMLInputElement;
//const value = inputElement.value;
//console.log(value);
//  // inputElement.addEventListener('input', (event: Event) => {
    //   const inputValue = (event.target as HTMLInputElement).value;
    //   console.log('Input value:', inputValue);}

interface IForm {  
  validationError: string; 
}  

export class Form extends Component<IForm> {
    protected formErrorsElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.formErrorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
    }

    // Инструментарий для работы с DOM в дочерних компонентах
    set validationError(value: string) {
        this.formErrorsElement.textContent = String(value);
    }
}
