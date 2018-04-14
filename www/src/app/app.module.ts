import {BrowserModule} from '@angular/platform-browser'
import {NgModule} from '@angular/core'

import {AppComponent} from './app.component'
import {TracksComponent} from './tracks/tracks.component'
import {FormsModule} from '@angular/forms'
import {MetadataService} from "./metadata.service"
import {AppRoutingModule} from './app-routing.module'
import {HttpClientModule} from "@angular/common/http";
import {AppNavbarComponent} from './app-navbar/app-navbar.component'
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'

@NgModule({
    declarations: [
        AppComponent,
        TracksComponent,
        AppNavbarComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        NgbModule.forRoot()
    ],
    providers: [MetadataService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
