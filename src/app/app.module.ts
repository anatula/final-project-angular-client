import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { PositionService } from './services/position.service';
import { FilesService } from './services/files.service';

import { SearchComponent } from './search/search.component';
import { UploadDownloadComponent } from './upload-download/upload-download.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialModule } from './core/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './core/app.routing.module';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';

import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';

import { MatDatepickerModule, MatDialogModule } from '@angular/material';
import { ConfirmationDialogComponentComponent } from './search/confirmation-dialog-component/confirmation-dialog-component.component';
import { MapPositionsFileComponent } from './map-positions-file/map-positions-file.component';
import { environment } from '../environments/environment';
import { NotFoundComponent } from './not-found/not-found.component';


export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegistrationComponent,
    SearchComponent,
    UploadDownloadComponent,
    ConfirmationDialogComponentComponent,
    MapPositionsFileComponent,
    NotFoundComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatDialogModule,
    LeafletMarkerClusterModule.forRoot(),
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: environment.whitelist
      }
    })
  ],

  providers: [
    AuthService,
    AuthGuardService,
    FilesService,
    PositionService,
    MatDatepickerModule,

  ],

  bootstrap: [AppComponent],

  entryComponents: [ConfirmationDialogComponentComponent]

})
export class AppModule { }
