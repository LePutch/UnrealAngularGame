import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { WebSocketConnexionService } from '../shared/services/web-socket-connexion.service';

@Component({
  selector: 'app-phase1',
  templateUrl: './phase1.component.html',
  styleUrls: ['./phase1.component.scss']
})
export class Phase1Component implements OnInit, OnChanges {

  // Dans votre composant Angular, vous pouvez utiliser HttpClient pour lire le fichier image.
  constructor(private http: HttpClient, private websocketService: WebSocketConnexionService) { }
  private unsubscribe$ = new Subject<void>();

  //création d'une variable hashtable de clés / valeurs: avec clé = couleur du levier (yellow, red, blue, green) et valeur: boolean initialisés à false
  levers = new Map([
    ['yellow', false],
    ['red', false],
    ['blue', false],
    ['green', false]
  ]);

  etapes = [
    ['green', 'yellow', 'red', 'blue'],
    ['yellow', 'blue', 'red', 'green'],
    ['green', 'yellow', 'blue', 'red']
  ];

  etapeActuelle = 0;
  step1 = true;
  step2 = false;
  step3 = false;
  step4 = false;

  ngOnInit() {
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

    if (message.type === 'lever') {
      this.handleLever(message.color);
    }

  }

  handleLever(color: string) {
    this.activerLevier(color);
  }



  levierAttendu = 0;

  // Fonction appelée lorsqu'un levier est activé
  activerLevier(couleur: string) {
    if (this.etapes[this.etapeActuelle][this.levierAttendu] === couleur) {
      // Le levier est activé dans le bon ordre
      this.levers.set(couleur, true);
      this.levierAttendu++; // Passe au levier suivant

      // Vérifie si l'étape est terminée
      if (this.levierAttendu === this.etapes[this.etapeActuelle].length) {
        this.etapeSuivante(); // Passe à l'étape suivante

        this.levierAttendu = 0; // Réinitialise le levier attendu
      }
    } else {
      // Le levier est activé dans le mauvais ordre, réinitialisez les leviers
      this.levierAttendu = 0;
      this.resetLevers();
    }
  }

  // Fonction pour vérifier si tous les leviers sont dans le bon ordre
  verifierOrdreLeviers() {
    const etapeCourante = this.etapes[this.etapeActuelle];
    let tousCorrects = true;

    for (const couleur of etapeCourante) {
      if (!this.levers.get(couleur)) {
        tousCorrects = false;
        break;
      }
    }

    if (tousCorrects) {
      this.etapeSuivante();
    }
  }

  // Fonction pour passer à l'étape suivante
  etapeSuivante() {
    this.etapeActuelle++;
    this.sendEtapeSuivante();
    if (this.step2 === false && this.step1 === true) {
      this.step2 = true;
      this.step1 = false;
    }
    else {
      if (this.step3 === false && this.step2 === true) {
        this.step3 = true;
        this.step2 = false;
        this.step1 = false;
      }
      else {
        if (this.step4 === false && this.step3 === true) {
          this.step4 = true;
          this.step3 = false;
          this.step1 = false;
          this.step2 = false;
        }
      }
    }
    if (this.etapeActuelle === this.etapes.length) {
      // Toutes les étapes sont terminées, vous pouvez gérer la victoire ici
    } else {
      // Réinitialisez les leviers pour la prochaine étape
      this.resetLevers();
    }
  }

  // Fonction pour réinitialiser tous les leviers
  resetLevers() {
    for (const couleur of this.levers.keys()) {
      this.levers.set(couleur, false);
    }
    this.sendResetLever();
  }


  sendResetLever() {
    this.websocketService.sendClientType('resetLevers');
  }

  sendEtapeSuivante() {
    this.websocketService.sendClientType('nextLevelLevers');
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  sendImage(base64Image: any) {
    base64Image = base64Image.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
    this.websocketService.sendDraw(base64Image);
  }

  // // Fonction pour lire un fichier image et envoyer les informations de texture via WebSocket
  // async sendTextureInfo() {
  //   try {
  //     // Lisez le fichier image depuis un emplacement dans vos assets
  //     const imageResponse = await this.http.get('../../assets/character.png', { responseType: 'arraybuffer' }).toPromise() as ArrayBuffer;

  //     // Convertissez les données de l'image en une chaîne base64
  //     const base64Image = this.arrayBufferToBase64(imageResponse);

  //     this.websocketService.sendDraw(base64Image);


  //     // Envoyez cette chaîne JSON via WebSocket à votre application Unreal Engine
  //     // Le code WebSocket dépend de votre implémentation spécifique
  //   } catch (error) {
  //     console.error('Erreur lors de la lecture du fichier image :', error);
  //   }
  // }

  // // Fonction pour convertir un tableau d'octets en chaîne base64
  // arrayBufferToBase64(arrayBuffer: ArrayBuffer) {
  //   let binary = '';
  //   const bytes = new Uint8Array(arrayBuffer);
  //   for (let i = 0; i < bytes.byteLength; i++) {
  //     binary += String.fromCharCode(bytes[i]);
  //   }
  //   return btoa(binary);
  // }

}




