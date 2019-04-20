export class MyPositionSummary {

    coordinates: [number, number] = undefined;
    count: number = undefined;

    constructor (
        coordinates?: [number, number],
        count?: number) {
            this.coordinates = coordinates;
            this.count = count;
    }

}
