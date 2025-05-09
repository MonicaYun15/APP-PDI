import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { Registro } from '../models/registro.model';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private apiUrl = environment.apiUrl; 
  private readonly requestTimeout = 15000; 

  constructor(private http: HttpClient) { }

  guardarRegistro(registro: Registro): Observable<Registro> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<Registro>(this.apiUrl, registro, { headers }).pipe(
      timeout(this.requestTimeout),
      retry(1), // Reintentar una vez en caso de fallo
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = this.getServerErrorMessage(error);
    }

    console.error('Error en RegistroService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 0:
        return 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
      case 400:
        return 'Datos de registro inválidos.';
      case 401:
        return 'No autorizado. Por favor, autentícate.';
      case 404:
        return 'Endpoint no encontrado.';
      case 500:
        return 'Error interno del servidor. Por favor, inténtalo más tarde.';
      default:
        return `Error del servidor: ${error.status} - ${error.message}`;
    }
  }
}