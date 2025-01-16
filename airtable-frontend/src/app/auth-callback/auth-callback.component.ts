import { AirtableService } from "./../services/airtable.service";
import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-auth-callback",
  imports: [],
  templateUrl: "./auth-callback.component.html",
  styleUrl: "./auth-callback.component.css",
})
export class AuthCallbackComponent {
  constructor(
    private route: ActivatedRoute,
    private AirtableService: AirtableService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const code = params["code"];
      if (code) {
        this.AirtableService.handleAuthCallback(code).subscribe({
          next: (data) => console.log("Access Token:", data),
          error: (err) => console.error("Error:", err),
        });
      }
    });
  }
}
