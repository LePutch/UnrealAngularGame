import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-popup-pincode',
  templateUrl: './popup-pincode.component.html',
  styleUrls: ['./popup-pincode.component.scss']
})
export class PopupPincodeComponent {

  @Output() codeEntered = new EventEmitter<boolean>();

  switchVision(value: boolean) {
    this.codeEntered.emit(value);
  }


}
