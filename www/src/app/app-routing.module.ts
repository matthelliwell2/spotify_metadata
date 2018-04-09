import {NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";
import {TracksComponent} from "./tracks/tracks.component";

const routes = [{path:"tracks", component: TracksComponent}]
@NgModule({
    exports: [RouterModule],
    imports: [ RouterModule.forRoot(routes)]
})
export class AppRoutingModule {
}
