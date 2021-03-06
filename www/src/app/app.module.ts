import {BrowserModule} from '@angular/platform-browser'
import {NgModule} from '@angular/core'

import {AppComponent} from './app.component'
import {FormsModule} from '@angular/forms'
import {MetadataService} from "./metadata.service"
import {AppRoutingModule} from './app-routing.module'
import {HttpClientModule} from "@angular/common/http"
import {AppNavbarComponent} from './app-navbar/app-navbar.component'
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'
import {AlbumComponent} from './album/album.component'
import {TagsComponent} from './tags/tags.component'
import {OcticonDirective} from './octicon.directive';
import {TagNameComponent} from './tag-name/tag-name.component';
import {TagValueComponent} from './tag-value/tag-value.component';

@NgModule({
    declarations: [
        AppComponent,
        AppNavbarComponent,
        AlbumComponent,
        TagsComponent,
        OcticonDirective,
        TagNameComponent,
        TagValueComponent,
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
