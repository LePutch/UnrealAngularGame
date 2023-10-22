import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-minimap-phase2',
  templateUrl: './minimap-phase2.component.html',
  styleUrls: ['./minimap-phase2.component.scss']
})
export class MinimapPhase2Component {
  @Input() characterX!: number;
  @Input() characterY!: number;

  @ViewChild('minimapPhase2Canvas') minimapPhase2Canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  gameMinX = -73500;
  gameMinY = -500;
  gameMaxX = -45000;
  gameMaxY = 28000;

  currentZoneX = -1;
  currentZoneY = -1;

  private customIcon: HTMLImageElement = new Image(15, 15);


  ngAfterViewInit() {
    this.ctx = this.minimapPhase2Canvas.nativeElement.getContext('2d')!;
    if (this.ctx) {
      this.customIcon.src = '../../../assets/character.png';
      this.customIcon.onload = () => {
        this.updateZone();
      }
    }
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['characterX'] || changes['characterY']) {
      this.updateZone();
    }
  }

  updateZone() {
    // Vérifiez que les coordonnées sont dans la plage de jeu
    this.characterX = Math.max(this.gameMinX, Math.min(this.characterX, this.gameMaxX));
    this.characterY = Math.max(this.gameMinY, Math.min(this.characterY, this.gameMaxY));

    const mapWidth = this.gameMaxX - this.gameMinX;
    const mapHeight = this.gameMaxY - this.gameMinY;

    this.minimapPhase2Canvas.nativeElement.style.background = `url( ../../../../../assets/AngerMap/angerMinimap.png)`;

    // Calculez les coordonnées du personnage par rapport à la zone actuelle et mettez à jour le marqueur.
    const adjustedX = this.characterX - this.gameMinX;
    const adjustedY = this.characterY - this.gameMinY;

    this.updateCanvas(adjustedX, adjustedY);
  }


  updateCanvas(adjustedX: number, adjustedY: number) {
    if (!this.ctx) {
      return;
    }

    // Calculez la largeur et la hauteur de la zone de jeu sur la minimap
    const zoneWidth = this.gameMaxX - this.gameMinX;
    const zoneHeight = this.gameMaxY - this.gameMinY;

    // Calculez les coordonnées du joueur par rapport à la zone actuelle
    const canvasX = ((adjustedX - this.gameMinX) / zoneWidth) * this.minimapPhase2Canvas.nativeElement.width;
    const canvasY = ((adjustedY - this.gameMinY) / zoneHeight) * this.minimapPhase2Canvas.nativeElement.height;

    // Assurez-vous que le marqueur du joueur ne dépasse pas les limites du canvas
    const markerX = Math.max(0, Math.min(canvasX, this.minimapPhase2Canvas.nativeElement.width - this.customIcon.width));
    const markerY = Math.max(0, Math.min(canvasY, this.minimapPhase2Canvas.nativeElement.height - this.customIcon.height));

    this.ctx.clearRect(0, 0, this.minimapPhase2Canvas.nativeElement.width, this.minimapPhase2Canvas.nativeElement.height);
    this.ctx.drawImage(this.customIcon, markerX, markerY, this.customIcon.width, this.customIcon.height);
  }


}
