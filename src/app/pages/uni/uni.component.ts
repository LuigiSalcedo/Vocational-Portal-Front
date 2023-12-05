import { Component, Input, OnInit, inject } from '@angular/core';
import { Host, Universidad } from '../../../assets/api-config.model';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { debounceTime } from 'rxjs/operators';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgFor, CommonModule } from '@angular/common';

@Component({
  selector: 'app-uni',
  standalone: true,
  imports: [HttpClientModule, NgFor, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './uni.component.html',
  styleUrl: './uni.component.css'
})

export class UniComponent implements OnInit{

  http = inject(HttpClient);

  constructor(private route: ActivatedRoute) {

  }

  searchControl = new FormControl('');
  defaultValue = '';

  @Input() data: Universidad[] = []

  search = '';
  load = false;

  byLink = false;

  ngOnInit() {

    this.http.get<any[]>(Host.host + '/paises')
      .subscribe((data: any[]) => {
        console.log('paises')
        this.optionsdis = data;
      });

    this.http.get<any[]>(Host.host + '/ciudades')
      .subscribe((data: any[]) => {
        this.optionsdCiudad = data;
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

        this.http.get<Universidad[]>(Host.host + '/universidades' + this.search)
          .subscribe((data: Universidad[]) => {

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

        this.http.get<Universidad[]>(Host.host + '/Universidads', { params })
          .subscribe((data: Universidad[]) => {

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

  datatodisplay: Universidad[] = []

  get itemsToDisplay(): Universidad[] | any {

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

    if (this.selectedOption != '-1') {

      const params = new HttpParams()
        .set('pais', this.selectedOption)

      this.http.get<any[]>(Host.host + '/ciudades', { params })
        .subscribe((data: any[]) => {

          this.optionsdCiudad = data;
        });

    } else {

      this.http.get<any[]>(Host.host + '/ciudades')
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

    if (this.selectedOptionCiudad != '-1') {

      const params = new HttpParams()
        .set('ciudad', this.selectedOptionCiudad)

      if (this.selectedOption != '-1') {
          params.set('pais',this.selectedOption) 
        }

      this.http.get<any[]>(Host.host + '/universidades', { params })
        .subscribe((data: any[]) => {

          this.optionsUniversidad = data;

        });
    } else {

      this.http.get<any[]>(Host.host + '/universidades')
        .subscribe((data: any[]) => {

          this.optionsUniversidad = data;

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
      paramss += '&pais=' + this.selectedOption
      // console.log('pais',this.selectedOption)
    }
    if (this.selectedOptionCiudad != '-1') {
      paramss += '&ciudad=' + this.selectedOptionCiudad

      // console.log('ciudad',this.selectedOptionCiudad)
    }

    console.log(Host.host + '/universidades?' + paramss)
    this.load = false;

    this.defaultValue = ''

    this.http.get<Universidad[]>(Host.host + '/universidades?' + paramss)
      .subscribe((data: Universidad[]) => {

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
