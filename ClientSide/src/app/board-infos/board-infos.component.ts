import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IPhase, INITIAL_STATE } from '../shared/shared-state';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { Subject } from 'rxjs';
import { WebSocketConnexionService } from '../shared/services/web-socket-connexion.service';

@Component({
  selector: 'app-board-infos',
  templateUrl: './board-infos.component.html',
  styleUrls: ['./board-infos.component.scss']
})
export class BoardInfosComponent {
  @Input()
  phases: IPhase;

  @Input()
  bluePower!: boolean;
  @Input()
  redPower!: boolean;
  @Input()
  greenPower!: boolean;

  constructor(private websocketService: WebSocketConnexionService) {
    this.phases = INITIAL_STATE;
  }

  greenGems: number = 0;
  blueGems: number = 0;
  redGems: number = 0;



  JPGFile = '../../assets/OBJTEST/Textures1.PNG';

  textureLoader = new THREE.TextureLoader();
  textureObj = this.textureLoader.load(this.JPGFile);
  greenMaterial = new THREE.MeshPhongMaterial({
    color: 0x32a846, // Vert
    shininess: 300, // Brillance élevée (ajustez selon vos besoins)
    specular: 0x00ff00, // Couleur spéculaire verte
    map: this.textureObj,
  });

  blueMaterial = new THREE.MeshPhongMaterial({
    color: 0x2c2699,     // Bleu
    shininess: 300,      // Brillance élevée (ajustez selon vos besoins)
    specular: 0x0000ff,  // Couleur spéculaire bleue
  });

  redMaterial = new THREE.MeshPhongMaterial({
    color: 0xa62323,     // Rouge
    shininess: 300,      // Brillance élevée (ajustez selon vos besoins)
    specular: 0xff0000,  // Couleur spéculaire rouge
  });
  alreadyResized = true;

  private unsubscribe$ = new Subject<void>();
  phaseName: string = '';

  ngOnInit() {
    // this.test();
    this.websocketService.getSocket()
      .subscribe(
        (message) => {
          console.log('Received:', message);
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


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bluePower'] && !changes['bluePower'].firstChange) {
      this.blueGems = this.blueGems - 10;
    }
    if (changes['redPower'] && !changes['redPower'].firstChange) {
      this.redGems = this.redGems - 10;
    }
    if (changes['greenPower'] && !changes['greenPower'].firstChange) {
      this.greenGems = this.greenGems - 10;
    }
  }

  messageHandler(message: any) {
    if (message.type === 'gems') {
      if (message.content === 'red') {
        this.redGems++;
      }
      if (message.content === 'blue') {
        this.blueGems++;
      }
      if (message.content === 'green') {
        this.greenGems++;
      }
    }
    if (message.type === 'phase') {
      this.phaseName = message.content;
    }
  }

  ngAfterViewInit(): void {
    // set timeout to wait for the view to init
    setTimeout(() => {
      this.initGems('model1', this.greenMaterial, -90, false);
      this.initGems('model2', this.blueMaterial, -70.1, true);
      this.initGems('model3', this.redMaterial, -80.5, false);
    }, 1000);

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    console.log('resize')
    this.alreadyResized = false;
    if (this.alreadyResized) {
      setTimeout(() => {
        this.initGems('model1', this.greenMaterial, -90, false);
        this.initGems('model2', this.blueMaterial, -70.1, true);
        this.initGems('model3', this.redMaterial, -80.5, false);
      }, 100);
    }
  }



  initGems(canva: string, material: THREE.MeshPhongMaterial, rotationAngle: number, hemisphereLightBoolean: boolean) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 500000);
    camera.position.z = 90;
    camera.position.y = 10;
    camera.position.x = 0;

    const canvas = document.getElementById(canva) as HTMLCanvasElement;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); // Activez l'alpha
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const dpi = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpi;
    canvas.height = window.innerHeight * dpi;
    renderer.setPixelRatio(dpi);

    // Créez un éclairage à la scène
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(1, 1, 1);
    scene.add(light);

    const light2 = new THREE.DirectionalLight(0xffffff, 2);
    light2.position.set(1, 1, 1);
    scene.add(light2);

    // Chargez l'objet FBX
    const loader = new FBXLoader();
    loader.load('../../assets/gem1/FirstPhase.fbx', (fbx) => {
      // Créez une instance du modèle FBX pour chaque appel à initGems
      const fbxInstance = fbx.clone();
      // Ajustez la position, la rotation et la mise à l'échelle de l'objet FBX si nécessaire
      fbxInstance.position.set(0, -30, 0);
      fbxInstance.rotation.set(-90, 0, rotationAngle);
      fbxInstance.scale.set(0.5, 0.5, 0.5);

      // Création de la "HemisphereLight"
      if (hemisphereLightBoolean) {

        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 2); // Utilisez une couleur blanche pour l'illumination diffuse (0xffffff) et une couleur noire pour l'illumination ambiante (0x000000)

        // Positionnez la "HemisphereLight" sous votre objet (vers le bas)
        hemisphereLight.position.set(0, -20, 0); // Vous pouvez ajuster la position verticale selon vos besoins

        // Ajoutez la "HemisphereLight" à la scène
        scene.add(hemisphereLight);
      }


      //ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      // Parcourez les enfants de l'objet FBX et appliquez le matériau à chaque mesh
      fbxInstance.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = material;
        }
      });

      // Ajoutez l'instance à la scène
      scene.add(fbxInstance);

      let lightRotationAngle = 0;

      const animate = () => {
        requestAnimationFrame(animate);

        // Faites tourner doucement l'objet FBX
        fbxInstance.rotation.z += 0.005;
        const radius = 10; // Rayon de la rotation
        const speed = 0.03; // Vitesse de rotation (ajustez selon vos besoins)
        const lightX = radius * Math.cos(lightRotationAngle);
        const lightZ = radius * Math.sin(lightRotationAngle);
        light.position.set(lightX, 1, lightZ);

        // Incrémentez l'angle de rotation
        lightRotationAngle += speed;

        renderer.render(scene, camera);
      };

      animate();
    });
  }

}

