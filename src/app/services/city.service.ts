import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICity } from '../interfaces/Icities';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  constructor(private http: HttpClient) {}

  getCities(cityName: string): Observable<ICity[]> {
    return this.http.get<ICity[]>('https://spott.p.rapidapi.com/places', {
      headers: {
        'x-rapidapi-host': 'spott.p.rapidapi.com',
        'x-rapidapi-key': 'b4d1f14161msh62a305c83d9efa4p1544afjsn4015c5ea9c93',
      },
      params: {
        q: cityName,
        limit: 10,
        country: 'UA',
        skip: 0,
        type: 'CITY',
      },
    });
  }
}
