import {Component} from '../base/Component';
import {IEvents} from '../base/Events';

interface IGallery {  
  catalog: HTMLElement[]; 
};

export class Gallery extends Component<IGallery> {

    constructor(protected events:IEvents, container: HTMLElement) {
        super(container);
    };

    set catalog(value: HTMLElement[]) {
        this.container.replaceChildren(...value);
    };
};
