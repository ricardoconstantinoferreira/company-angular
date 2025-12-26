import { Routes } from '@angular/router';
import { EmpresaComponent } from './empresa/empresa.component';
import { FuncionarioComponent } from './funcionario/funcionario.component';
import { QuestionarioComponent } from './questionario/questionario.component';
import { ConsultaEmpresaComponent } from './consulta-empresa/consulta-empresa.component';
import { ConsultaFuncionarioComponent } from './consulta-funcionario/consulta-funcionario.component';
import { CriarQuestionarioComponent } from './criar-questionario/criar-questionario.component';
import { ReportQuestionarioFuncionarioComponent } from './report-questionario-funcionario/report-questionario-funcionario.component';
import { RespostasEmpresaComponent } from './respostas-empresa/respostas-empresa.component';
import { RespostasFuncionarioComponent } from './respostas-funcionarios/respostas-funcionarios.component';

export const routes: Routes = [
    { path: 'empresa', component: EmpresaComponent },
    { path: 'consulta-empresa', component: ConsultaEmpresaComponent },
    { path: 'funcionario', component: FuncionarioComponent },
    { path: 'consulta-funcionario', component: ConsultaFuncionarioComponent },
    { path: 'questionario', component: QuestionarioComponent },
    { path: 'criar-questionario', component: CriarQuestionarioComponent },
    { path: 'report-questionario-funcionario', component: ReportQuestionarioFuncionarioComponent },
    { path: 'respostas-empresa', component: RespostasEmpresaComponent },
    { path: 'respostas-funcionarios', component: RespostasFuncionarioComponent }
];
