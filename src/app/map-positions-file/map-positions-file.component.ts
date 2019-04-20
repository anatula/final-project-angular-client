import { MatSnackBar } from '@angular/material';
import { FilesService } from './../services/files.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tileLayer, latLng, Map, Icon, icon, Marker } from 'leaflet';
import * as L from 'leaflet';
import 'leaflet.markercluster';

@Component({
  selector: 'app-map-positions-file',
  templateUrl: './map-positions-file.component.html',
  styleUrls: ['./map-positions-file.component.css']
})
export class MapPositionsFileComponent implements OnInit {

  fileId: string;
  private sub: any;
  getting = false;

  defaultIcon: Icon = icon({
    iconSize: [25, 41],
    iconAnchor: [13, 41],
    iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
    iconUrl: 'assets/leaflet/marker-icon.png',
    shadowUrl: 'assets/leaflet/marker-shadow.png'
  });


  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors'
      })
    ],
    zoom: 1,
    center: latLng([45.116177, 7.742615])
  };

  map: Map;

  // Marker cluster stuff
  markerClusterGroup: L.MarkerClusterGroup;
  markerClusterData: any[] = [];
  markerClusterOptions: L.MarkerClusterGroupOptions;

  constructor(private fileService: FilesService, private route: ActivatedRoute, private snackBar: MatSnackBar) { }

  ngOnInit() {

    Marker.prototype.options.icon = this.defaultIcon;

    this.sub = this.route.params.subscribe(
      params => {
        this.fileId = params['fileId'];
        this.getting = true;
        this.fileService.getPositionsGivenFileId(this.fileId).subscribe(

          result => {
            // console.log(data);

            const data: any[] = [];

            result.forEach((pos) => {

              // console.log(pos);

              // const myMarker = new Marker(latLng(pos.location.coordinates[0][1], pos.location.coordinates[0][0]));
              // this.map.addLayer(myMarker);

              data.push(L.marker(latLng(pos.location.coordinates[0][1], pos.location.coordinates[0][0])));


            });

            this.markerClusterData = data;

          },
          error => {
            // console.log('Can not connect with server');
            // console.log(error);
            this.getting = false;
            if (error.error.error_description) {
              this.openSnackBar(error.error.error_description, 'OK');
            } else {
              this.openSnackBar(error.message, 'OK');
            }
          },
          () => {
            // 'onCompleted' callback.
            this.getting = false;
          }
        );
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onMapReady(map: Map): void {
    this.map = map;
    console.log('on ready map');

  }

  markerClusterReady(group: L.MarkerClusterGroup) {
    this.markerClusterGroup = group;
  }

}
