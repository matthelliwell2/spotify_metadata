import {Injectable} from '@angular/core'
import {Observable} from 'rxjs/Observable'
import {HttpClient} from '@angular/common/http'
import {Album} from '../../../server/src/model/Album'

@Injectable()
export class MetadataService {

    private baseUrl = "http://192.168.1.68:3001"

    private tagNames: Observable<string[]>
    constructor(private http: HttpClient) {
    }

    getAlbum(id: string): Observable<Album> {
        return this.http.get<Album>(`${this.baseUrl}/album/${id}`)
    }

    putAlbum(album: Album): Observable<Object> {
        return this.http.post(`${this.baseUrl}/album`, album)
    }

    getTagNames(): Observable<string[]> {
        if (this.tagNames === undefined) {
            this.tagNames = this.http.get<string[]>(`${this.baseUrl}/tags/names`)
        }

        return this.tagNames
    }

    getTagValues(name: string, value: string): Observable<string[]> {
        return this.http.get<string[]>(`${this.baseUrl}/tags/name/${name}/value/${value}`)
    }
}
