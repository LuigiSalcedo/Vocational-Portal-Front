import { Component, inject, NgModule } from '@angular/core';
import { CareerItemComponent } from '../components/career-item/career-item.component';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Host } from '../../../assets/api-config.model';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Subject } from 'rxjs';
import { query } from '@angular/animations';


@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CareerItemComponent, ReactiveFormsModule, FormsModule, HttpClientModule, NgFor, NgClass, CommonModule, NgIf],
  templateUrl: './careers.component.html',
  styleUrl: './careers.component.css'
})
export class CareersComponent {

  page: number = 1;
  search = '';
  filter = '';

  searchControl = new FormControl('');
  optionClickSubject = new Subject<any>();
  http = inject(HttpClient);

  optionsTo: any[];


  isSelecting: boolean = false;

  constructor() {
    this.optionsTo = []
  }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500)
      ).subscribe(query => {
        this.search = !query ? '' : query;
      })

    if (this.optionsTo.length === 0) {
      this.http.get<any[]>(Host.host + '/areas')
        .subscribe((data: any[]) => {

          this.optionsTo = data;

          console.log("Areas obtenidas")
          console.log(data)
        });
    }

    // Observable para realizar la acción después de un tiempo de espera
    this.optionClickSubject.pipe(
      debounceTime(1500),
    ).subscribe(query => {

      this.filter = query;
      this.isSelecting = false;
      console.log('Variable actualizada después de hacer clic');
    });

  }

  get optionsToDisplay(): any[] | any {

    return this.optionsTo
  }

  ListAreas: Set<number> = new Set();

  optionOnClick(number: any) {

    if (!this.ListAreas.has(number)) {
      this.ListAreas.add(number)
      console.log("add", number)
    } else {
      this.ListAreas.delete(number)
      console.log("remove", number)
    }

    this.isSelecting = true;
    this.optionClickSubject.next(JSON.stringify(Array.from(this.ListAreas)));
  }

  valorSlider: number = 50;

  onSliderChange() {
    this.optionClickSubject.next(JSON.stringify(Array.from(this.ListAreas)));
  }

  selectedOption: string = '1';

  onOptionChange(event: any) {
    this.selectedOption = event.target.value;

    if(this.selectedOption == '1'){
        this.filter = '';
        this.search = '';
    }

  }

}
