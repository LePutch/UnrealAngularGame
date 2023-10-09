import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-minimap',
  templateUrl: './minimap.component.html',
  styleUrls: ['./minimap.component.scss']
})
export class MinimapComponent {

  @Input() characterX!: number;
  @Input() characterY!: number;

  @ViewChild('minimapCanvas', { static: false }) minimapCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  gameMinX = -53500; // Coordonnée minimale X dans le jeu
  gameMinY = -53500; // Coordonnée minimale Y dans le jeu
  gameMaxX = 53600; // Coordonnée maximale X dans le jeu
  gameMaxY = 53600; // Coordonnée maximale Y dans le jeu


  ngAfterViewInit() {
    this.ctx = this.minimapCanvas.nativeElement.getContext('2d')!;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['characterX'] || changes['characterY']) {
      this.drawMarker(this.characterX, this.characterY);
    }
  }

  drawMarker(x: number, y: number) {
    if (!this.ctx) {
      return; // Évite les erreurs si le contexte n'est pas encore défini
    }

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.minimapCanvas.nativeElement.width, this.minimapCanvas.nativeElement.height);
    const unitsPerPixelX = (this.gameMaxX - this.gameMinX) / this.minimapCanvas.nativeElement.height;
    const unitsPerPixelY = (this.gameMaxY - this.gameMinY) / this.minimapCanvas.nativeElement.height;

    const canvasX = (this.characterX - this.gameMinX) / unitsPerPixelX;
    const canvasY = (this.characterY - this.gameMinY) / unitsPerPixelY;

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
    ctx.fill();
  }


  updateCanvas() {
    if (this.ctx) {
      const ctx = this.ctx;
      this.ctx.clearRect(0, 0, this.minimapCanvas.nativeElement.width, this.minimapCanvas.nativeElement.height);


      const unitsPerPixelX = (this.gameMaxX - this.gameMinX) / this.minimapCanvas.nativeElement.height;
      const unitsPerPixelY = (this.gameMaxY - this.gameMinY) / this.minimapCanvas.nativeElement.height;

      const canvasX = (this.characterX - this.gameMinX) / unitsPerPixelX;
      const canvasY = (this.characterY - this.gameMinY) / unitsPerPixelY;

      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}
