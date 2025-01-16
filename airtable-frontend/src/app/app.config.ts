import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { AuthInterceptor } from "./intercepters/AuthInterceptor";
import { AirtableService } from "./services/airtable.service";

export const appConfig: ApplicationConfig = {
  providers: [
    AirtableService,
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
  ],
};
