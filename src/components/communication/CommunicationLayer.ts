import { IApi, IProductsResponse, IOrderRequest, IOrderResponse } from "../../types";

export class CommunicationLayer {
    protected communicationApi: IApi;

    constructor(Api: IApi) {
        this.communicationApi = Api;
    }

    async getProduct():  Promise<IProductsResponse> {
        return this.communicationApi.get<IProductsResponse>('/product/');
    }

    async postBuy(data: IOrderRequest):  Promise<IOrderResponse> {
        return this.communicationApi.post<IOrderResponse>("/order/", data, 'POST');
    }
}
