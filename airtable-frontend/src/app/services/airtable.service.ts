import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AirtableService {
  constructor(private http: HttpClient) {}

  // Redirect to Node.js server
  startAirtableAuth() {
    window.location.href = "http://localhost:3000/auth/auth";
  }

  // Exchange code for token
  handleAuthCallback(code: string) {
    return this.http.post("http://localhost:3000/auth/callback", { code });
  }
}
