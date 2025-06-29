import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { PeriodicElement } from './app.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'edit-element-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditElementDialog {
  constructor(
    public dialogRef: MatDialogRef<EditElementDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PeriodicElement
  ) { }

  getStep(): number {
    if (this.data.weight === null || this.data.weight === undefined) {
      return 1;
    }
    const s = this.data.weight.toString();
    const decimalIndex = s.indexOf('.');
    if (decimalIndex === -1) {
      return 1;
    }
    const decimalPlaces = s.length - decimalIndex - 1;
    return Math.pow(10, -decimalPlaces);
  }
}
