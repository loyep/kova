export interface BaseResponseOption {
    data?: any
}

interface Response<T> {
}

export class BaseResponse implements Response<BaseResponse> {
    private data: any

    public constructor(data: any = {}, opts: BaseResponseOption = {}) {
        this.data = data
    }

    toJSON() {
        return this.data
    }
}
