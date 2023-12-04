import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Host, Oferta } from '../../../assets/api-config.model';
import { CommonModule, NgFor } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [HttpClientModule, NgFor, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css'
})
export class OffersComponent implements OnInit {

  http = inject(HttpClient);

  constructor(private route: ActivatedRoute) {

  }

  searchControl = new FormControl('');
  defaultValue = '';

  @Input() data : Oferta[] = []

  search = '';
  load = false;

  ngOnInit() {

    this.searchControl.valueChanges
      .subscribe(query => {
        this.load = false;
      })

    this.searchControl.valueChanges
      .pipe(
        debounceTime(500)
      ).subscribe(query => {

        this.search = !query ? '' :  "/nombre/" + query;

        this.http.get<Oferta[]>(Host.host + '/ofertas' + this.search)
          .subscribe((data: Oferta[]) => {
            
            this.load = true;
            this.data = data;

            console.log(data)
          });
   
      })

    this.route.paramMap.subscribe(params => {
      const idElemento = params.get('id');
      this.load = false;
      if (idElemento) {
        console.log(idElemento)

        const params = new HttpParams()
          .set('programa', idElemento)
  
        this.http.get<Oferta[]>(Host.host + '/ofertas', { params })
          .subscribe((data: Oferta[]) => {
            
            this.data = data;
            this.load = true;

            this.defaultValue = this.data[0].nombre.split(' ')[0];
  
          });


      } else {
        console.log("none")
      }
    });

  }

  page = 1;
  limit_pages = 10;

  datatodisplay: Oferta[] = []

  get itemsToDisplay(): Oferta[] | any{

    if(this.data.length === 0){

      this.http.get<Oferta[]>(Host.host + '/ofertas')
      .subscribe((data: Oferta[]) => {
        
        this.load = true;
        this.data = data;
      });

    }

    const startIndex = (this.page - 1) * this.limit_pages;

    let endIndex = startIndex + this.limit_pages;

    this.datatodisplay = this.data.slice(startIndex, endIndex);
    return this.datatodisplay;

  }

  get calculatedPage(): number {
    return Math.round((this.data.length / this.limit_pages));
  }

  onKeyDown() {
    console.log("key")
    this.load = false;
  }

}
