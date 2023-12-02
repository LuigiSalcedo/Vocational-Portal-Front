import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input, inject } from '@angular/core';
import { Host } from '../../../../assets/api-config.model';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-career-item',
  standalone: true,
  imports: [HttpClientModule, NgFor],
  templateUrl: './career-item.component.html',
  styleUrl: './career-item.component.css'
})

export class CareerItemComponent {

  http = inject(HttpClient);

  @Input() page = 1;
  @Input() search = '';
  @Input() filter = '';

  @Input() limit_pages = 5;

  json:string = ''
  

  transformedData : any;
  data: any[];
  last = false;

  keysToDisplay: any[];

  constructor(){
    this.data = [];
    this.keysToDisplay = [];
  }

  ngOnInit(){
    
    console.log("Entró")
    if(this.search == ''){
      this.http.get<any[]>(Host.host + '/programas')
      .subscribe((data: any[]) =>{
        this.transformedData = data.reduce((acc, item) => {
          acc[item.id] = { id: item.id, nombre: item.nombre };
          return acc;
        }, {});
        this.data = data;
        
        console.log("llamando")
        this.itemsToDisplay

      });
    }else{
      
      this.http.get<any[]>(Host.host + '/programas')
      .subscribe((data: any[]) =>{
        this.transformedData = data.reduce((acc, item) => {
          acc[item.id] = { id: item.id, nombre: item.nombre };
          return acc;
        }, {});
        this.data = data;
        
        console.log("por id")
        this.itemsToDisplay
      });

    }
  }

  get itemsToDisplay(): any[] | any{
    
    if(this.search != ''){
      // Manipulacion de las opciones cuando el search es diferente de vacio
      this.keysToDisplay = this.data.slice(Number(this.search)-1,Number(this.search));

      return this.keysToDisplay;
    }

    const startIndex = (this.page - 1) * this.limit_pages;

    let endIndex = startIndex + this.limit_pages;

    this.keysToDisplay = this.data.slice(startIndex, endIndex);
    return this.keysToDisplay;

  }

  get calculatedPage(): number {
    return Math.round((this.data.length / this.limit_pages));
  }

}
