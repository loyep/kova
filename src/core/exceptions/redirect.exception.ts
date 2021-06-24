import { HttpException } from "@nestjs/common";

export class RedirectException extends HttpException {
    private readonly url: string
    constructor(url: string, status: number) {
        super(`redirect ${url}`, status);
        this.url = url;
    }

    getRedirectUrl() {
        return this.url;
    }
}