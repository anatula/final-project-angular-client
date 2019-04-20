import { ActivatedRoute, Router } from '@angular/router';
import { MyFileSummary } from './../models/myFileSummary';
import { MyPositionSearch } from './../models/myPositionSearch';
import { catchError } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';

import { ConfirmationDialogComponentComponent } from './confirmation-dialog-component/confirmation-dialog-component.component';
import { MyPosition } from './../models/myPosition';
import { MyUser } from './../models/myUser';

import { PurchaseService } from './../services/purchase.service';
import { AuthService } from './../services/auth.service';
import { UsersService } from './../services/users.service';
import { PositionService } from './../services/position.service';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';

import { latLng, tileLayer, Marker, FeatureGroup, Polygon, LatLng, divIcon } from 'leaflet';
import { Map as MapLeaflet } from 'leaflet';

import { MatListOption } from '@angular/material/list';
import { MatDialog, MatDialogConfig, MatInput, MatVerticalStepper, MatSnackBar, MatDatepickerInputEvent } from '@angular/material';
import { getLocaleExtraDayPeriodRules } from '@angular/common';

// https://github.com/Asymmetrik/ngx-leaflet-draw
// https://gis.stackexchange.com/questions/54454/disable-leaflet-interaction-temporary

declare var HeatmapOverlay;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @ViewChild(MatVerticalStepper) stepper: MatVerticalStepper;

  searching = false;
  step1Completed = false;
  step2Completed = false;

  polygon: Polygon;

  // Map Properties--

  map: MapLeaflet;
  editableLayers = new FeatureGroup();
  drawPluginOptions = {
    draw: {
      polygon: {
        allowIntersection: false, // Restricts shapes to simple polygons
        drawError: {
          color: '#e1e100', // Color the shape will turn when intersects
          message: '<strong>You can not draw that!' // Message that will show when intersect
        },
        shapeOptions: {
          color: '#97009c'
        }
      },
      // disable toolbar item by setting it to false
      marker: false,
      polyline: false,
      circle: false,
      rectangle: false,
      circlemarker: false,
    },
    edit: {
      featureGroup: this.editableLayers, // REQUIRED!!
      remove: true,
      edit: false,
    }
  };

  // To store the heatmap data
  data = {
    data: []
  };

  heatmapLayer = new HeatmapOverlay({
    radius: 0.01,
    maxOpacity: 0.8,
    scaleRadius: true,
    blur: .75,
    latField: 'lat',
    lngField: 'lng',
    valueField: 'count'
  });

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 15,
          minZoom: 5
        }),
      this.heatmapLayer
    ],
    zoom: 10,
    center: latLng([45.116177, 7.742615])
  };

  datePickerForm: FormGroup;
  selectionListForm: FormGroup;

  // counters for the badges
  polygonCounter: number;
  timestampCounter: number;

  // async directive
  users$: Observable<{}>;
  errorLoading$ = new Subject<boolean>();

  constructor(
    private positionService: PositionService,
    private authService: AuthService,
    private userService: UsersService,
    private purchaseService: PurchaseService,
    private _fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private zone: NgZone, // Inject the Angular zone reference
    private router: Router,
  ) { }

  ngOnInit() {
    this.users$ = this.userService.getListOfUsers().pipe(
      catchError((error) => {
        console.error('error loading the list of users', error);
        this.errorLoading$.next(true);
        return of();
      })
    );

    this.initForms();

    this.polygonCounter = 0;
    this.timestampCounter = 0;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  removePolygons(): void {
    this.map.eachLayer((layer) => {
      if (layer instanceof Polygon) {
        this.map.removeLayer(layer);
      }
    });
  }

  removeMarkers(): void {
    this.map.eachLayer((layer) => {
      if (layer instanceof Marker) {
        this.map.removeLayer(layer);
      }
    });
  }

  resetMap() {
    this.removePolygons();
    this.removeMarkers();
  }

  onMapReady(map: MapLeaflet): void {

    console.log('onMapReady');
    this.map = map;

    this.map.addLayer(this.editableLayers);

    this.map.on('draw:created', this.onMapDrawed, this);
    // I need both!! move and zoom
    this.map.on('moveend', this.onChangedMap, this);
    // this.map.on('zoomend', this.onZoomChangedMap, this);
    this.map.on('draw:deleted', this.onDeletedFromMap, this);
    console.log('Map done');

    this.getPositions();

  }

  onChangedMap() {
    this.step1Completed = false;
    this.zone.run(() => {
      this.polygonCounter = 0;
    });
    console.log('changed map');
    this.resetMap();
    this.getPositions();
    this.polygon = undefined;
  }

  onDeletedFromMap() {
    this.zone.run(() => {
      this.polygonCounter = 0;
    });
    this.step1Completed = false;
    console.log('deleted polygon');
    this.polygon = undefined;
  }

  onMapDrawed(e): void {
    this.resetMap();
    console.log(e.constructor.name);
    console.log(e.layer);
    console.log('polygon finished');
    console.log(e.layer.toGeoJSON().geometry);
    this.polygon = e.layer.toGeoJSON().geometry;

    let counter = 0;
    if (e.layer instanceof Polygon) {
      let po: Polygon;
      po = e.layer;
      this.data.data.forEach( p =>  {
        console.log(p);
        if (po.getBounds().contains([p.lat, p.lng])) {
          console.log('contained!');
          counter = counter + p.count;
        }
      });
      console.log(counter);
      // this.polygonCounter = counter;
      this.zone.run(() => {
        this.polygonCounter = counter;
      });
      if (this.polygonCounter > 0) {
        this.step1Completed = true;
      }
    }
    console.log(this.polygonCounter);
  }

  getPositions() {

    const coords: LatLng [] = [];
    this.data.data = [];

    const bounds = this.map.getBounds();
    const sw = bounds.getSouthWest();
    const se = bounds.getSouthEast();
    const nw = bounds.getNorthWest();
    const ne = bounds.getNorthEast();

    coords.push(nw);
    coords.push(ne);
    coords.push(se);
    coords.push(sw);
    coords.push(nw);

    const mypoly = new Polygon(coords);
    // console.log(mypoly.toGeoJSON().geometry);

    this.positionService.getPositionInPoly(JSON.stringify(mypoly.toGeoJSON().geometry))
    .subscribe(
      result => {

        const radius = this.getRadiusBasedOnZoom();

      // console.log(data);
      result.forEach(
        item => {
          // console.log(item);

          this.data.data.push({
            lat: item.coordinates[1],
            lng: item.coordinates[0],
            count: item.count,
            radius: radius
          });

        });

        this.heatmapLayer.setData(this.data);
    },
      error => {
        console.log(error);
      },
      () => {
        // 'onCompleted' callback.
      }

    );
  }


  disableMap() {
    this.map.dragging.disable();
    this.map.touchZoom.disable();
    this.map.doubleClickZoom.disable();
    this.map.scrollWheelZoom.disable();
    this.map.boxZoom.disable();
    this.map.keyboard.disable();
    if (this.map.tap) { this.map.tap.disable(); }
    document.getElementById('map-id').style.cursor = 'default';

    this.drawPluginOptions.edit.remove = false;

  }

  enableMap() {
    this.map.dragging.enable();
    this.map.touchZoom.enable();
   this.map.doubleClickZoom.enable();
   this.map.scrollWheelZoom.enable();
   this.map.boxZoom.enable();
  this.map.keyboard.enable();
  if (this.map.tap) { this.map.tap.enable(); }
  document.getElementById('map-id').style.cursor = 'grab';
  }

  initForms() {

    this.datePickerForm = this._fb.group({
      'startDate': [null, Validators.required],
      'endDate': [null, Validators.required]
    }, {
        validator: (fg: FormGroup) => {
          const date1 = fg.get('startDate').value;
          const date2 = fg.get('endDate').value;
          if ((date1 !== null && date2 !== null) && (date1 > date2)) {
            return { 'dates': true };
          }
        }
      });

  }

  search(userList: MatListOption[]) {
    console.log('SEARCH!!!!');

    const userIds: string[] = [];
    userList.forEach(
      user => {
        userIds.push(user.value);
        console.log(user);
      }
    );

    console.log(this.datePickerForm.get('startDate').value.valueOf());
    console.log(this.datePickerForm.get('endDate').value.valueOf());
    console.log(this.polygon);

    const search = new MyPositionSearch(
      this.polygon,
      this.datePickerForm.get('startDate').value.valueOf(),
      this.datePickerForm.get('endDate').value.valueOf(),
      userIds
    );

    this.searching = true;

    this.positionService.getPositionSearch(JSON.stringify(search))
    .subscribe(
      (result: MyFileSummary[]) => {
        // Handle result
          this.searching = false;
          this.handleSearchResult(result);
      },
      error => {
        console.log(error);
      },
      () => {
        // 'onCompleted' callback.
        // No errors, route to new page here
      }
    );
  }



  handleSearchResult(result: MyFileSummary[]) {

      const filesIdToPurchase: string [] = [];
      const filesToPurchase: MyFileSummary[] = [];
      const filesAlreadyPurchased: MyFileSummary[] = [];

      result.forEach(
        fileSummary => {
          console.log('File ' + fileSummary.file.id + ' with count : ' + fileSummary.count);
          if (fileSummary.purchased) {
            filesAlreadyPurchased.push(fileSummary);
          } else {
            filesToPurchase.push(fileSummary);
            filesIdToPurchase.push(fileSummary.file.id);
          }
        }
      );

      const dialogConfig = new MatDialogConfig();

      dialogConfig.data = {
        filesToPurchase: filesToPurchase,
        filesAlreadyPurchased: filesAlreadyPurchased
      };

      const dialogRef = this.dialog.open(ConfirmationDialogComponentComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(
        confirmation => {

        console.log('Dialog output:', confirmation);

        if (confirmation) {
          // send POST request to /purchases

          this.purchaseService.createPurchase(JSON.stringify(filesIdToPurchase))
            .subscribe(
              (resp) => {
                console.log(resp);
                this.openSnackBar('Purchase done', 'OK');
              },
              err => {
                if (err.status) {
                  console.log(err.error.message);
                } else {
                  console.log('There was an error');
                  // this.resetSearch();
                }
              },
              () => {
                // 'onCompleted' callback.
                this.router.navigate(['/upload-download']);
              }
            );
        }
      }

      );
  }

  updateDate(date: MatDatepickerInputEvent<Date>) {

    this.step2Completed = false;

    if (!this.datePickerForm.invalid) {

      const startDate = this.datePickerForm.get('startDate').value.valueOf();
      const endDate = this.datePickerForm.get('endDate').value.valueOf();

      this.positionService.getCounterTimestamp(JSON.stringify(startDate), JSON.stringify(endDate))
      .subscribe(
        (resp) => {
          console.log('Counter OK');
          console.log(resp);
          this.timestampCounter = resp;
        },
        err => {
          if (err.status) {
            console.log(err.error.message);
          } else {
            console.log('Counter There was an error');
          }
        },
        () => {
          // 'onCompleted' callback.
          if (this.timestampCounter > 0) {
          this.step2Completed = true;
        }
      }
      );
    }
  }

  getRadiusBasedOnZoom() {

    const currentZoom = this.map.getZoom();
    let radius;

    if (currentZoom === 5) {
        radius = 0.5;
    } else if (currentZoom === 6) {
        radius = 0.3;
    } else if (currentZoom === 7) {
        radius = 0.1;
    } else if (currentZoom === 8) {
        radius = 0.05;
    } else if (currentZoom === 9) {
        radius = 0.03;
    } else if (currentZoom === 10) {
        radius = 0.01;
    } else if (currentZoom === 11) {
        radius = 0.007;
    } else if (currentZoom === 12) {
        radius = 0.005;
    } else if (currentZoom === 13) {
        radius = 0.003;
    } else if (currentZoom === 14) {
        radius = 0.002;
    } else if (currentZoom === 15) {
        radius = 0.001;
    }

    return radius;
}


}
