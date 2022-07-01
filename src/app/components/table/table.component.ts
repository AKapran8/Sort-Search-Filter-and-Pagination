import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IWeather } from 'src/app/interfaces/IWeather';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  // For expandable rows
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class TableComponent implements OnInit, OnChanges {
  // General array
  // @Input must be
  public cities: IWeather[] = [
    { cod: 250, name: 'lviv', id: '1', population: 1500 },
    { cod: 150, name: 'Dnipro', id: '2', population: 140 },
    { cod: 350, name: 'Odessa', id: '3', population: 480 },
    { cod: 550, name: 'Dubno', id: '4', population: 180 },
    { cod: 450, name: 'Donetck', id: '5', population: 10 },
    { cod: 650, name: 'Kiev', id: '6', population: 15880 },
    { cod: 750, name: 'Zmerinka', id: '7', population: 1234 },
  ];

  public modifiedData: IWeather[] = [];
  // array for template
  public displayModifiedData: IWeather[] = [];

  public displayedColumnsDefault: string[] = [
    'cod',
    'name',
    'id',
    'population',
  ];
  public displayedColumns: string[] = [];

  public isTableShown: boolean = false;
  // variable for expandable rows
  public expandedElement!: IWeather | null;

  // !↓ All the configs section
  private _sortConfig: Sort = {
    active: '',
    direction: 'asc',
  };
  private _paginationConfig: PageEvent = {
    length: 0,
    pageIndex: 0,
    pageSize: 3,
    previousPageIndex: 0,
  };
  private _filterCommonConfig = '';
  private _filterColumnConfig = {
    cod: '',
    name: '',
    id: '',
    population: '',
  };

  ngOnInit(): void {
    this.displayedColumns = [...this.displayedColumnsDefault];

    this._modifyData();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.cities) {
      this._modifyData();
      this.isTableShown = this.cities.length > 0;
    }
  }

  // ! GENERAL Function
  private _modifyData() {
    this.modifiedData = [...this.cities];

    this._totalFilter();
    this._filterByKey();
    this._sortData();
    this._paginateData();
  }
  // !

  // ! total filter start
  public applyTotalFilter(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value
      .toString()
      .trim()
      .toLocaleLowerCase();
    this._filterCommonConfig = filterValue;

    this._resetPagination();
    this._modifyData();
  }

  private _totalFilter() {
    let arr: IWeather[] = [];
    if (this._filterCommonConfig === '') {
      arr = this.modifiedData;
    } else {
      for (let i = 0; i < this.modifiedData.length; i++) {
        // find all the values of array
        let values = Object.values(this.modifiedData[i]);
        values.forEach((val) => {
          // find filter config value in all the new array: values
          if (val.toString().toLowerCase().includes(this._filterCommonConfig)) {
            // if success then push object for arr
            arr.push(this.modifiedData[i]);
          }
        });
      }
    }
    this.modifiedData = arr;
  }
  // ! total filter fin
  // ? filter by key start
  public applyTotalFilterByKey(event: Event, key: string) {
    let filterValue = (event.target as HTMLInputElement).value
      .toString()
      .trim()
      .toLocaleLowerCase();
    // @ts-ignore
    this._filterColumnConfig[key] = filterValue;
    this._resetPagination();
    this._modifyData();
  }

  private _filterByKey() {
    let keys = Object.keys(this._filterColumnConfig);

    keys.forEach((key) => {
      // @ts-ignore
      // ! Active after user write some text
      if (this._filterColumnConfig[key] !== '') {
        this.modifiedData = [
          // Clone and filter modifiedData array
          ...this.modifiedData.filter((city) => {
            return (
              // @ts-ignore
              city[key]
                .toString()
                .trim()
                .toLowerCase()
                // @ts-ignore
                .includes(this._filterColumnConfig[key])
            );
          }),
        ];
      }
    });
  }
  // ? filter by key fin
  // * sort start
  // ! active sort after click, that why Handler
  public sortHandler(event: Sort) {
    this._sortConfig = event;
    this._modifyData();
  }

  private _sortData() {
    this.modifiedData = [
      ...this.modifiedData.sort((a, b) => {
        // first sort by growth
        // after sort by decrease
        const isAsc = this._sortConfig.direction === 'asc';
        return this._compare(
          // @ts-ignore
          a[this._sortConfig.active],
          // @ts-ignore
          b[this._sortConfig.active],
          isAsc
        );
      }),
    ];
  }

  private _compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  // * sort fin
  // ? pagination start
  public onPageChange(event: PageEvent) {
    this._paginationConfig = event;
    this._modifyData();
  }

  private _paginateData() {
    let startIndex =
      this._paginationConfig.pageIndex * this._paginationConfig.pageSize;
    let endIndex = startIndex + this._paginationConfig.pageSize;
    if (endIndex > this.modifiedData.length) {
      endIndex = this.modifiedData.length;
    }
    // Clone modifiedData array
    this.displayModifiedData = [...this.modifiedData];
    // Cropped the array to display a certain number of items on the page
    this.displayModifiedData = this.modifiedData.slice(startIndex, endIndex);
  }

  private _resetPagination() {
    if (this._paginationConfig) {
      this._paginationConfig = { ...this._paginationConfig, pageIndex: 0 };
    }
  }
  // ? pagination finish
}

