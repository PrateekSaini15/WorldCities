import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

import {City} from './city';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent {

  public cities: MatTableDataSource<City>;
  public displayedColumns: string[] = ['id', 'name', 'lat', 'lon'];

  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "name";
  public deafultSortOrder: string = "asc";

  @ViewChild('paginator') paginator : MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  ngOnInit(): void {
    this.loadData(); 
  }

  loadData(){
    var pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.getData(pageEvent);
  }

  getData(event: PageEvent){
    var url = "http://localhost:5000/" + "api/Cities";
    var params = new HttpParams()
      .set("pageIndex", event.pageIndex.toString())
      .set("pageSize", event.pageSize.toString())
      .set("sortColumn", (this.sort) ? this.sort.active : this.defaultSortColumn)
      .set("sortOrder", (this.sort) ? this.sort.direction : this.deafultSortOrder);

    this.http.get<any>(url, {params})
      .subscribe(result => {
        this.paginator.length = result.totalCount;
        this.paginator.pageSize = result.pageSize;
        this.paginator.pageIndex = result.pageIndex;
        this.cities = new MatTableDataSource<City>(result.data);
      }, error => console.error(error));
  }

}
