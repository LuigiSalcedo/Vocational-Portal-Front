import { HttpClient, HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Host } from '../../../assets/api-config.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  http = inject(HttpClient);

  constructor(private router: Router) {}

  data: any[] = []

  postData() {
    const idElemento = '12'; // Puedes obtener esto de alguna manera, dependiendo de tu lógica
    this.router.navigate(['/offers', { id: idElemento }]);
  }

  ngOnInit(){
  
  }

}
