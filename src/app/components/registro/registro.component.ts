import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroService } from '../../services/registro.service';
import { environment } from '../../../environments/environment.prod';
 
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  standalone: false
})
export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;
  isEntradaRegistrada = false;
  vinEntradaGuardado: string = '';
 
  @ViewChild('vin', { static: true }) vinInputRef!: ElementRef;
 
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private registroService: RegistroService
  ) {}
 
  ngOnInit(): void {
    this.initForm();
    setTimeout(() => {
      this.vinInputRef.nativeElement.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          this.onVinScanned();
        }
      });
    }, 0);
  }
 
  initForm(): void {
    const nombreBahia = this.route.snapshot.queryParamMap.get('bahia') || '';
    this.registroForm = this.fb.group({
      bahia: [{ value: nombreBahia, disabled: true }, Validators.required],
      vin: ['', Validators.required],
      horaEntrada: [{ value: '', disabled: true }, Validators.required],
      horaSalida: [{ value: '', disabled: true }]
    });
    this.isEntradaRegistrada = false;
    this.vinEntradaGuardado = '';
    this.focusVinInput();
  }
 
  getHoraActual(): string {
    const now = new Date();
    const monterreyTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Monterrey' }));
    const year = monterreyTime.getFullYear();
    const month = (monterreyTime.getMonth() + 1).toString().padStart(2, '0');
    const day = monterreyTime.getDate().toString().padStart(2, '0');
    const hours = monterreyTime.getHours().toString().padStart(2, '0');
    const minutes = monterreyTime.getMinutes().toString().padStart(2, '0');
    const seconds = monterreyTime.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
 
  focusVinInput(): void {
    setTimeout(() => {
      this.vinInputRef?.nativeElement?.focus();
    }, 100);
  }
 
  onVinScanned(): void {
    const vinActual = this.registroForm.get('vin')?.value?.trim();
 
    if (!vinActual) {
      alert('❗ VIN inválido');
      return;
    }
 
    if (!this.isEntradaRegistrada) {
      const horaEntrada = this.getHoraActual();
      this.vinEntradaGuardado = vinActual;
      this.registroForm.get('horaEntrada')?.setValue(horaEntrada);
      this.isEntradaRegistrada = true;
      alert('✅ Entrada registrada. Escanea nuevamente para registrar salida.');
      this.registroForm.get('vin')?.reset();
      this.focusVinInput();
    } else {
      // Validar que el VIN sea el mismo
      if (vinActual !== this.vinEntradaGuardado) {
        alert(`❗ El VIN escaneado no coincide con el VIN de entrada: ${this.vinEntradaGuardado}`);
        this.registroForm.get('vin')?.reset();
        this.focusVinInput();
        return;
      }
 
      const horaSalida = this.getHoraActual();
      this.registroForm.get('horaSalida')?.setValue(horaSalida);
      this.onSubmit();
    }
  }
 
  onSubmit(): void {
    if (!this.isEntradaRegistrada) {
      alert('❗ Primero debes registrar la entrada.');
      return;
    }
 
    if (!this.registroForm.get('horaSalida')?.value) {
      alert('✅ Hora de entrada registrada. Ahora escanea nuevamente para registrar salida.');
      return;
    }
 
    if (this.registroForm.valid) {
      const datosOriginales = this.registroForm.getRawValue();
      const datos = {
        nu_job: datosOriginales.vin,
        tx_proceso: datosOriginales.bahia,
        ts_hora_entrada: datosOriginales.horaEntrada,
        ts_hora_salida: datosOriginales.horaSalida
      };
      this.registroService.guardarRegistro(datos).subscribe({
        next: () => {
          alert('✅ Registro enviado con éxito');
          console.log('Registro completo:', datos);
          this.initForm();
        },
        error: () => {
          alert('❌ Error al enviar el registro. Intenta nuevamente.');
          console.log('Registro con error:', datos);
          this.initForm();
        }
      });
    } else {
      alert('❗ Formulario incompleto');
    }
  }
 
  redirectTo(): void {
    this.router.navigate(['/bahias']);
  }
}
 




  //onSubmit(): void {
    //if (this.registroForm.valid) {
      //const datos = this.registroForm.getRawValue();
      //console.log('Registro completo:', datos);

      // Enviar datos al backend usando el servicio
      //this.registroService.guardarRegistro(datos).subscribe({
        //next: (response:any) => {
          //console.log('Registro guardado', response);
          //this.resetForm();
        //},
        //error: (err: Error) => console.error('Error al guardar registro:', err)
      //});
    //}
  //}


