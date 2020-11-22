import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {WorddisplayComponent} from './component/worddisplay/worddisplay.component';
import {ScoreboardComponent} from './component/scoreboard/scoreboard.component';
import {TmijsService} from './service/tmijs.service';
import {LoginComponent} from './component/login/login.component';
import {WordsComponent} from './component/game/words/words.component';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {LoadingService} from './service/loading.service';
import {ContextMenuModule} from 'primeng/contextmenu';

@NgModule({
  declarations: [
    AppComponent,
    WorddisplayComponent,
    ScoreboardComponent,
    LoginComponent,
    WordsComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        ProgressSpinnerModule,
        ButtonModule,
        InputTextModule,
        ContextMenuModule
    ],
  providers: [TmijsService, LoadingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
