import { IApi, IProduct, IBuyRequest, IOrderRequest } from "../../types";

export class CommunicationLayer {
    protected communicationApi: IApi;

    constructor(Api: IApi) {
        this.communicationApi = Api;
    }

    async getProduct():  Promise<IOrderRequest> {
        return this.communicationApi.get<IOrderRequest>('/product/');
    }

    async postBuy(data: IProduct):  Promise<IBuyRequest> {
        return this.communicationApi.post<IBuyRequest>("/order/", data, 'POST');
    }
}
