import { Component, EventEmitter, Output, OnInit, OnDestroy, Input } from '@angular/core';
import { WhiteboardElement, formatTypes, FormatType, NgWhiteboardService } from 'ng-whiteboard';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit, OnDestroy {
  @Output() closeNoteEvent = new EventEmitter<boolean>();
  @Output() dataSaved = new EventEmitter<WhiteboardElement[]>();

  @Input() savedData: WhiteboardElement[] = [];

  data: WhiteboardElement[] = [];
  color = '#333333';
  backgroundColor = '#eee';
  size = 5;
  isSizeActive = false;
  isSaveActive = false;
  formatType = FormatType;

  constructor(private whiteboardService: NgWhiteboardService) { }

  ngOnInit() {
    // Restaurer les données du canvas depuis le localStorage
    this.data = this.savedData;
  }

  ngOnChanges() {
    // Restaurer les données du canvas depuis le localStorage
    this.data = this.savedData;
  }

  onSave(img: string) {
    // Copy to clipboard
    const cb = navigator.clipboard;
    if (cb) {
      cb.writeText(img);
    }
    // Sauvegarder les données du canvas dans le localStorage
  }

  erase() {
    this.whiteboardService.erase();
    this.data = [];
    this.dataSaved.emit(this.data);
  }

  setSize(size: number) {
    this.size = size;
    this.isSizeActive = false;
  }

  save(type: formatTypes) {
    this.whiteboardService.save(type);
    this.isSaveActive = false;
  }

  closeNote() {
    this.dataSaved.emit(this.data);
    this.closeNoteEvent.emit(false); // Émettez 'false' pour indiquer que le canvas est fermé
  }

  undo() {
    this.whiteboardService.undo();
  }

  redo() {
    this.whiteboardService.redo();
  }

  addImage(fileInput: EventTarget | null) {
    if (fileInput) {
      const files = (fileInput as HTMLInputElement).files;
      if (files) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent) => {
          const image = (e.target as FileReader).result;
          this.whiteboardService.addImage(image as string);
        };
        reader.readAsDataURL(files[0]);
      }
    }
  }

  openImageDialog(): void {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'image/*';
    inputElement.click();

    inputElement.addEventListener('change', (event: any) => {
      this.addImage(event.target.files[0]);
    });
  }

  setColor(event: Event) {
    const target = event.target as HTMLInputElement;
    this.color = target.value;
  }

  setBackgroundColor(event: Event) {
    const target = event.target as HTMLInputElement;
    this.backgroundColor = target.value;
  }

  ngOnDestroy() {
    // Vous pouvez ajouter d'autres actions de nettoyage si nécessaire
  }

}
