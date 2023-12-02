import { Component } from '@angular/core';
import { CareerItemComponent } from '../components/career-item/career-item.component';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CareerItemComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './careers.component.html',
  styleUrl: './careers.component.css'
})
export class CareersComponent {
  page: number = 1;
  search = '';
  filter = '';

  searchControl = new FormControl('');

  ngOnInit() {
    this.searchControl.valueChanges
    .pipe(
      debounceTime(500)
    ).subscribe(query => {
      this.search = !query ? '': query;
    })
  }
}
