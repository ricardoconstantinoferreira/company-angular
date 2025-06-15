import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { FuncionarioService } from '../funcionario/funcionario.service';
import { Titulo } from '../titulo/titulo';
import { TituloService } from '../titulo/titulo.service';
import { RespostaService } from '../questionario/resposta.service';
import { Resposta } from '../questionario/resposta';

interface Item {
  id: string;
  name: string;
}

@Component({
  selector: 'app-report-questionario-funcionario',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './report-questionario-funcionario.component.html',
  styleUrl: './report-questionario-funcionario.component.scss'
})
export class ReportQuestionarioFuncionarioComponent implements OnInit {

  myControl = new FormControl();
  options: Item[] = [];
  filteredOptions!: Observable<Item[]>;
  selectedTitulo: string = "";
  titulos: Titulo[] = [];
  respostas: Resposta[] = [];

  constructor(
    private funcionarioService: FuncionarioService,
    private tituloService: TituloService,
    private respostaService: RespostaService
  ) {}

  ngOnInit() {

    this.funcionarioService.search().subscribe({
      next: (response) => {
        response.forEach((value, idx) => {
          let name = (value.name !== undefined) ? value.name : "";
          let id = (value.id !== undefined) ? value.id : "";
          this.options.push({
            "id": id,
            "name": name
          });

          this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
          );
        });
      },
      error: (error) => {
        console.log(error)
      }
    });
  }

  displayFn(item: Item): string {
    return item && item.name ? item.name : '';
  }

  getQuestionsAndAnswers(event: any) {
    let id = event.target.value;

    this.tituloService.searchTitleById(id).subscribe({
      next: (response) => {
        let perguntas = response.pergunta;

        if (perguntas !== undefined) {
          perguntas.forEach((value, idx) => {
            this.addResponses(value.id);
          });
        }
      },

      error: (error) => {
        console.log(error);
      }
    })
  }

  addResponses(id: string|undefined) {
    this.respostas = [];

    if (id !== undefined) {
      this.respostaService.getAnswerWithQuestionDescription(id).subscribe({
        next: (result) => {
          this.respostas.push({
            "description": result.description,
            "pergunta": result.pergunta
          });    
        },

        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  getTitles() {
    const id = this.myControl.value?.id;

    if (id !== undefined) {
      this.tituloService.searchQuestionByEmployee(id).subscribe({
        next: (response) => {

          Object.entries(response).forEach(([key, value]) => {
            this.titulos.push({
              "id": key,
              "descricao": value
            });
          });
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }

  private _filter(value: string): Item[] {
    const filterValue = (value !== undefined) ? value.toLowerCase() : value;
    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }
}