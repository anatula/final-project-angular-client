import { MyFileSummary } from './../../models/myFileSummary';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

// https://blog.angular-university.io/angular-material-dialog/

@Component({
  selector: 'app-confirmation-dialog-component',
  templateUrl: './confirmation-dialog-component.component.html',
  styleUrls: ['./confirmation-dialog-component.component.css']
})
export class ConfirmationDialogComponentComponent implements OnInit {

  filesToPurchase: MyFileSummary[];
  filesAlreadyPurchased: MyFileSummary[];

  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

        this.filesToPurchase = data.filesToPurchase;
        this.filesAlreadyPurchased = data.filesAlreadyPurchased;
    }

  ngOnInit() {
  }

  default() {
    this.dialogRef.close({'confirmation': false});
  }

  confirm() {
    this.dialogRef.close({'confirmation': true});
  }

}
