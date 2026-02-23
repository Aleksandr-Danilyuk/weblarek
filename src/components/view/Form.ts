import {Component} from '../base/Component';
import {ensureElement} from '../../utils/utils';

interface IForm {  
  validationError: string; 
};

export class Form<T> extends Component<IForm & T> {
    protected formErrorsElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.formErrorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
    };

    set validationError(value: string) {
        this.formErrorsElement.textContent = String(value);
    };
};
