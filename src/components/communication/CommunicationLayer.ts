import { IApi, IProduct, IProductsBuyer } from "../../types";

export class CommunicationLayer {
    protected CommunicationApi: IApi;

    constructor(Api: IApi) {
        this.CommunicationApi = Api;
    }

    async getProduct():  Promise<IProduct[]> {
        return this.CommunicationApi.get('/product/');
    }

    async postBuy(data: IProductsBuyer) {
        return this.CommunicationApi.post("/order/", data);
    }
}
