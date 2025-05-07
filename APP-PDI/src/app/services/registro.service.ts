import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Registro } from '../models/registro.model';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private apiUrl = 'http://nmxsvp70/apiTracking/api/jobs/registrar'; // ajusta esta URL según tu backend

  constructor(private http: HttpClient) {}

  guardarRegistro(registro: Registro): Observable<Registro> {
    return this.http.post<Registro>(this.apiUrl, registro);
  }
}
