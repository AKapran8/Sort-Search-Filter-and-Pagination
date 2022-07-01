import { Component } from '@angular/core';
import { IWeather } from './interfaces/IWeather';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public cities: IWeather[] = [];

  public onCityAddHandler(val: IWeather) {
    const newCities = [...this.cities];
    newCities.push(val);
    this.cities = newCities;
  }
}
