import { Component, inject, OnInit } from '@angular/core';
import { EmpresaService } from '../empresa/empresa.service';
import { Empresa } from '../empresa/empresa';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-consulta-empresa',
  imports: [
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './consulta-empresa.component.html',
  styleUrl: './consulta-empresa.component.scss'
})
export class ConsultaEmpresaComponent implements OnInit {

  empresas: Array<Empresa> = [];
  colunasTable: string[] = ["id", "razao_social", "nome_fantasia", "cnpj", "acoes"];
  snack: MatSnackBar = inject(MatSnackBar);

  constructor(
    private empresaService: EmpresaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.startList();
  }

  startList() {
    this.empresaService.search().subscribe({
      next: (response) => {
        this.empresas = response;
      },
      error: erro => console.log("Ocorreu um erro ", erro)
    });
  }

  edit(id: string) {
    this.router.navigate(['/empresa'], {queryParams: {"id": id}});
  }

  person(id: string) {
    this.router.navigate(['/consulta-funcionario'], {queryParams: {"empresaId": id}});
  }

  delete(empresa: Empresa) {
    let id = (empresa.id !== undefined) ? empresa.id : "";

    this.empresaService.delete(id)
    .subscribe({
      next: (response) => {
        this.startList();

        this.snack.open(response.nome_fantasia + " deletada com sucesso!!!", "OK");
      },
      error: erro => { 
        console.log("Ocorreu um erro ", erro);
      }
    });
  }
}
