import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { HttpClientModule } from '@angular/common/http';
import { NgWhiteboardModule } from 'ng-whiteboard';

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
import { DrawingZoneComponent } from './phase1/drawing-zone/drawing-zone.component';
import { NavypopupComponent } from './navypopup/navypopup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { Phase2Component } from './phase2/phase2.component';
import { MinimapPhase2Component } from './phase2/minimap-phase2/minimap-phase2.component';
import { PincodeComponent } from './phase2/pincode/pincode.component';
import { PopupPincodeComponent } from './phase2/popup-pincode/popup-pincode.component';
import { NoteComponent } from './phase2/note/note.component';
import { PopupNoteComponent } from './phase2/popup-note/popup-note.component';
import { GhostpowerComponent } from './phase2/ghostpower/ghostpower.component';
import { Phase3Component } from './phase3/phase3.component';
import { MinimapPhase3Component } from './phase3/minimap-phase3/minimap-phase3.component';
import { Phase4Component } from './phase4/phase4.component';
import { MinimapPhase4Component } from './phase4/minimap-phase4/minimap-phase4.component'; // Assurez-vous d'importer MatDialogModule

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
    DrawingZoneComponent,
    NavypopupComponent,
    Phase2Component,
    MinimapPhase2Component,
    PincodeComponent,
    PopupPincodeComponent,
    NoteComponent,
    PopupNoteComponent,
    GhostpowerComponent,
    Phase3Component,
    MinimapPhase3Component,
    Phase4Component,
    MinimapPhase4Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    NgWhiteboardModule,
    HomeModule,
    HttpClientModule,
    MatDialogModule,
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
