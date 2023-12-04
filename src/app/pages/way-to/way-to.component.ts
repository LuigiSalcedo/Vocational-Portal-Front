import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, AfterViewInit, HostListener, inject } from '@angular/core';
import { WayToItemComponent } from '../components/way-to-item/way-to-item.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Host } from '../../../assets/api-config.model';

class Posicion {
  constructor(public x: number, public y: number) {}
}

class Cuadricula {
  private filas: number;
  private columnas: number;
  private anchoCelda: number;
  private altoCelda: number;
  private ocupadas: Set<string> = new Set();
  private anchoEspacio: number;  // Agregar propiedad anchoEspacio
  private altoEspacio: number;  // Agregar propiedad anchoEspacio

  constructor(ancho: number, alto: number, filas: number, columnas: number) {
    this.anchoEspacio = ancho;
    this.altoEspacio = alto;
    this.filas = filas;
    this.columnas = columnas;
    this.anchoCelda = ancho / columnas;
    this.altoCelda = alto / filas;
  }

  obtenerPosicionAleatoria(): Posicion | null {
    const maxIntentos = 100;
    let intentos = 0;

    while (intentos < maxIntentos) {
      const fila = Math.floor(Math.random() * this.filas);
      const columna = Math.floor(Math.random() * this.columnas);
      
      const clave = `${fila}-${columna}`;

      if (!this.ocupadas.has(clave)) {

        
        const x = columna * this.anchoCelda;
        const y = fila * this.altoCelda;

        const distanciaAlCentro = Math.sqrt(Math.pow(x - (this.anchoEspacio / 2), 2) + Math.pow(y - (this.altoEspacio / 2), 2));

        if(this.columnas < columna+2){

        }else if(distanciaAlCentro >= 150){
          this.ocupadas.add(clave);
          return new Posicion(x, y);
        }

      }
  
      intentos++;
    }

    return null; // No se pudo encontrar una posición después de varios intentos
  }
}

@Component({
  selector: 'app-way-to',
  standalone: true,
  imports: [HttpClientModule,NgFor, NgIf, NgClass,WayToItemComponent, CommonModule],
  templateUrl: './way-to.component.html',
  styleUrl: './way-to.component.css'
})

export class WayToComponent {

  http = inject(HttpClient);

  items: any[] = [];
  
  items_id: string[] = [];

  addSelection(item: any){
    this.items.push(item.data)
    this.items_id.push(item.data.id)

    console.log(this.items_id)

    this.buscarPreferencias();

  }

  posiciones: Posicion[] = [];

  elementos: { element_id: string, top: number, left: number }[]= []

  ngOnInit() {

    let screen = document.getElementById('screen')
    let anchoEspacio = 0;
    if(!screen){
      anchoEspacio = 1000;
    }else{
      anchoEspacio = screen.clientWidth;
    }
    
     // Definir constantes
     const anchoEspacioMinimo = 500;
     const anchoEspacioMaximo = 1980;
     const minimoColumnas = 7;
     const maximoColumnas = 15;
 
     // Calcular el ancho de cada columna
     const anchoColumnaMinimo = anchoEspacioMinimo / minimoColumnas;
     const anchoColumnaMaximo = anchoEspacioMaximo / maximoColumnas;
 
     // Calcular el número óptimo de columnas
     let columnasOptimas = Math.floor(anchoEspacio / anchoColumnaMinimo);
     columnasOptimas = Math.max(minimoColumnas, Math.min(maximoColumnas, columnasOptimas));
 

    const altoEspacio = 400;
    const cuadricula = new Cuadricula(anchoEspacio, altoEspacio, 10, columnasOptimas); // 10 filas x 7 columnas

    for (let i = 0; i < 31; i++) {
      const posicion = cuadricula.obtenerPosicionAleatoria();
      if (posicion) {

        const element_id = `element-${i}`;
        const top = posicion.y;
        const left = posicion.x;

        this.elementos.push({ element_id, top, left });

        this.posiciones.push(posicion);
      } else {
        console.error('No se pudo encontrar una posición única después de varios intentos');
        break;
      }
    }
  }

  data: any[] = []

  buscarPreferencias(){
    
    let json = JSON.stringify(Array.from(this.items_id))
    console.log(json)
    this.http.post<any[]>(Host.host + "/programas/preferencias",json)
      .subscribe((data: any[]) =>{
        let transformedData = data.reduce((acc, item) => {
          acc[item.id] = { id: item.id, nombre: item.nombre, descripion: item.descripcion};
          return acc;
        }, {});
        this.data = data;
        console.log(data)
        console.log(Host.host + "/programas/preferecias")
      });

  }

  page = 1;
  limit_pages = 4;

  datatodisplay: any[] = []

  get itemsToDisplay(): any[] | any{

    const startIndex = (this.page - 1) * this.limit_pages;

    let endIndex = startIndex + this.limit_pages;

    this.datatodisplay = this.data.slice(startIndex, endIndex);
    return this.datatodisplay;

  }

  get calculatedPage(): number {
    return Math.round((this.data.length / this.limit_pages));
  }

}
