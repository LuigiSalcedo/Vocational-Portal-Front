import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Host } from '../../../../assets/api-config.model';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-career-item',
  standalone: true,
  imports: [HttpClientModule, NgFor, CommonModule],
  templateUrl: './career-item.component.html',
  styleUrl: './career-item.component.css'
})

export class CareerItemComponent {

  http = inject(HttpClient);

  @Input() page = 1;
  @Input() search = '';
  @Input() filter = '';
  @Input() slider = 1;

  @Input() limit_pages = 10;

  json:string = ''
  
  transformedData : any;
  data: any[];
  last = false;
  
  lastSearch = '';

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
        
        console.log(Host.host + '/programas')
        this.finishedLoad(true);
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
        
        console.log(Host.host + '/programas')
        this.finishedLoad(true);
        this.itemsToDisplay
      });

    }
  }

  get itemsToDisplay(): any[] | any{

    if(this.filter !== ''){
       this.search = ''
       this.lastSearch = ''

       console.log("Filer from child:",this.filter)
       

      this.keysToDisplay = []

      this.http.post<any[]>(Host.host + "/programas/areas?precision=" + this.slider, this.filter)
      .subscribe((data: any[]) =>{
        this.transformedData = data.reduce((acc, item) => {
          acc[item.id] = { id: item.id, nombre: item.nombre };
          return acc;
        }, {});
        this.data = data;

        this.finishedLoad(true);

        console.log(Host.host + "/programas/areas?precision=" + this.slider, this.filter)
        this.itemsToDisplay
      });

      this.filter = '';

    }else if(this.search !== this.lastSearch){
      
      this.lastSearch= this.search;
      this.page = 1;

      
      this.http.get<any[]>(Host.host + '/programas' + (this.search === '' ? '': "/nombre/" + this.search) )
      .subscribe((data: any[]) =>{
        this.transformedData = data.reduce((acc, item) => {
          acc[item.id] = { id: item.id, nombre: item.nombre };
          return acc;
        }, {});
        this.data = data;
        
        console.log(Host.host + '/programas' + (this.search === '' ? '': "/nombre/" + this.search))
        this.finishedLoad(true);
        this.itemsToDisplay
      });
      

    }

    const startIndex = (this.page - 1) * this.limit_pages;

    let endIndex = startIndex + this.limit_pages;

    this.keysToDisplay = this.data.slice(startIndex, endIndex);
    return this.keysToDisplay;

  }

  @Output() finishedLoadingEvent = new EventEmitter<boolean>();

  get calculatedPage(): number {
    return Math.round((this.data.length / this.limit_pages));
  }

  finishedLoad(finish: boolean){
    this.finishedLoadingEvent.emit(finish);
  }

}
