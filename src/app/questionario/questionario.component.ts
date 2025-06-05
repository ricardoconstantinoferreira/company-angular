import { Component, OnInit } from '@angular/core';
import { Questionario } from './questionario';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { Funcionario } from '../funcionario/funcionario';
import { ActivatedRoute, Router } from '@angular/router';
import { FuncionarioService } from '../funcionario/funcionario.service';
import { Titulo } from '../titulo/titulo';
import { TituloService } from '../titulo/titulo.service';

@Component({
  selector: 'app-questionario',
  imports: [
    MatInputModule,
    MatCardModule,
    FormsModule
  ],
  templateUrl: './questionario.component.html',
  styleUrl: './questionario.component.scss'
})
export class QuestionarioComponent implements OnInit {

  questionario: Questionario = new Questionario();
  selectedFuncionario: string = "";
  selectedTitulo: string = "";
  funcionarios: Funcionario[] = [];
  titulos: Titulo[] = [];

  constructor(
    private funcionarioService: FuncionarioService,
    private tituloService: TituloService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
      this.funcionarioService.search().subscribe({
        next: (response) => {
          this.funcionarios = response;
        },
        error: (error) => {
          console.log(error)
        }
      });

      this.tituloService.search().subscribe({
        next: (response) => {
          this.titulos = response;
        },
        error: (error) => {
          console.log(error)
        }
      });
  }

  save(questionario: Questionario) {

  }
}
