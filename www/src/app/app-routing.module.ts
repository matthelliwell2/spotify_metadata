import {NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";
import {AlbumComponent} from "./album/album.component";

const routes = [
    {path: "album/:id", component: AlbumComponent}]

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule {
}
