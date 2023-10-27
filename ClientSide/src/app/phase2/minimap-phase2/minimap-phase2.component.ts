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

    this.minimapPhase2Canvas.nativeElement.style.background = `url( ../../../../../assets/AngerMap/angerMinimapGood.png)`;
    console.log("characterX: " + this.characterX + " characterY: " + this.characterY)

    // Calculez les coordonnées du personnage par rapport à la zone actuelle et mettez à jour le marqueur.
    const adjustedX = this.characterX - this.gameMinX;
    const adjustedY = this.characterY - this.gameMinY;

    console.log("adjustedX: " + adjustedX + " adjustedY: " + adjustedY)
    this.updateCanvas(adjustedX, adjustedY);
  }


  updateCanvas(adjustedX: number, adjustedY: number) {
    if (!this.ctx) {
      return;
    }

    const canvasX = (adjustedX / (this.gameMaxX - this.gameMinX)) * this.minimapPhase2Canvas.nativeElement.width - this.customIcon.width / 2;
    const canvasY = (adjustedY / (this.gameMaxY - this.gameMinY)) * this.minimapPhase2Canvas.nativeElement.height - this.customIcon.height / 2;

    this.ctx.clearRect(0, 0, this.minimapPhase2Canvas.nativeElement.width, this.minimapPhase2Canvas.nativeElement.height);
    this.ctx.drawImage(this.customIcon, canvasX, canvasY, this.customIcon.width, this.customIcon.height);
    console.log("canvasX: " + canvasX + " canvasY: " + canvasY)
  }



}
