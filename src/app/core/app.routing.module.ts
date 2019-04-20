import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from '../services/auth-guard.service';

import { LoginComponent } from '../login/login.component';
import { HomeComponent } from '../home/home.component';
import { RegistrationComponent } from '../registration/registration.component';
import { SearchComponent } from '../search/search.component';
import { UploadDownloadComponent } from '../upload-download/upload-download.component';
import { MapPositionsFileComponent } from './../map-positions-file/map-positions-file.component';
import { NotFoundComponent } from './../not-found/not-found.component';

// https://angular-2-training-book.rangle.io/handout/routing/routeparams.html

const routes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },

  {
    path: 'search',
    component: SearchComponent,
    canActivate: [AuthGuardService]
  },

  {
    path: 'upload-download',
    component: UploadDownloadComponent,
    canActivate: [AuthGuardService]
  },

  {
    path: 'map-positions-file/:fileId',
    component: MapPositionsFileComponent,
    canActivate: [AuthGuardService]
  },

  { path: '**', component: NotFoundComponent }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
