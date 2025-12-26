import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TituloService } from '../titulo/titulo.service';

interface PieData {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-respostas-funcionarios',
  imports: [CommonModule],
  templateUrl: './respostas-funcionarios.component.html',
  styleUrls: ['./respostas-funcionarios.component.scss']
})
export class RespostasFuncionarioComponent implements OnInit, AfterViewInit {
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  data: PieData[] = [];
  total = 0;
  errorMessage = '';

  constructor(private tituloService: TituloService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // draw may be called after data is loaded
  }

  private resolveLabel(item: any, idx: number): string {
    return (
      item.funcionarioNome || `Funcionário ${idx + 1}`
    );
  }

  private resolveValue(item: any): number {
    const raw = item.totalRespostas ?? item.count ?? item.value ?? 0;
    const num = Number(raw);
    return Number.isFinite(num) ? num : 0;
  }

  loadData() {
    this.tituloService.getTitlesByEmployeeAll().subscribe({
      next: (res: any[]) => {
        console.debug('TituloService.getTitlesByEmployeeAll -> raw:', res);

        this.data = (res || []).map((item: any, idx: number) => {
          const label = this.resolveLabel(item, idx);
          const value = this.resolveValue(item);

          return { label, value, color: this.pickColor(idx) };
        }).filter(d => d.value > 0);

        this.total = this.data.reduce((s, d) => s + d.value, 0);

        if (this.data.length === 0 || this.total === 0) {
          this.errorMessage = 'Nenhuma resposta válida encontrada.';
          return;
        }

        const attemptDraw = () => {
          if (this.pieCanvas && this.pieCanvas.nativeElement) {
            requestAnimationFrame(() => this.draw());
          } else {
            setTimeout(attemptDraw, 50);
          }
        };

        attemptDraw();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erro ao carregar dados. Verifique a API.';
      }
    });
  }

  @HostListener('window:resize')
  onResize() {
    if (this.data.length > 0) this.draw();
  }

  pickColor(idx: number) {
    const palette = [
      '#4dc9f6', '#f67019', '#f53794', '#537bc4', '#acc236', '#166a8f', '#00a950', '#58595b', '#8549ba'
    ];
    return palette[idx % palette.length];
  }

  draw() {
    const canvas = this.pieCanvas?.nativeElement;
    if (!canvas) return;
    const parent = canvas.parentElement;
    const parentWidth = parent ? parent.clientWidth : 400;
    const maxSize = 720; // limite máximo para evitar proporções exageradas
    const size = Math.min(parentWidth, maxSize);
    const width = size;
    const height = size; // força canvas quadrado para o gráfico ficar redondo

    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    // aumenta o raio para preencher melhor o espaço do canvas mantendo margem
    const radius = Math.min(width, height) * 0.4;

    let startAngle = -Math.PI / 2;

    this.data.forEach(d => {
      const sliceAngle = (d.value / this.total) * Math.PI * 2;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = d.color;
      ctx.fill();

      startAngle += sliceAngle;
    });

    // título apenas (legenda agora é o HTML à esquerda)
    ctx.fillStyle = '#222';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Respostas por Funcionários', centerX, 18);
  }
}
