import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './home/home.component';
import { HomeModule } from './home/home.module';
import { SpawnComponent } from './spawn/spawn.component';
import { MinimapComponent } from './spawn/minimap/minimap.component';
import { BoardInfosComponent } from './board-infos/board-infos.component'
import { LevelInfosComponent } from './level-infos/level-infos.component';
import { PowerInfosComponent } from './power-infos/power-infos.component';
import { Phase1Component } from './phase1/phase1.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SpawnComponent,
    MinimapComponent,
    BoardInfosComponent,
    LevelInfosComponent,
    PowerInfosComponent,
    Phase1Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
