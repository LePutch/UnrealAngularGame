import { Component, ElementRef, ViewChild } from '@angular/core';
import { HostListener } from '@angular/core';

declare var particlesJS: any;

@Component({
  selector: 'app-background-particles',
  templateUrl: './background-particles.component.html',
  styleUrls: ['./background-particles.component.scss']
})
export class BackgroundParticlesComponent {


  ngAfterViewInit(): void {
    this.initParticles();
  }

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event: any): void {
    this.initParticlesRotate();
  }

  private initParticles() {
    particlesJS('particles-js', this.particleSettings);
  }

  private initParticlesRotate() {
    const existingParticlesElement = document.getElementById('particles-js');
    if (existingParticlesElement) {
      existingParticlesElement.remove();
    }

    particlesJS('particlesrotate', this.particleSettings);
  }

  private particleSettings = {
    particles: {
      number: {
        value: 600,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: ["#ffffff", "#39a5cc", "#b0f2ff", "#edb0ff"]
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#B3B3B3"
        },
        polygon: {
          nb_sides: 5
        }
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: {
          enable: false,
          speed: 0.2,
          opacity_min: 0,
          sync: false
        }
      },
      size: {
        value: 2,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0,
          sync: false
        }
      },
      line_linked: {
        enable: false,
        distance: 150,
        color: "#ffffff",
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 0.2,
        direction: "none",
        random: true,
        out_mode: "out",
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "bubble"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 1
          }
        },
        bubble: {
          distance: 84,
          size: 1,
          duration: 3,
          opacity: 1,
          speed: 3
        },
        repulse: {
          distance: 200,
          duration: 0.4
        },
        push: {
          particles_nb: 4
        },
        remove: {
          particles_nb: 2
        }
      }
    },
    retina_detect: true
  };






}


