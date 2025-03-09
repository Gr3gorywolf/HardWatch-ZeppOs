import { MessageBuilder } from "./message";
export class MessageInitializer {
    static messageBuilder;
    constructor() {
    }
    static init(){
        let appId;
        if (!hmApp.packageInfo) {
        // appId = XXX // Modify appId
        throw new Error('Set appId,  appId needs to be the same as the configuration in app.json');
        } else {
        appId = hmApp.packageInfo().appId;
        } 
        this.messageBuilder = new MessageBuilder({
            appId,
        });
        this.messageBuilder.connect();
        return this.messageBuilder;
    }
}