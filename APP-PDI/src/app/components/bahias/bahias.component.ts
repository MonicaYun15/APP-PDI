import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bahias',
  standalone: false,
  templateUrl: './bahias.component.html',
  styleUrl: './bahias.component.css'
})
export class BahiasComponent {
 constructor(private router : Router){}

 redirectRegistro(bahia : string){
  this.router.navigate(['/registro'], { queryParams: { bahia } });
 }


}
