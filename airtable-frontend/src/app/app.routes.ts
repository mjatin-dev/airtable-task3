import { Routes } from "@angular/router";
import { IntegrationListComponent } from "./integration-list/integration-list.component";
import { ConnectGitHubComponent } from "./connect-github/connect-github.component";
import { FindUserGridComponent } from "./find-user-grid-component/find-user-grid-component.component";
import { RepoDataComponent } from "./repo-data/repo-data.component";
import { TablesComponent } from "./pages/tables/tables.component";
import { ConnectOAuthComponent } from "./connect-oauth/connect-oauth.component";
import { TicketsComponent } from "./pages/tickets/tickets.component";
import { AuthCallbackComponent } from "./auth-callback/auth-callback.component";
import { ProjectsComponent } from "./pages/projects/projects.component";

export const routes: Routes = [
  // { path: "", component: ConnectGitHubComponent },
  { path: "", component: ConnectOAuthComponent },
  { path: "integrations", component: IntegrationListComponent },
  { path: "", redirectTo: "", pathMatch: "full" },
  { path: "find-user", component: FindUserGridComponent },
  { path: "repo", component: RepoDataComponent },
  { path: "projects", component: ProjectsComponent },
  { path: "meta/bases/:baseId/tables", component: TablesComponent },
  { path: ":baseId/:tableId", component: TicketsComponent },
  { path: "auth/callback", component: AuthCallbackComponent },
];
