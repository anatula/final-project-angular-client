import { Point } from 'geojson';
import { MyFile } from 'src/app/models/myFile';
import { Marker } from 'leaflet';

export class MyPosition {
    id: string = undefined;
    timestamp: number = undefined;
    location: Point = undefined;
    file: MyFile = undefined;
    marker: Marker = undefined;

    constructor (id?: string,
                 timestamp?: number,
                 location?: Point,
                 file?: MyFile
                ) {
        this.id = id;
        this.timestamp = timestamp;
        this.location = location;
        this.file = file;
    }

    setMarker(marker: Marker) {
        this.marker = marker;
    }
}
