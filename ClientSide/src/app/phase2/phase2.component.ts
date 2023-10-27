import { Component, ElementRef, QueryList, ViewChild, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { WebSocketConnexionService } from '../shared/services/web-socket-connexion.service';
import { ViewChildren } from '@angular/core';
import { NgModel } from '@angular/forms';
import { WhiteboardElement } from 'ng-whiteboard';

@Component({
  selector: 'app-phase2',
  templateUrl: './phase2.component.html',
  styleUrls: ['./phase2.component.scss']
})
export class Phase2Component {

  characterX: number = 0;
  characterY: number = 0;
  showPincodePopup: boolean = false; // Ajout de la variable pour afficher/masquer la popup
  showNotePopup: boolean = false; // Ajout de la variable pour afficher/masquer la popup
  noteData: WhiteboardElement[] = [];
  noteButton: boolean = true;
  showGhostPower: boolean = false;
  showMinimap: boolean = true;

  private unsubscribe$ = new Subject<void>();
  constructor(private websocketService: WebSocketConnexionService) { }

  ngOnInit() {
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

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  savedNoteData(data: any) {
    this.noteData = data;
  }

  switchPopup(value: boolean) {
    this.showPincodePopup = value;
    this.websocketService.sendClientTypeAndContent('anger', 'mainDoor');
  }

  switchPopupNote(value: boolean) {
    this.showNotePopup = value;
  }


  messageHandler(message: any) {
    if (message.type === 'coords') {
      const parts = message.message.split(' ');
      const xValue = parseFloat(parts[0].split('=')[1]);
      const yValue = parseFloat(parts[1].split('=')[1]);
      this.characterX = xValue;
      this.characterY = yValue;
    }
    if (message.type === 'anger') {
      if (message.content === 'code') {
        this.showPincodePopup = true;
      }
      if (message.content === 'noCode') {
        this.showPincodePopup = false;
      }
      if (message.content === 'lastRoom') {
        this.noteButton = false;
        this.showPincodePopup = false;
        this.showMinimap = false;
        this.showGhostPower = true;
      }
    }


  }
}


