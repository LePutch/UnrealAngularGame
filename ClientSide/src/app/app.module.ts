import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { HttpClientModule } from '@angular/common/http';

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
import { AdminComponent } from './admin/admin.component';

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
    AdminComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HomeModule,
    HttpClientModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
