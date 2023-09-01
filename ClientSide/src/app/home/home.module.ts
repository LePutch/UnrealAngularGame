import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './header/header.component';
import { SimpleMessageComponent } from './simple-message/simple-message.component';
import { ServerConnexionComponent } from './server-connexion/server-connexion.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SimpleMessageComponent,
    ServerConnexionComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    HeaderComponent,
    SimpleMessageComponent,
    ServerConnexionComponent
  ]
})
export class HomeModule { }
