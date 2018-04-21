import {Injectable} from '@angular/core'
import {Observable} from 'rxjs/Observable'
import {HttpClient} from '@angular/common/http'
import {Album} from '../../../server/src/model/Album'

@Injectable()
export class MetadataService {

    private baseUrl = "http://localhost:3001"

    constructor(private http: HttpClient) {
    }

    getAlbum(id: string): Observable<Album> {
        return this.http.get<Album>(`${this.baseUrl}/album/${id}`)
    }

    putAlbum(album: Album): Observable<Object> {
        return this.http.post(`${this.baseUrl}/album`, album)
    }
}
