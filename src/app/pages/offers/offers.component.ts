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

  @Input() data: Oferta[] = []

  search = '';
  load = false;

  byLink = false;

  ngOnInit() {

    this.http.get<any[]>(Host.host + '/paises')
      .subscribe((data: any[]) => {

        this.optionsdis = data;
      });

    this.http.get<any[]>(Host.host + '/programas')
      .subscribe((data: any[]) => {

        this.optionsPrograma = data;
        console.log(data)

      });

    this.searchControl.valueChanges
      .subscribe(query => {
        this.load = false;
      })

    this.searchControl.valueChanges
      .pipe(
        debounceTime(500)
      ).subscribe(query => {

        
        this.search = !query ? '' : "/nombre/" + query;

        this.http.get<Oferta[]>(Host.host + '/ofertas' + this.search)
          .subscribe((data: Oferta[]) => {

            this.load = true;
            this.data = data;

            console.log(data)
            console.log("entra query")
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
            this.byLink = true;
            console.log("entra link")
          });


      } else {
        console.log("none")
      }
    });

  }

  page = 1;
  limit_pages = 10;

  datatodisplay: Oferta[] = []

  get itemsToDisplay(): Oferta[] | any {

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

  selectedOption: string = '-1';

  onOptionChangePais(event: any) {
    this.selectedOption = event.target.value;

    if(this.selectedOption != '-1'){

      const params = new HttpParams()
      .set('pais', this.selectedOption)

    this.http.get<any[]>(Host.host + '/ciudades', { params })
      .subscribe((data: any[]) => {

        this.optionsdCiudad = data;
      });

    }
    
  }

  selectedOptionCiudad: string = '-1';
  selectedOptionPrograma: string = '-1';
  selectedOptionUniversidad: string = '-1';

  onOptionChangeCiudad(event: any) {
    this.selectedOptionCiudad = '' + event.target.value;

    if(this.selectedOptionCiudad != '-1'){

      const params = new HttpParams()
      .set('ciudad', this.selectedOptionCiudad)
      .set('pais', this.selectedOption)
  
      this.http.get<any[]>(Host.host + '/universidades',{params})
        .subscribe((data: any[]) => {
  
          this.optionsUniversidad = data;
          console.log(data)
  
        });
    }

  }

  onOptionChangePrograma(event: any) {
    this.selectedOptionPrograma = '' + event.target.value;

  }

  onOptionChangeUniversidad(event: any) {
    this.selectedOptionUniversidad = '' + event.target.value;

  }

  filter() {

    this.defaultValue = ''

    let paramss = '';

    if (this.selectedOption != '-1') {
      paramss+= '&pais=' + this.selectedOption
      // console.log('pais',this.selectedOption)
    }
    if (this.selectedOptionCiudad != '-1') {
      paramss+= '&ciudad=' + this.selectedOptionCiudad
     
      // console.log('ciudad',this.selectedOptionCiudad)
    }
    if (this.selectedOptionUniversidad != '-1') {
      paramss+= '&universidad=' + this.selectedOptionUniversidad
      // console.log('universidad',this.selectedOptionUniversidad)
    }
    if (this.selectedOptionPrograma != '-1') {
      paramss+= '&programa=' + this.selectedOptionPrograma
      // console.log('programa',this.selectedOptionPrograma)
    }

    console.log(Host.host + '/ofertas?' + paramss)
    this.load = false;

    this.defaultValue = ''

    this.http.get<Oferta[]>(Host.host + '/ofertas?' + paramss)
    .subscribe((data: Oferta[]) => {

      this.data = data;
      this.load = true;

      console.log("Data que trae:", data);
    });
    
  }

  optionsdis: any[] = [];
  optionsdCiudad: any[] = [];
  optionsPrograma: any[] = [];
  optionsUniversidad: any[] = [];

}
