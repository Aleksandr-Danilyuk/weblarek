import {Component} from '../base/Component';
import {IEvents} from '../base/Events';
//import {ensureElement} from '../../utils/utils';
//import {GalleryData} from "../../types";

// Шаблон для работы с инпут
//const inputElement = document.getElementById('inputId') as HTMLInputElement;
//const value = inputElement.value;
//console.log(value);
//  // inputElement.addEventListener('input', (event: Event) => {
    //   const inputValue = (event.target as HTMLInputElement).value;
    //   console.log('Input value:', inputValue);}

interface IGallery {  
  catalog: HTMLElement[]; 
}  

export class Gallery extends Component<IGallery> {
    //protected galleryElement: HTMLElement;

    constructor(protected events:IEvents, container: HTMLElement) {
        super(container);

       // this.galleryElement = ensureElement<HTMLElement>('.gallery', this.container);
    }

    // Инструментарий для работы с DOM в дочерних компонентах
    set catalog(value: HTMLElement[]) {
        //this.galleryElement.replaceChildren(...value);
        this.container.replaceChildren(...value);
        this.events.emit('gallery:change');
    }
}
