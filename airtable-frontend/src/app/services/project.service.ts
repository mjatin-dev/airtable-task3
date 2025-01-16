import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  private baseUrl = "http://localhost:3000";
  constructor(private http: HttpClient) {}

  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/airtable/projects`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }
  getProjectbyId(projectId: number | null): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/airtable/tables/${projectId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }
  getTicketsByTableId(
    baseId: number | null,
    tableId: number | null
  ): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/airtable/tickets/${baseId}/${tableId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  }
}
