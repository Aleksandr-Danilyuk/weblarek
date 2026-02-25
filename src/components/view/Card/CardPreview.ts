import {Card} from './Card';
import {ensureElement} from '../../../utils/utils';
import { IProduct } from '../../../types';
import { categoryMap } from '../../../utils/constants';
import {IEvents} from '../../base/Events';

//type ICardPreviewActions = { onClick: (event: PointerEvent) => void };

type CategoryKey = keyof typeof categoryMap;
type ICardPreview = Pick<IProduct, 'description' | 'image' |  'category'> & {textCardButton?: string} & {buttonState?: boolean}; 

export class CardPreview extends Card<ICardPreview>  {
    protected descriptionElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected cardButton: HTMLButtonElement;

    //constructor(protected events:IEvents, container: HTMLElement, actions?: ICardPreviewActions) {
    constructor(protected events:IEvents, container: HTMLElement) {
        super(container);

        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.cardButton.addEventListener('click', () => 
            this.events.emit('card:add')     // На кнопку привязываем событие добавление товара в корзину
        );

        // this.description = item.description;
        // this.category = item.category;
        // this.image = item.image;
        // this.price = item.price;
        // this.title = item.title;

        // if (actions?.onClick) {
        //     this.cardButton.addEventListener('click', actions.onClick)
        // };

        
        // if (super.price === null) {
        //     this.buttonState = true;
        // } else {
        //     this.buttonState = false;
        // };

        // this.textCardButton = 'Купить';      // Отрисовываем кнопку Купить

    };

    set description(value: string) {
        this.descriptionElement.textContent = value;
    };

    set category(value: string) {
        this.categoryElement.textContent = value;

        for (const key in categoryMap) {
            this.categoryElement.classList.toggle(categoryMap[key as CategoryKey], key === value);
        };
    };

    set image(value: string) {
        this.setImage(this.imageElement, value, this.title);
    };

    // disabledButton(){
    //     this.cardButton.disabled = true;
    // };

    // enabledButton(){
    //     this.cardButton.disabled = false;
    // };


    set buttonState(value: boolean) {
        this.cardButton.disabled = value;
    };

    set textCardButton(value: string) {
        this.cardButton.textContent = value;
    };
};
