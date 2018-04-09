import {BrowserModule} from '@angular/platform-browser'
import {NgModule} from '@angular/core'

import {AppComponent} from './app.component'
import {TracksComponent} from './tracks/tracks.component'
import {FormsModule} from '@angular/forms'
import {MetadataService} from "./metadata.service"
import { AppRoutingModule } from './app-routing.module'
import {HttpClientModule} from "@angular/common/http"

@NgModule({
    declarations: [
        AppComponent,
        TracksComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [MetadataService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
