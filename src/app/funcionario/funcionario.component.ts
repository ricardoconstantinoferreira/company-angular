import { Component, inject, OnInit } from '@angular/core';
import { Funcionario } from './funcionario';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { FuncionarioService } from './funcionario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import { Empresa } from '../empresa/empresa';
import { EmpresaService } from '../empresa/empresa.service';

@Component({
  selector: 'app-funcionario',
  imports: [
    MatInputModule,
    MatCardModule,
    FormsModule,
    MatSelectModule
  ],
  templateUrl: './funcionario.component.html',
  styleUrl: './funcionario.component.scss'
})
export class FuncionarioComponent implements OnInit {

  selectedEmpresa: string = "";
  funcionario: Funcionario = new Funcionario();
  funcionarioExist: boolean = false;
  snack: MatSnackBar = inject(MatSnackBar);
  updated: boolean = false;
  empresas: Empresa[] = [];

  constructor(
    private funcionarioService: FuncionarioService,
    private empresaService: EmpresaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.route.queryParamMap.subscribe((query: any) => {
      const id = query['params']['id'];

      if (id) {
        this.funcionarioService.findById(id).subscribe({
          next: (response) => {        
            this.funcionario = response;
            this.updated = true;
            this.selectedEmpresa = (response.empresa !== undefined && response.empresa.id !== undefined) ? response.empresa.id : "";
          },
          error: (error) => {
            console.log("Erro na requisição ", error);
          }
        });
      } else {
        this.updated = false;
      }
    });

    this.empresaService.search().subscribe({
      next: (response) => {
        this.empresas = response;
      },
      error: (erro) => {
        console.log(erro);
      }
    });
  }

  save(funcionario: Funcionario) {
    funcionario.empresa_id = this.selectedEmpresa;
    this.funcionarioService.save(funcionario, this.updated).subscribe({
      next: (response) => {
        if (response !== null) {

          if (this.updated) {
            this.snack.open("Funcionario alterado com sucesso!!!", "OK");  
            this.router.navigate(['/consulta-funcionario']);
          } else {
            this.snack.open("Funcionario cadastrado com sucesso!!!", "OK");
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
    this.funcionario.name = "";
    this.funcionario.cargo = "";

    debugger;

    if (this.funcionario.empresa_id !== undefined) {
      this.selectedEmpresa = ""
    }
  }
  
}
