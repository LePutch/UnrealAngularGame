import { Component, EventEmitter, Output } from '@angular/core';
import { FormatType, NgWhiteboardService, WhiteboardElement, formatTypes } from 'ng-whiteboard';

@Component({
  selector: 'app-drawing-zone',
  templateUrl: './drawing-zone.component.html',
  styleUrls: ['./drawing-zone.component.scss']
})
export class DrawingZoneComponent {

  @Output()
  imageEmitter = new EventEmitter<string>();

  data: WhiteboardElement[] = [];
  color = '#333333';
  backgroundColor = '#eee';
  size = 5;
  isSizeActive = false;
  isSaveActive = false;
  formatType = FormatType;

  constructor(private whiteboardService: NgWhiteboardService) { }

  onSave(img: string) {
    // Copy to clipboard
    const cb = navigator.clipboard;
    if (cb) {
      cb.writeText(img);
    }
    this.imageEmitter.emit(img);
  }

  erase() {
    this.whiteboardService.erase();
  }
  setSize(size: number) {
    this.size = size;
    this.isSizeActive = false;
  }
  save(type: formatTypes) {
    console.log("save")
    this.whiteboardService.save(type);
    this.isSaveActive = false;
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
}
