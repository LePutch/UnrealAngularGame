import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { NgProgress } from 'ngx-progressbar';
import { INITIAL_STATE, IPhase } from '../shared/shared-state';
import { Subject, takeUntil } from 'rxjs';
import { WebSocketConnexionService } from '../shared/services/web-socket-connexion.service';

@Component({
  selector: 'app-power-infos',
  templateUrl: './power-infos.component.html',
  styleUrls: ['./power-infos.component.scss']
})
export class PowerInfosComponent {
  @ViewChild('hTotDiv', { static: true })
  hTotDiv!: ElementRef;

  @Input()
  phases: IPhase;

  @Output()
  gemsEmitter = new EventEmitter<string>();

  circleSize!: number;
  radiusBar!: number;
  eyeSizeHeight!: number;
  eyeSizeWidth!: number;
  speedSizeWidth!: number;
  speedSizeHeight!: number;

  greenGems: number = 0;
  blueGems: number = 0;
  redGems: number = 0;
  showTP: boolean = false;
  bluePercent: number = 0;
  redPercent: number = 0;
  greenPercent: number = 0;

  flipFlopRise: boolean = true;
  spawnToRiseText: string = "Are you sure to go in Rise ?";
  riseToSpawnText: string = "Are you sure to return to Orilon ?";

  constructor(private ngProgress: NgProgress, private renderer: Renderer2, private websocketService: WebSocketConnexionService) {
    this.phases = INITIAL_STATE
  }

  private unsubscribe$ = new Subject<void>();
  applyRedGrayscale: boolean = true;
  applyBlueGrayscale: boolean = true;
  applyGreenGrayscale: boolean = true;

  ngOnInit() {
    this.updateDimensions();
    this.websocketService.getSocket()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        (message) => {
          if (message.type !== 'coords') {
          }
          this.messageHandler(message);
        },
        (err) => {
          console.error('Error:', err);
        },
        () => {
        }
      );
  }

  messageHandler(message: any) {
    if (message.type === 'gems') {
      if (message.content === 'red' && this.redGems < 50) {
        this.applyRedGrayscale = false;
        this.redGems++;
        this.redPercent = this.redGems * 10;
      }
      if (message.content === 'blue' && this.blueGems < 50) {
        this.applyBlueGrayscale = false;
        this.blueGems++;
        this.bluePercent = this.blueGems * 10;
      }
      if (message.content === 'green' && this.greenGems < 50) {
        this.applyGreenGrayscale = false;
        this.greenGems++;
        this.greenPercent = this.greenGems * 10;
      }
      if (message.content === 'bigRed' && this.redGems <= 50) {
        this.applyRedGrayscale = false;
        if (this.redGems + 10 > 50) {
          this.redGems = 50;
        }
        else {
          this.redGems = this.redGems + 10;
        }
        this.redPercent = this.redGems * 10;
      }
      if (message.content === 'infiniteRed') {
        this.applyRedGrayscale = false;
        this.redGems = 100000000;
        this.redPercent = this.redGems * 100000000;
      }
      if (message.content === 'bigBlue' && this.blueGems <= 50) {
        this.applyBlueGrayscale = false;
        if (this.blueGems + 10 > 50) {
          this.blueGems = 50;
        }
        else {
          this.blueGems = this.blueGems + 100000000;
        }
        this.bluePercent = this.blueGems * 100000000;
      }
      if (message.content === 'bigGreen' && this.greenGems <= 50) {
        this.applyGreenGrayscale = false;
        if (this.greenGems + 10 > 50) {
          this.greenGems = 50;
        }
        else {
          this.greenGems = this.greenGems + 100000000;
        }
        this.greenPercent = this.greenGems * 100000000;
      }
    }
  }

  bluePowerActivate() {
    this.blueGems = this.blueGems - 10;
    this.bluePercent = this.blueGems * 10;
    this.websocketService.sendClientTypeAndContent('anger', 'ghost');
    this.gemsEmitter.emit('blue');
  }

  redPowerActivate() {
    this.redGems = this.redGems - 10;
    this.redPercent = this.redGems * 10;
    this.websocketService.sendClientTypeAndContent('power', 'red');
    this.gemsEmitter.emit('red');
  }

  greenPowerActivate() {
    this.showTP = true;
  }

  noShowTp() {
    this.showTP = false;
  }

  TpToRise() {
    this.showTP = false;
    this.flipFlopRise = !this.flipFlopRise;
    this.websocketService.sendClientTypeAndContent('power', 'green');
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateDimensions();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateDimensions();
  }



  updateDimensions(): void {
    const hTotHeight = this.hTotDiv.nativeElement.clientHeight;
    this.circleSize = hTotHeight / 3 - 30;
    this.radiusBar = this.circleSize / 2 + 5;
    this.eyeSizeWidth = this.circleSize - 20;
    this.eyeSizeHeight = this.circleSize - 40;
    this.speedSizeWidth = this.circleSize - 30;

    const circles = document.querySelectorAll('.circle');
    circles.forEach(circle => {
      this.renderer.setStyle(circle, 'width', this.circleSize + 'px');
      this.renderer.setStyle(circle, 'height', this.circleSize + 'px');
    });
  }



}
