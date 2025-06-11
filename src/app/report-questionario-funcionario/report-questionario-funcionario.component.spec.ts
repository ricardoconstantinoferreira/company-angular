import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportQuestionarioFuncionarioComponent } from './report-questionario-funcionario.component';

describe('ReportQuestionarioFuncionarioComponent', () => {
  let component: ReportQuestionarioFuncionarioComponent;
  let fixture: ComponentFixture<ReportQuestionarioFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportQuestionarioFuncionarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportQuestionarioFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
