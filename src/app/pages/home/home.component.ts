import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Host } from '../../../assets/api-config.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  http = inject(HttpClient);

  postData() {

    const url = Host.host + '/programas/areas?precision=50';
    const jsonData = "[1,2,3]";
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
      // Otras cabeceras según sea necesario
    });
  
    // Realiza la solicitud POST
    this.http.post(url, jsonData)
      .subscribe(
        (response) => {
          // Maneja la respuesta exitosa aquí
          console.log('Respuesta exitosa:', response);
        },
        (error) => {
          // Maneja el error aquí
          console.error('Error en la solicitud:', error);
        }
      );
  }

  ngOnInit(){
  
  }

}
