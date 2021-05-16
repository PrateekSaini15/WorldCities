import { Component, Inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { City } from "./City";
import { Country } from "./../countries/country";

@Component({
  selector: "app-city-edit",
  templateUrl: "./city-edit.component.html",
  styleUrls: ["./city-edit.component.css"],
})
export class CityEditComponent {
  title: string;
  form: FormGroup;
  city: City;
  id?: number;
  countries: Country[];
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    @Inject("BASE_URL") private baseUrl: string
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl("", Validators.required),
      lat: new FormControl("", Validators.required),
      lon: new FormControl("", Validators.required),
      countryId: new FormControl("", Validators.required),
    });
    this.loadData();
  }

  loadData() {
    this.loadCountries();
    this.id = +this.activatedRoute.snapshot.paramMap.get("id");

    if (this.id) {
      var url = "http://localhost:5000/" + "api/cities/" + this.id;
      this.http.get<City>(url).subscribe(
        (result) => {
          this.city = result;
          this.title = "Edit - " + this.city.name;

          this.form.patchValue(this.city);
        },
        (error) => console.error(error)
      );
    } else {
      this.title = "Create a new city";
    }
  }

  loadCountries() {
    var url = "http://localhost:5000/" + "api/countries";
    var params = new HttpParams()
      .set("pageSize", "9999")
      .set("sortColumn", "name");

    this.http.get<any>(url, { params }).subscribe(
      (result) => {
        this.countries = result.data;
      },
      (error) => console.log(error)
    );
  }
  onSubmit() {
    var city = this.id ? this.city : <City>{};

    city.name = this.form.get("name").value;
    city.lat = +this.form.get("lat").value;
    city.lon = +this.form.get("lon").value;
    city.countryId = +this.form.get("countryId").value;

    if (this.id) {
      var url = "http://localhost:5000/" + "api/cities" + this.city.id;
      this.http.put<City>(url, city).subscribe(
        (result) => {
          console.log("City" + city.id + "has been updated.");

          this.router.navigate(["/cities"]);
        },
        (error) => console.log(error)
      );
    } else {
      var url = "http://localhost:5000/" + "api/cities";
      this.http.post<City>(url, city).subscribe(
        (result) => {
          console.log("City" + result.id + "has been created.");

          this.router.navigate(["/cities"]);
        },
        (error) => console.error(error)
      );
    }
  }
}
