import { AuthInterceptor } from "./../intercepters/AuthInterceptor";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common"; // Import CommonModule
import { AirtableService } from "../services/airtable.service";
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: "app-connect-oauth",
  standalone: true, // Ensure this is set for standalone components
  imports: [CommonModule, LoaderComponent], // Include CommonModule here
  templateUrl: "./connect-oauth.component.html",
  styleUrls: ["./connect-oauth.component.css"],
})
export class ConnectOAuthComponent implements OnInit {
  isLoading = false;
  isTokenPresent: boolean = false;
  userName = "";
  routeParam: string | null = null;
  private authInterceptor: AuthInterceptor;

  constructor(
    public airtableService: AirtableService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    this.authInterceptor = new AuthInterceptor();
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.routeParam = params.get("access_token");
      this.authInterceptor.setToken(this.routeParam);
      if (this.routeParam) {
        localStorage.setItem("token", this.routeParam);
        this.isTokenPresent = true;
      }
    });
  }
}
