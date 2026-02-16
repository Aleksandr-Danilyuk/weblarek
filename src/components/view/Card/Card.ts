import {Component} from '../../base/Component';
//import {IEvents} from '../../base/Events';
import {ensureElement} from '../../../utils/utils';
import { IProduct } from '../../../types';
//import {GalleryData} from "../../types";

// Шаблон для работы с инпут
//const inputElement = document.getElementById('inputId') as HTMLInputElement;
//const value = inputElement.value;
//console.log(value);
    // inputElement.addEventListener('input', (event: Event) => {
    //   const inputValue = (event.target as HTMLInputElement).value;
    //   console.log('Input value:', inputValue);}


export type ICard = Pick<IProduct, 'title' | 'price'> 

export abstract class Card<T> extends Component<ICard & T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    }

    // Инструментарий для работы с DOM в дочерних компонентах
    set title(value: string) {
        this.titleElement.textContent = String(value);
    }

    set price(value: number | null) {
        if (value === null) {
            this.priceElement.textContent = 'Бесценно'
        } else {
            this.priceElement.textContent = `${value} синапсов`;
        }
    }
}
