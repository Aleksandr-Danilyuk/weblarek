import {Card} from './Card';
import {ensureElement} from '../../../utils/utils';
// import { IProduct } from '../../../types';
import { categoryMap } from '../../../utils/constants';


// Шаблон для работы с инпут
//const inputElement = document.getElementById('inputId') as HTMLInputElement;
//const value = inputElement.value;
//console.log(value);
//  // inputElement.addEventListener('input', (event: Event) => {
    //   const inputValue = (event.target as HTMLInputElement).value;
    //   console.log('Input value:', inputValue);}


// Пример определения ICardActions с функцией
type ICardActions = { onClick: (event: PointerEvent) => void };
// При создании экземпляра CardCatalog передайте функцию:
//      const cardCatalog = new CardCatalog(container, {
//          onClick: (event) => {console.log('Card selected');}
//      });


type CategoryKey = keyof typeof categoryMap;
// export type ICardCatalog = Pick<IProduct, 'image' |  'category'>; 

export class CardCatalog extends Card  {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);


        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick)
        };
    }

    // Инструментарий для работы с DOM в дочерних компонентах

    set category(value: string) {
        this.categoryElement.textContent = value;

        for (const key in categoryMap) {
            this.categoryElement.classList.toggle(categoryMap[key as CategoryKey], key === value);
        }
    }

    set image(value: string) {
        this.setImage(this.imageElement, value, this.title);
    }

}
