import { IApi } from "../../types";
import { IBuyer } from "../../types";
import { Api } from "../base/Api";

type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class CommunicationLayer extends Api {
    constructor(Api: IApi, data: IBuyer) {
        
    }

    get(uri: string) {
        return ;
    }

    post(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return ;
    }
}
