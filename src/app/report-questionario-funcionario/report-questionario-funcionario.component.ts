import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { FuncionarioService } from '../funcionario/funcionario.service';
import { Titulo } from '../titulo/titulo';

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

  myControl = new FormControl('');
  options: string[] = [];
  filteredOptions!: Observable<string[]>;
  selectedTitulo: string = "";
  titulos: Titulo[] = [];

  constructor(private funcionarioService: FuncionarioService) {}

  ngOnInit() {

    this.funcionarioService.search().subscribe({
      next: (response) => {
        response.forEach((value, idx) => {
          let option = (value.name !== undefined) ? value.name : "";
          this.options.push(option);
        });
      },
      error: (error) => {
        console.log(error)
      }
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  send(event: any) {
    let name = event.target.value;

    
  }

  getQuestionsAndAnswers(event: any) {
    
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }


}
