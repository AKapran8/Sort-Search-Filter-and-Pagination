import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ICity } from 'src/app/interfaces/Icities';
import { IWeather } from 'src/app/interfaces/IWeather';
import { CityService } from 'src/app/services/city.service';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
})
export class TemplateComponent implements OnInit, OnDestroy {
  @Output() onCityAdd = new EventEmitter<IWeather>();

  public cityName: string = '';
  public options: ICity[] = [];
  private _cityTimeout: any = null;

  private _getCitiesOptionSub: Subscription | null = null;
  private _weatherSub: Subscription | null = null;

  constructor(
    private _cityService: CityService,
    private _weatherService: WeatherService
  ) {}

  ngOnInit(): void {}

  public changeCity(event: Event) {
    this.cityName = (event.target as HTMLInputElement).value;

    if (this._cityTimeout !== null) {
      this._clearIntervalFunction();
    }
    this._setTimeoutFunction();
  }

  private _setTimeoutFunction() {
    this._cityTimeout = setTimeout(() => {
      this._getCitiesOptionSub = this._cityService
        .getCities(this.cityName)
        .subscribe((res) => {
          this.options = res;
        });
    }, 1);
  }

  private _clearIntervalFunction() {
    this._cityTimeout.clearInterval;
  }

  private _findWeather(val: string) {
    this._weatherSub = this._weatherService.getWeather(val).subscribe((res) => {
      if (res) {
        console.log(res);
        this.onCityAdd.emit(res);
      }
    });
  }

  public clickHandler(item: ICity) {
    this._findWeather(item.name);
    this.cityName = '';
  }

  ngOnDestroy() {
    this._clearIntervalFunction();
    this._getCitiesOptionSub?.unsubscribe();
    this._weatherSub?.unsubscribe();
  }
}
