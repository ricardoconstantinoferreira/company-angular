import { Component, inject, OnInit } from '@angular/core';
import { Questionario } from './questionario';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { Funcionario } from '../funcionario/funcionario';
import { ActivatedRoute, Router } from '@angular/router';
import { FuncionarioService } from '../funcionario/funcionario.service';
import { Titulo } from '../titulo/titulo';
import { TituloService } from '../titulo/titulo.service';
import { Pergunta } from './pergunta';
import { RespostaService } from './resposta.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  snack: MatSnackBar = inject(MatSnackBar);
  titulos: Titulo[] = [];
  titleOptionSelected: string = "";
  perguntas: Pergunta[] = [];

  constructor(
    private funcionarioService: FuncionarioService,
    private tituloService: TituloService,
    private respostaService: RespostaService,
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

  getQuestions(event: any) {
    this.titleOptionSelected = event.target.value;

    
    this.tituloService.searchTitleById(this.titleOptionSelected).subscribe({
      next: (response) => {

        if (this.perguntas.length > 0) {
          this.perguntas = [];
        }
        
        response.pergunta?.forEach((p) => {
          this.perguntas.push(p);
        })
      },
      error: (error) => {
        console.log(error)
      }
    });
  }

  save(questionario: Questionario) {
    questionario.titulo_id = this.selectedTitulo;
    questionario.funcionario_id = this.selectedFuncionario;
    questionario.pergunta = this.perguntas;

    this.respostaService.save(questionario).subscribe({
      next: (response) => {
        if (response !== null) {
          this.snack.open("Resposta enviada com sucesso!");
          this.router.navigate(['/questionario']);
          this.clear();
        }
      }
    });
  }

  clear() {
    this.questionario.funcionario_id = "";
    this.questionario.titulo_id = "";
    this.questionario.pergunta = [];
  }
}
