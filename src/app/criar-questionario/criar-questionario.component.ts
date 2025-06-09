import { Component, inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Titulo } from '../titulo/titulo';
import { Pergunta } from '../questionario/pergunta';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { TituloService } from '../titulo/titulo.service';
import { PerguntaService } from '../questionario/pergunta.service';

@Component({
  selector: 'app-criar-questionario',
  imports: [
    MatInputModule,
    MatCardModule,
    FormsModule
  ],
  templateUrl: './criar-questionario.component.html',
  styleUrl: './criar-questionario.component.scss'
})
export class CriarQuestionarioComponent implements OnInit {

  titulo: Titulo = new Titulo();
  snack: MatSnackBar = inject(MatSnackBar);
  perguntas: Pergunta[] = [];
  perguntasArray: number[] = [];
  perguntaDescricao: string[] = [];
  cont = 0;

  constructor(
    private tituloService: TituloService,
    private perguntaService: PerguntaService
  ) {}

  ngOnInit(): void {}

  addQuestion() {
    this.cont += 1;
    this.perguntasArray.push(this.cont);
  }

  removeQuestion() {
    this.perguntasArray.splice(this.perguntasArray.length-1, 1);
    this.cont -= 1;
  }

  getParamsQuestion(parameters: any) {
    let params = [];

    for (let params1 in parameters) {
      params.push({
        "id" : "",
        "descricao": parameters[params1]
      });
    }

    return params;
  }

  clear() {
    this.perguntasArray = [];
    this.titulo.descricao = "";
  }

  save(titulo: Titulo) {
    let perguntas = this.perguntaDescricao;

    let params = this.getParamsQuestion(perguntas);
    
    this.perguntaService.save(params).subscribe({
      next: (response) => {
        let perguntas = [];
        let descricao = (this.titulo.descricao !== undefined) ? this.titulo.descricao : "";

        for (const index in response) {
          perguntas.push(response[index].id);
        }
      
        this.tituloService.save(descricao, perguntas).subscribe({
          next: (response) => {
            this.snack.open("Formulário cadastrado com sucesso!", "OK");
            this.clear();
          }
        });
      },
      error: (error) => {
        console.log("Erro na requisição", error);
      }
    });
  }
  
}
