import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-modal-dialog",
  imports: [CommonModule],
  templateUrl: "./modal-dialog.component.html",
  styleUrl: "./modal-dialog.component.css",
})
export class ModalDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ModalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject the data here
  ) {}
  close(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.dummyFunction();
  }
  // Method to get object keys
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  // Method to check if a value is an object
  isObject(value: any): boolean {
    return value && typeof value === "object" && !Array.isArray(value);
  }
  dummyFunction() {
    console.log(
      "This is a dummy function logging data to the console.",
      this.data
    );
  }
}
