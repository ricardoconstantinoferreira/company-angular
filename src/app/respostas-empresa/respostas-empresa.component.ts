import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RespostaService } from '../questionario/resposta.service';

interface PieData {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-respostas-empresa',
  imports: [CommonModule],
  templateUrl: './respostas-empresa.component.html',
  styleUrl: './respostas-empresa.component.scss'
})
export class RespostasEmpresaComponent implements OnInit, AfterViewInit {
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  data: PieData[] = [];
  total = 0;
  errorMessage = '';

  constructor(private respostaService: RespostaService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // draw may be called after data is loaded
  }

  private resolveLabel(item: any, idx: number): string {
    return (
      item.company || item.empresa || item.empresaNome || item.nome || item.name || item.label || `Empresa ${idx + 1}`
    );
  }

  private resolveValue(item: any): number {
    const raw = item.totalRespostas ?? 0;
    const num = Number(raw);
    return Number.isFinite(num) ? num : 0;
  }

  loadData() {
    this.respostaService.getAnswersByCompany().subscribe({
      next: (res: any[]) => {
        console.debug('RespostaService.getAnswersByCompany -> raw:', res);

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
    const width = parent ? parent.clientWidth : 400;
    const height = Math.min(width, 400);

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
    const radius = Math.min(width, height) / 3;

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

    const legendX = 10;
    let legendY = 10;
    const boxSize = 12;
    ctx.font = '13px Arial';
    ctx.textBaseline = 'top';

    this.data.forEach(d => {
      ctx.fillStyle = d.color;
      ctx.fillRect(legendX, legendY, boxSize, boxSize);

      ctx.fillStyle = '#222';
      const text = `${d.label} (${d.value})`;
      ctx.fillText(text, legendX + boxSize + 8, legendY);

      legendY += boxSize + 8;
    });

    ctx.fillStyle = '#222';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Respostas por Empresa', centerX, 18);
  }
}