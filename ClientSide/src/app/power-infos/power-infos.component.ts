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

  bluePercent: number = 0;
  redPercent: number = 0;
  greenPercent: number = 0;

  constructor(private ngProgress: NgProgress, private renderer: Renderer2, private websocketService: WebSocketConnexionService) {
    this.phases = INITIAL_STATE
  }

  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    this.updateDimensions();
    this.websocketService.getSocket()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        (message) => {
          if (message.type !== 'coords') {
            console.log('Received:', message);
          }
          this.messageHandler(message);
        },
        (err) => {
          console.error('Error:', err);
        },
        () => {
          console.log('WebSocket connection closed.');
        }
      );
  }

  messageHandler(message: any) {
    if (message.type === 'gems') {
      if (message.content === 'red') {
        this.redGems++;
        this.redPercent = this.redGems * 10;
      }
      if (message.content === 'blue') {
        this.blueGems++;
        this.bluePercent = this.blueGems * 10;
      }
      if (message.content === 'green') {
        this.greenGems++;
        this.greenPercent = this.greenGems * 10;
      }
    }
  }

  bluePowerActivate() {
    this.blueGems = this.blueGems - 10;
    this.bluePercent = this.blueGems * 10;
    this.gemsEmitter.emit('blue');
  }

  redPowerActivate() {
    this.redGems = this.redGems - 10;
    this.redPercent = this.redGems * 10;
    this.gemsEmitter.emit('red');
  }

  greenPowerActivate() {
    this.greenGems = this.greenGems - 10;
    this.greenPercent = this.greenGems * 10;
    this.gemsEmitter.emit('green');
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
