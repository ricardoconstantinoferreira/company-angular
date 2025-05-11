import { Component, inject, OnInit } from '@angular/core';
import { Funcionario } from '../funcionario/funcionario';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuncionarioService } from '../funcionario/funcionario.service';

@Component({
  selector: 'app-consulta-funcionario',
  imports: [
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './consulta-funcionario.component.html',
  styleUrl: './consulta-funcionario.component.scss'
})
export class ConsultaFuncionarioComponent implements OnInit {

  funcionarios: Array<Funcionario> = [];
  colunasTable: string[] = ["id", "name", "cargo", "razao_social", "acoes"];
  snack: MatSnackBar = inject(MatSnackBar);

  constructor(
    private funcionarioService: FuncionarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
      this.startList();
  }

  startList() {
    this.funcionarioService.search().subscribe({
      next: (response) => {
        this.funcionarios = response;
      },
      error: erro => console.log("Ocorreu um erro ", erro)
    });
  }

  edit(id: string) {
    this.router.navigate(['/funcionario'], {queryParams: {"id": id}});
  }

  delete(funcionario: Funcionario) {
    let id = (funcionario.id !== undefined) ? funcionario.id : "";

    this.funcionarioService.delete(id).subscribe({
      next: (response) => {
        this.startList();

        this.snack.open(response.name + " deletado com sucesso!!!", "OK");
      },

      error: erro => {
        console.log("Ocorreu um erro ", erro);
      }
    });
  }
}