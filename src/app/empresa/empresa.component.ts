import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { Empresa } from './empresa';
import { EmpresaService } from './empresa.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-empresa',
  imports: [
    MatInputModule,
    MatCardModule,
    FormsModule
  ],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.scss'
})
export class EmpresaComponent implements OnInit {

  empresa: Empresa = new Empresa();
  empresaExist: boolean = false;
  snack: MatSnackBar = inject(MatSnackBar);
  updated: boolean = false;

  constructor(
    private service: EmpresaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((query: any) => {
      const id = query['params']['id'];

      if (id) {
        this.service.findById(id).subscribe({
          next: (response) => {
            this.empresa = response;
            this.updated = true;
          },
          error: (error) => {
            console.log("Erro na requisição", error);
          }
        });
      } else {
        this.updated = false;
      }
    })
  }

  save(empresa: Empresa) {      
    this.service.save(empresa, this.updated).subscribe({
      next: (response) => {
        if (response !== null) {

          if (this.updated) {
            this.snack.open("Empresa alterada com sucesso!!!", "OK");  
            this.router.navigate(['/consulta-empresa']);
          } else {
            this.snack.open("Empresa cadastrada com sucesso!!!", "OK");
            this.clear();
          }
        }
      },
      error: (error) => {
        this.snack.open("Erro na requisição", "OK");
        console.log("Erro na requisição", error);
      }
    });
  }

  clear() {
    this.empresa.nome_fantasia = "";
    this.empresa.razao_social = "";
    this.empresa.cnpj = "";
  }
}
