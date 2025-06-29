import { Component, inject, signal, computed, effect } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditElementDialog } from './edit-dialog.component';
import { debounceTime, Subject } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
  providers: [
    EditElementDialog
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  columns = ['position', 'name', 'weight', 'symbol', 'actions'];
  dialog = inject(MatDialog);
  data = signal<PeriodicElement[]>([]);
  isLoading = signal(true);
  filterValue = '';
  actualFilterValue = signal('');
  private filterChanged = new Subject<string>();

  constructor() {
    setTimeout(() => {
      this.data.set(ELEMENT_DATA);
      this.isLoading.set(false);
    }, 2000);

    this.filterChanged.pipe(debounceTime(2000)).subscribe((value) => {
      this.actualFilterValue.set(value);
    });
  }

  filtered = computed(() => {
    const value = this.actualFilterValue().toLowerCase();
    if (!value) return this.data();
    
    return this.data().filter(e =>
      e.name.toLowerCase().includes(value) ||
      e.symbol.toLowerCase().includes(value) ||
      e.position.toString().includes(value) ||
      e.weight.toString().includes(value)
    );
  });

  onFilterChange() {
    this.filterChanged.next(this.filterValue);
  }

  editElement(element: PeriodicElement) {
    const dialogRef = this.dialog.open(EditElementDialog, {
      data: { ...element },
    });

    dialogRef.afterClosed().subscribe((result: PeriodicElement) => {
      if (result) {
        const updated = this.data().map((e) =>
          e.position === element.position ? result : e
        );
        updated.sort((a, b) => a.position - b.position);
        this.data.set(updated);
      }
    });
  }
}
