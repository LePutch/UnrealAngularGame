import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogNavyData } from '../app.component';



@Component({
  selector: 'app-navypopup',
  templateUrl: './navypopup.component.html',
  styleUrls: ['./navypopup.component.scss'],

})
export class NavypopupComponent {
  constructor(
    public dialogRef: MatDialogRef<NavypopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogNavyData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
