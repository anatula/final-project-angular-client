import { PurchaseService } from './../services/purchase.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MyFile } from '../models/myFile';
import { FilesService } from '../services/files.service';
import { MatSnackBar } from '@angular/material';

/*
download a object as a file:
https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
https://stackoverflow.com/questions/36916368/download-object-as-formatted-json-file
*/

@Component({
  selector: 'app-upload-download',
  templateUrl: './upload-download.component.html',
  styleUrls: ['./upload-download.component.css']
})
export class UploadDownloadComponent implements OnInit {

  files: MyFile[];
  purchasedFiles: MyFile[];
  invalidfile = true;

  uploading = false;
  downloadingListOwned = true;
  downloadingListPurchased = true;
  @ViewChild('inputFile')
  file: ElementRef;

  constructor(private fileService: FilesService,
    private purchaseService: PurchaseService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getListOfFiles();
    this.getListOfPurchasedFiles();
  }


  getListOfPurchasedFiles() {
    console.log('getListOfFiles() ');
    this.fileService.getListOfFilePurchased().subscribe(
      data => this.purchasedFiles = data
      ,
      error => {
        // console.log('Can not connect with server');
        // console.log(error);
        if (error.error.error_description) {
          this.openSnackBar(error.error.error_description, 'OK');
        } else {
          this.openSnackBar(error.message, 'OK');
        }
      },
      () => {
        // 'onCompleted' callback.
        this.downloadingListPurchased = false;
      }
    );
  }

  getListOfFiles() {
    this.files = [];
    console.log('getListOfFiles() ');
    this.fileService.getListOfFilesUploaded().subscribe(
      data => {
        data.forEach(file => {
          console.log('we4343');
          console.log(file);
          if (!file.deletedByOwner) {
            // get counter
            this.getCounter(file);
            console.log('Counter for file ' + file.id + ' : ' + file.counter);
            this.files.push(file);
          }
        });
      },
      error => {
        // console.log('Can not connect with server');
        // console.log(error);
        if (error.error.error_description) {
          this.openSnackBar(error.error.error_description, 'OK');
        } else {
          this.openSnackBar(error.message, 'OK');
        }
      },
      () => {
        // 'onCompleted' callback.
        this.downloadingListOwned = false;
      }
    );
  }

  fileChanged() {
    console.log('fileChanged() called');
    if (this.file.nativeElement.files[0] !== null) {
      if (this.file.nativeElement.files[0].type === 'application/json') {
        // this.filename = this.file.nativeElement.files[0].name;
        this.invalidfile = false;
      } else {
        console.log('Inserire un file in formato json', 'OK');
      }
    }
  }

  submit() {
    console.log('submit() called');
    const fileReader = new FileReader();
    fileReader.onload = () => {
      console.log(fileReader.result);
      this.uploading = true;
      this.fileService.uploadFile(fileReader.result).subscribe(
        (resp) => {
          console.log(resp);
          this.uploading = false;
          this.openSnackBar('Upload performed correctly', 'OK');
          this.reset();
          this.getListOfFiles();
        },
        error => {
          // console.log('Can not connect with server');
          // console.log(error);
          this.uploading = false;
          if (error.error.error_description) {
            console.log()
              ; this.openSnackBar(error.error.error_description, 'OK');
          } else {
            this.openSnackBar(error.message, 'OK');
          }
          this.reset();
          this.getListOfFiles();
        },
        () => {
          console.log('Everything OK!');
        }
      );
    };
    fileReader.readAsText(this.file.nativeElement.files[0]);
  }

  reset() {
    this.file.nativeElement.value = '';
    this.invalidfile = true;
    console.log('finished reset()');
  }

  downloadFile(id: String) {
    //console.log('downloadFile() called' + id);
    // call to get the positions from the file given the file id
    this.fileService.getPositionsGivenFileId(id).subscribe(
      data => {
        //console.log(data);
        const toDownload: any[] = [];

        data.forEach((pos) => {
          //console.log(pos);
          toDownload.push({ 'id': pos.id, 'timestamp': pos.timestamp, 'location': pos.location });
        });

        const theJSON = JSON.stringify(toDownload);
        const downloadJsonHref = 'data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON);
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', downloadJsonHref);
        downloadAnchorNode.setAttribute('download', id + '.json');
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        console.log('Download OK');

      },
      error => {
        // console.log('Can not connect with server');
        // console.log(error);
        if (error.error.error_description) {
          this.openSnackBar(error.error.error_description, 'OK');
        } else {
          this.openSnackBar(error.message, 'OK');
        }
      },
      () => {
        // 'onCompleted' callback.
        // No errors, route to new page here
      }
    );
  }

  deleteFile(id: String) {
    this.fileService.deleteFile(id).subscribe(
      () => {
        console.log('File Deleted OK');
        this.openSnackBar('File ' + id + ' deleted', 'OK');
        this.getListOfFiles();
      },
      error => {
        // console.log('Can not connect with server');
        // console.log(error);
        if (error.error.error_description) {
          this.openSnackBar(error.error.error_description, 'OK');
        } else {
          this.openSnackBar(error.message, 'OK');
        }
      },
      () => {
        console.log('Error: could not delete file');
      }
    );
  }

  getCounter(file: MyFile) {
    console.log('in this.getCount()');

    this.purchaseService.getCount(file.id).subscribe(
      value => {
        console.log('OK - value: ' + value);
        file.counter = value;
      },
      error => {
        // console.log('Can not connect with server');
        // console.log(error);
        if (error.error.error_description) {
          this.openSnackBar(error.error.error_description, 'OK');
        } else {
          this.openSnackBar(error.message, 'OK');
        }
      },
      () => {
        // 'onCompleted' callback.
        // No errors, route to new page here
      }
    );

  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}

