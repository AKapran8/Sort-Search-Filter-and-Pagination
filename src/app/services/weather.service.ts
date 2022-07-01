import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IWeather } from '../interfaces/IWeather';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  key: string = 'b651f2f480028fd21158b82015cd9eff';

  constructor(private http: HttpClient) {}

  getWeather(cityName: string): Observable<IWeather> {
    return this.http.get<IWeather>(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${this.key}`
    );
  }
}
