import {Component} from '../base/Component';
import {IEvents} from '../base/Events';
import {ensureElement} from '../../utils/utils';

interface IModal {  
  content: HTMLElement; 
};

export class Modal extends Component<IModal> {
    protected modalCloseButton: HTMLButtonElement;
    protected modalContent: HTMLElement;
    
    constructor(protected events:IEvents, container: HTMLElement) {
        super(container);

        this.modalCloseButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.modalContent = ensureElement<HTMLElement>('.modal__content', this.container);
        
        this.modalCloseButton.addEventListener('click', () => {
            this.container.classList.toggle('modal_active');
        });

        // Закрываем модальное окно если клик был сделан вне модального окна и его дочерних элементов
        document.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.container.classList.remove('modal_active'); 
            };
        });
    };

    set content(value: HTMLElement) {
        this.modalContent.innerHTML = '';
        this.modalContent.appendChild(value);
    };

    close() {
        this.container.classList.remove('modal_active');
    };

    show() {
        this.container.classList.add('modal_active');
    };
};

