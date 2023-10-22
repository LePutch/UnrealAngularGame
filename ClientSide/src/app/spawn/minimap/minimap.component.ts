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

  gameMinX = -19000; // Coordonnée minimale X dans le jeu (53600 / 2)
  gameMinY = -19000; // Coordonnée minimale Y dans le jeu (53600 / 2)
  gameMaxX = 19000; // Coordonnée maximale X dans le jeu (53600 / 2)
  gameMaxY = 19000; // Coordonnée maximale Y dans le jeu (53600 / 2)

  currentZoneX = -1;
  currentZoneY = -1;

  private customIcon: HTMLImageElement = new Image(15, 15);


  ngAfterViewInit() {
    this.ctx = this.minimapCanvas.nativeElement.getContext('2d')!;
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
    const quarterWidth = (this.gameMaxX - this.gameMinX) / 2;
    const quarterHeight = (this.gameMaxY - this.gameMinY) / 2;

    const newZoneX = this.characterX < 0 ? 0 : 1;
    const newZoneY = this.characterY < 0 ? 0 : 1;

    if (newZoneX !== this.currentZoneX || newZoneY !== this.currentZoneY) {
      // Le personnage est entré dans une nouvelle zone.
      this.currentZoneX = newZoneX;
      this.currentZoneY = newZoneY;

      const backgroundImage = `../../../assets/ZoneSpawn/zone${newZoneX}-${newZoneY}-background.png`;
      this.minimapCanvas.nativeElement.style.background = `url(${backgroundImage})`;
    }

    // Calculez les coordonnées du personnage par rapport à la zone actuelle et mettez à jour le marqueur.
    const adjustedX = this.characterX - (newZoneX * quarterWidth);
    const adjustedY = this.characterY - (newZoneY * quarterHeight);
    this.updateCanvas(adjustedX, adjustedY);
  }

  updateCanvas(adjustedX: number, adjustedY: number) {
    if (!this.ctx) {
      return;
    }
    this.ctx.clearRect(0, 0, this.minimapCanvas.nativeElement.width, this.minimapCanvas.nativeElement.height);
    // Calculez les coordonnées du joueur par rapport à la zone actuelle
    const zoneWidth = (this.gameMaxX - this.gameMinX) / 2;
    const zoneHeight = (this.gameMaxY - this.gameMinY) / 2;
    // Calculez les coordonnées du joueur par rapport à la zone actuelle
    const canvasX = ((adjustedX - this.gameMinX) / zoneWidth) * this.minimapCanvas.nativeElement.width - this.customIcon.width / 2;
    const canvasY = ((adjustedY - this.gameMinY) / zoneHeight) * this.minimapCanvas.nativeElement.height - this.customIcon.height / 2;
    this.ctx.drawImage(this.customIcon, canvasX, canvasY, this.customIcon.width, this.customIcon.height);
  }

}
