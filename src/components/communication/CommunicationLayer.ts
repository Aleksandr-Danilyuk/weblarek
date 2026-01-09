import { IApi } from "../../types";
import { IProduct } from "../../types";

export class CommunicationLayer {
    protected CommunicationApi: IApi;

    constructor(Api: IApi) {
        this.CommunicationApi = Api;
    }

    async getProduct():  Promise<IProduct[]> {
        return this.CommunicationApi.get('/product/');
    }

    async postBuy(data: object) {
        return this.CommunicationApi.post("/order/", data);
    }
}
