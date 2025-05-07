import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroService } from '../../services/registro.service'; // Ajusta la ruta según la ubicación de tu servicio

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  standalone: false
})
export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;
  isEntradaRegistrada = false; // Indica si se ha registrado la entrada
  isSalidaRegistrada = false;   // Opcional: si deseas verificar si la salida se ha registrado

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private registroService: RegistroService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const nombreBahia = params['bahia'] || '';

      this.registroForm = this.fb.group({
        bahia: [{ value: nombreBahia, disabled: true }, Validators.required],
        vin: ['', Validators.required],
        horaEntrada: [{ value: '', disabled: true }, Validators.required],
        horaSalida: [{ value: '', disabled: true }]
      });
    });
  }

  onVinScanned(): void {
    // Captura y trimea el valor actual del campo VIN
    const vin = this.registroForm.get('vin')?.value?.trim();

    if (!this.isEntradaRegistrada) {
      // Primer escaneo: Registrar entrada (VIN y hora de entrada)
      const ahora = this.getHoraActual();
      // Fija el VIN y la hora de entrada
      this.registroForm.get('vin')?.setValue(vin);
      this.registroForm.get('horaEntrada')?.setValue(ahora);
      // Deshabilita el control de horaEntrada (ya estaba configurado en la creación también)
      // Marca que se ha registrado la entrada
      this.isEntradaRegistrada = true;
    } else if (!this.registroForm.get('horaSalida')?.value) {
      // Segundo escaneo: Registrar hora de salida
      const ahora = this.getHoraActual();
      this.registroForm.get('horaSalida')?.setValue(ahora);
      // Aquí no eliminamos la información ni reseteamos el formulario; lo hacemos al enviar
    }
  }

  getHoraActual(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      const datos = this.registroForm.getRawValue();
      console.log('Registro completo:', datos);

      // Enviar datos al backend usando el servicio
      this.registroService.guardarRegistro(datos).subscribe({
        next: (response:any) => {
          console.log('Registro guardado', response);
          this.resetForm();
          this.redirectTo();
        },
        error: (err: Error) => console.error('Error al guardar registro:', err)
      });
    }
  }

  resetForm(): void {
    const bahia = this.registroForm.get('bahia')?.value;
    // Resetea el formulario manteniendo el valor de bahia
    this.registroForm.reset({
      bahia: bahia,
      vin: '',
      horaEntrada: '',
      horaSalida: ''
    });
    this.isEntradaRegistrada = false;
    this.registroForm.get('vin')?.enable();
  }

  redirectTo(): void {
    this.router.navigate(['/bahias']);
  }

  getButtonText(): string {
    return this.isEntradaRegistrada ? 'Registrar salida' : 'Registrar entrada';
  }
}



