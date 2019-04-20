export class MyUser {
    id: string = undefined;
    username: string = undefined;
    role: string = undefined;
    accountExpired: boolean = undefined;
    randomColor: string = undefined;
    idFilesPurchased: string [] = undefined;

    constructor(id?: string, username?: string, role?: string, accountExpired?: boolean, idFilesPurchased?: string[]) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.accountExpired = accountExpired;
        this.idFilesPurchased = idFilesPurchased;
    }

    setRandomColor(color: string) {
        this.randomColor = color;
    }
}
