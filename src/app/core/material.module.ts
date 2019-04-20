import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatInputModule,
  MatTableModule,
  MatToolbarModule,
  MatMenuModule,
  MatIconModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSnackBarModule,
  MatStepperModule,
  MatProgressSpinnerModule
} from '@angular/material';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';


@NgModule({
    imports: [
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatDialogModule,
        MatTableModule,
        MatMenuModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatFormFieldModule,
        MatExpansionModule,
        MatDatepickerModule,
        MatBadgeModule,
        MatNativeDateModule,
        MatSnackBarModule,
        MatCheckboxModule,
        MatDividerModule,
        MatStepperModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatChipsModule
    ],
    exports: [
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatDialogModule,
        MatTableModule,
        MatMenuModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatFormFieldModule,
        MatExpansionModule,
        MatDatepickerModule,
        MatBadgeModule,
        MatNativeDateModule,
        MatSnackBarModule,
        MatCheckboxModule,
        MatDividerModule,
        MatStepperModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatChipsModule
    ],
}) export class CustomMaterialModule { }
