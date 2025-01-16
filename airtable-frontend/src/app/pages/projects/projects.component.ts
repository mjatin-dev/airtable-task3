import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ProjectService } from "../../services/project.service";
import { LoaderComponent } from "../../loader/loader.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-projects",
  standalone: true,
  imports: [LoaderComponent, CommonModule],
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.css"],
})
export class ProjectsComponent implements OnInit {
  isLoading = false;
  projects: any[] = [];

  constructor(private router: Router, private projectService: ProjectService) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects(): void {
    this.isLoading = true;
    this.projectService.getProjects().subscribe({
      next: (projects: any[]) => {
        this.projects = projects;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error fetching projects:", error);
        this.isLoading = false;
      },
    });
  }
  getProjectById(projectId: number): void {
    this.router.navigate([`/meta/bases/${projectId}/tables`]);
  }
  getInitials(name: string): string {
    const words = name.split(" ");
    const initials = words
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
    return initials;
  }
}
