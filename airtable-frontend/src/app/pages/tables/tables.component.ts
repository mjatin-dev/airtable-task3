import { ActivatedRoute, Router } from "@angular/router";
import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { LoaderComponent } from "../../loader/loader.component";
import { ProjectService } from "../../services/project.service";
import { MatTabsModule } from "@angular/material/tabs";
import { CommonModule } from "@angular/common";
import { AgGridAngular } from "ag-grid-angular";
import { Location } from "@angular/common";
import { MatIcon } from "@angular/material/icon";
import { ModalDialogComponent } from "../../modal-dialog/modal-dialog.component";

@Component({
  selector: "app-tables",
  imports: [
    LoaderComponent,
    AgGridAngular,
    CommonModule,
    MatIcon,
    MatTabsModule,
  ],
  templateUrl: "./tables.component.html",
  styleUrls: ["./tables.component.css"],
})
export class TablesComponent {
  userName: string = "";
  isLoading: boolean = false;
  tables: any = [];
  baseId: number | null = null;
  headers: any = [];
  tableRows: any = [];
  rowData: any = []; // Data for Ag-Grid rows
  columnDefs: any = []; // Data for Ag-Grid column definitions

  // Default column definitions for Ag-Grid
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1, // Ensures columns take up the full width
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private location: Location,
    private dialog: MatDialog // Inject MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const baseId = params["baseId"]; // Retrieve baseId from the URL
      console.log("Base ID:", baseId);
      this.baseId = baseId;
    });
    this.fetchProjects();
  }

  goBack() {
    this.location.back();
  }

  onRowClicked(event: any): void {
    const rowData = event.data;
    this.dialog.open(ModalDialogComponent, {
      width: "1000px",
      data: rowData, // Pass your data here
    });
  }

  onTabChange(event: any): void {
    const selectedIndex = event.index;
    const selectedTab = this.tables[selectedIndex];

    // Set headers as column definitions
    this.columnDefs = selectedTab.fields.map((field: any) => ({
      headerName: field.label, // Display name in the grid
      field: field.name, // Field in the data object
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1, // Makes columns fill available width
    }));

    this.isLoading = true;
    this.projectService
      .getTicketsByTableId(this.baseId, selectedTab.id)
      .subscribe({
        next: (tickets: any[]) => {
          console.log("Tickets:", tickets);

          // Map row data for the grid
          this.rowData = tickets.map((ticket) => {
            const fields = { ...ticket.fields };

            // Traverse each key in the `fields` object
            Object.keys(fields).forEach((key) => {
              if (
                typeof fields[key] === "object" &&
                fields[key] !== null &&
                "name" in fields[key]
              ) {
                fields[key] = fields[key].name; // Replace object with its `name` property
              }
            });

            return {
              ...fields,
              fields,
              id: ticket.id,
            };
          });

          this.isLoading = false;
        },
        error: (error) => {
          console.error("Error fetching tickets:", error);
          this.isLoading = false;
        },
      });
  }

  fetchProjects(): void {
    this.isLoading = true;
    this.projectService.getProjectbyId(this.baseId).subscribe({
      next: (tables: any[]) => {
        this.tables = tables;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error fetching projects:", error);
        this.isLoading = false;
      },
    });
  }
}
