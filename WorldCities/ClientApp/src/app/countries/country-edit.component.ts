import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, Inject } from "@angular/core";
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Country } from "./country";
import { BaseFormComponent } from "../base.form.component";

@Component({
  selector: "app-country-edit",
  templateUrl: "./country-edit.component.html",
  styleUrls: ["./country-edit.component.css"],
})
export class CountryEditComponent extends BaseFormComponent {
  title: string;
  form: FormGroup;
  country: Country;
  id?: number;

  constructor(
    private http: HttpClient,
    @Inject("BASE_URL") private baseUrl: string,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super();
    this.loadData();
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: ["", Validators.required, this.isDupeField("name")],
      iso2: [
        "",
        [Validators.required, Validators.pattern("[a-zA-z]{2}")],
        this.isDupeField("iso2"),
      ],
      iso3: [
        "",
        [Validators.required, Validators.pattern("[a-zA-z]{3}")],
        this.isDupeField("iso3"),
      ],
    });
    this.loadData();
  }

  loadData() {
    this.id = +this.activatedRoute.snapshot.paramMap.get("id");
    if (this.id) {
      var url = "http://localhost:5000/" + "api/countries/" + this.id;

      this.http.get<Country>(url).subscribe(
        (result) => {
          this.country = result;
          this.title = "Edit - " + this.country.name;
          this.form.patchValue(this.country);
        },
        (error) => console.error(error)
      );
    } else {
      this.title = "Create a new Country";
    }
  }

  onSubmit() {
    var country = this.id ? this.country : <Country>{};

    country.name = this.form.get("name").value;
    country.iso2 = this.form.get("iso2").value;
    country.iso3 = this.form.get("iso3").value;

    if (this.id) {
      var url = "http://localhost:5000/" + "api/countries" + this.country.id;
      this.http.put<Country>(url, country).subscribe(
        (result) => {
          console.log("Country" + country.id + "has been updated.");
          this.router.navigate(["/countries"]);
        },
        (error) => console.log(error)
      );
    } else {
      var url = "http://localhost:5000" + "api/countries";

      this.http.post<Country>(url, country).subscribe(
        (result) => {
          console.log("Country" + result.id + "has been created");
          this.router.navigate(["/countries"]);
        },
        (error) => console.error(error)
      );
    }
  }

  isDupeField(fieldName: string): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      var params = new HttpParams()
        .set("countryId", this.id ? this.id.toString() : "0")
        .set("fieldName", fieldName)
        .set("fieldValue", control.value);
      var url = "http//localhost:5000/" + "api/countries/IsDupeField";
      return this.http.post<boolean>(url, null, { params }).pipe(
        map((result) => {
          return result ? { isDupeField: true } : null;
        })
      );
    };
  }
}
