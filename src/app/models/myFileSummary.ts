import { MyFile } from './myFile';

export class MyFileSummary {

    file: MyFile = undefined;
    count: number = undefined;
    purchased: Boolean = undefined;

    constructor (
        file: MyFile,
        count: number,
        purchased: Boolean) {
            this.file = file;
            this.count = count;
            this.purchased = purchased;
    }

}
