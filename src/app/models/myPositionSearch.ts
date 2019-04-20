import { Polygon } from 'leaflet';

export class MyPositionSearch {
    poly: Polygon = undefined;
    timestampStart: number = undefined;
    timestampEnd: number = undefined;
    userIds: string[] = undefined;

    constructor(poly: Polygon, timestampStart: number, timestampEnd: number, userIds: string[]) {
        this.poly = poly;
        this.timestampStart = timestampStart;
        this.timestampEnd = timestampEnd;
        this.userIds = userIds;
    }
}

