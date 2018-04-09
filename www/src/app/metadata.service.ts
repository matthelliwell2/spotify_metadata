import {Injectable} from '@angular/core'
import {Track} from "./tracks/Track"
import {Observable} from 'rxjs/Observable'
import {HttpClient} from '@angular/common/http'

@Injectable()
export class MetadataService {

    private baseUrl = "http://localhost:3001"

    constructor(private http: HttpClient) {
    }

    getTracks(): Observable<Track[]> {
        return this.http.get<Track[]>(`${this.baseUrl}/tracks`)
    }
}
