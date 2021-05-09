import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {City} from './city';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {

  public cities: City[];
  public displayedColumns: string[] = ['id', 'name', 'lat', 'lon'];

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  ngOnInit(): void {
    this.http.get<City[]>("http://localhost:5000/api/cities").subscribe(result => {
      this.cities = result;
    }, error => console.error(error));
  }

}
