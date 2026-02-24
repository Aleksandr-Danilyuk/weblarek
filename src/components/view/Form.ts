import {Component} from '../base/Component';
import {ensureElement} from '../../utils/utils';
import {IEvents} from '../base/Events';

interface IForm {  
  validationError: string; 
};

export class Form<T> extends Component<IForm & T> {
    protected formErrorsElement: HTMLElement;
    protected formButtonSubmit: HTMLButtonElement;

    constructor(protected events:IEvents, container: HTMLElement) {
        super(container);

        this.formErrorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
        this.formButtonSubmit = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);

        this.container.addEventListener('submit', (event: Event) => {  // Установку слушателя: используется название формы как часть названия события
            event.preventDefault();
            this.events.emit(`${this.container.getAttribute('name')}:submit`);
        });
    };

    set validationError(value: string) {
        this.formErrorsElement.textContent = String(value);
    };

    set buttonState(value: boolean) {
        this.formButtonSubmit.disabled = value;
    };
};
