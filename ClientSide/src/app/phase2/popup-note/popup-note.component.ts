import { Input } from '@angular/core';
import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { WhiteboardElement } from 'ng-whiteboard';

@Component({
  selector: 'app-popup-note',
  templateUrl: './popup-note.component.html',
  styleUrls: ['./popup-note.component.scss']
})
export class PopupNoteComponent implements OnDestroy {
  private isNoteComponentOpen = false;
  dataSavedWhiteBoard: WhiteboardElement[] = [];

  @Output() codeEntered = new EventEmitter<boolean>();
  @Output() dataSaved = new EventEmitter<WhiteboardElement[]>();
  @Input() savedDataToRestore: WhiteboardElement[] = [];

  switchVision(value: boolean) {
    this.isNoteComponentOpen = value;
    this.codeEntered.emit(value);
  }

  ngOnDestroy() {
    // Si le composant NoteComponent est fermé, réinitialiser les données du canvas
    if (!this.isNoteComponentOpen) {
      localStorage.removeItem('canvasData');
    }
  }

  savedData(data: any) {
    this.dataSavedWhiteBoard = data;
    this.dataSaved.emit(this.dataSavedWhiteBoard);
  }

}
