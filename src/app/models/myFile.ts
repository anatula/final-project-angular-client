import { MyUser } from './myUser';

export class MyFile {
    id: string = undefined;
    owner: string = undefined;
    deletedByOwner: boolean = undefined;
    counter: number = undefined;

    constructor(id?: string, owner?: string, deletedByOwner?: boolean) {
        this.id = id;
        this.owner = owner;
        this.deletedByOwner = deletedByOwner;
    }

}
