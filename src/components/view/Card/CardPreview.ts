import {Card} from './Card';
import {ensureElement} from '../../../utils/utils';
import { IProduct } from '../../../types';
import { categoryMap } from '../../../utils/constants';
import {IEvents} from '../../base/Events';

type ICardPreviewActions = { onClick: (event: PointerEvent) => void };

type CategoryKey = keyof typeof categoryMap;
type ICardPreview = Pick<IProduct, 'description' | 'image' |  'category'> & {textCardButton?: string}; 

export class CardPreview extends Card<ICardPreview>  {
    protected descriptionElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected cardButton: HTMLButtonElement;

    constructor(protected events:IEvents, container: HTMLElement, actions?: ICardPreviewActions) {
        super(container);

        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

        if (actions?.onClick) {
            this.cardButton.addEventListener('click', actions.onClick)
        };
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

    disabledButton(){
        this.cardButton.disabled = true;
    };

    enabledButton(){
        this.cardButton.disabled = false;
    };

    set textCardButton(value: string) {
        this.cardButton.textContent = value;
    };
};
