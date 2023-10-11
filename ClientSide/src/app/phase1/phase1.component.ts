import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { WebSocketConnexionService } from '../shared/services/web-socket-connexion.service';

@Component({
  selector: 'app-phase1',
  templateUrl: './phase1.component.html',
  styleUrls: ['./phase1.component.scss']
})
export class Phase1Component {

  // Dans votre composant Angular, vous pouvez utiliser HttpClient pour lire le fichier image.
  constructor(private http: HttpClient, private websocketService: WebSocketConnexionService) { }
  private unsubscribe$ = new Subject<void>();

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
        },
        (err) => {
          console.error('Error:', err);
        },
        () => {
          console.log('WebSocket connection closed.');
        }
      );
  }
  // Fonction pour lire un fichier image et envoyer les informations de texture via WebSocket
  async sendTextureInfo() {
    try {
      // Lisez le fichier image depuis un emplacement dans vos assets
      const imageResponse = await this.http.get('../../assets/bgTest.png', { responseType: 'arraybuffer' }).toPromise() as ArrayBuffer;

      // Convertissez les données de l'image en une chaîne base64
      const base64Image = this.arrayBufferToBase64(imageResponse);

      this.websocketService.sendDraw(base64Image);


      // Envoyez cette chaîne JSON via WebSocket à votre application Unreal Engine
      // Le code WebSocket dépend de votre implémentation spécifique
    } catch (error) {
      console.error('Erreur lors de la lecture du fichier image :', error);
    }
  }

  // Fonction pour convertir un tableau d'octets en chaîne base64
  arrayBufferToBase64(arrayBuffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(arrayBuffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

}




