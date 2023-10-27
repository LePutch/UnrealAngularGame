import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-pincode',
  templateUrl: './pincode.component.html',
  styleUrls: ['./pincode.component.scss']
})
export class PincodeComponent {
  isButtonClicked: boolean[] = [false, false, false, false, false, false, false, false, false];
  correctCode = [4, 1, 3, 7, 2];
  clickedNumbers: number[] = [];
  clicks = 0;
  isChecking = false;
  isWrongCode = false;

  // event emitter pour le composant parent
  @Output() codeEntered = new EventEmitter<boolean>();

  onNumberClick(index: number) {
    if (!this.isButtonClicked[index] && this.clicks < 5) {
      this.isButtonClicked[index] = true;
      this.clickedNumbers.push(index + 1);
      this.clicks++;

      if (this.clicks === 5) {
        this.isChecking = true; // Active l'animation

        setTimeout(() => {
          this.checkCode();
        }, 1000); // Délai d'1 seconde (peut être ajusté)
      }
    }
  }

  checkCode() {
    const codeMatches = JSON.stringify(this.clickedNumbers) === JSON.stringify(this.correctCode);

    if (codeMatches) {
      this.codeEntered.emit(false);
      this.isButtonClicked.fill(true);
    } else {
      this.isButtonClicked.fill(false);
      this.isWrongCode = true;
    }

    // Réinitialisez les boutons cliqués, le tableau de chiffres, le compteur et l'état d'erreur
    setTimeout(() => {
      this.isButtonClicked.fill(false);
      this.clickedNumbers = [];
      this.clicks = 0;
      this.isChecking = false;
      this.isWrongCode = false;
    }, 1000); // Réinitialisation après 1 seconde
  }
}
