import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ICity } from 'src/app/interfaces/Icities';
import { CityService } from 'src/app/services/city.service';
import { debounceTime } from 'rxjs/operators';
import { Output } from '@angular/core';
import { WeatherService } from 'src/app/services/weather.service';
import { IWeather } from 'src/app/interfaces/IWeather';

@Component({
  selector: 'app-reactive',
  templateUrl: './reactive.component.html',
  styleUrls: ['./reactive.component.scss'],
})
export class ReactiveComponent implements OnInit, OnDestroy {
  @Output() onCityAdd = new EventEmitter<IWeather>();

  public cityControl = new FormControl();
  public options: ICity[] = [];
  private _cityControlValueChangesSub: Subscription | null = null;
  private _getCitiesOptionSub: Subscription | null = null;
  private _weatherSub: Subscription | null = null;

  constructor(
    private _cityService: CityService,
    private _weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    this._cityControlValueChangesSub = this.cityControl.valueChanges
      .pipe(debounceTime(1))
      .subscribe((val) => {
        this._getCitiesOptionSub = this._cityService
          .getCities(val)
          .subscribe((res) => {
            this.options = res;
          });
      });
  }

  private _findWeather(val: string) {
    this._weatherSub = this._weatherService.getWeather(val).subscribe((res) => {
      if (res) {
        this.onCityAdd.emit(res);
      }
    });
  }

  public clickHandler(item: ICity) {
    this._findWeather(item.name);
    this.cityControl.reset();
  }

  ngOnDestroy() {
    this._cityControlValueChangesSub?.unsubscribe();
    this._getCitiesOptionSub?.unsubscribe();
    this._weatherSub?.unsubscribe();
  }
}
