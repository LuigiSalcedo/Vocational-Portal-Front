import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { Host } from '../../../../assets/api-config.model';

@Component({
  selector: 'app-way-to-item',
  standalone: true,
  imports: [NgClass, NgFor, HttpClientModule, NgIf, CommonModule],
  templateUrl: './way-to-item.component.html',
  styleUrl: './way-to-item.component.css'
})
export class WayToItemComponent implements OnInit {

  http = inject(HttpClient);

  @Input() elementos: { element_id: string, top: number, left: number }[] = [
    {
      element_id: 'element-0',
      top: 50,
      left: 100
    },
    {
      element_id: 'element-1',
      top: 250,
      left: 570
    }
  ];

  data: any[];
  load = false;

  ngOnInit() {

    this.http.get<any[]>(Host.host + '/preferencias')
      .subscribe((data: any[]) => {
        let transformedData = data.reduce((acc, item) => {
          acc[item.id] = { id: item.id, nombre: item.nombre, descripion: item.descripcion };
          return acc;
        }, {});
        this.data = data;
        this.load = true;
        console.log(Host.host + '/preferencias')
      });

  }

  constructor(private el: ElementRef) {
    this.data = []
  }

  @Output() addSelectionEvent = new EventEmitter<any>();

  transicionActivada = false;

  startAnimation(element_id: string) {

    let elemento = document.getElementById(element_id);

    let id = element_id.match(/\d+/g);
    this.addSelection('' + id);

    if (elemento) {
      elemento.classList.add('hide-element');

    }
  }

  animateScalar() {
    const elementoTwo = document.getElementById('circle');

    if (elementoTwo) {
      elementoTwo.classList.add('animate-scalar');
      elementoTwo.addEventListener('animationend', () => {

        elementoTwo.classList.remove('animate-scalar');


      }, { once: true });
    }
  }

  send: number = 0

  addSelection(element_id: string) {
    this.addSelectionEvent.emit({ 'element_id': element_id, 'data': this.data[Number(element_id)] });
    this.send++;
  }



}
