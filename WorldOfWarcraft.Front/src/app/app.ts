import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NbLayoutModule } from "@nebular/theme";
import { PLAYGROUND_BANNER } from "@bari77/gc-playground";
import { environment } from "../environments/environment";

@Component({
    selector: "app-root",
    imports: [RouterOutlet, NbLayoutModule],
    template: `
      <nb-layout>
        <nb-layout-header fixed>
          @if (showBanner) {
            <span class="playground-banner">{{ banner }}</span>
          } @else {
            <span class="playground-banner">WoW Playground</span>
          }
        </nb-layout-header>
        <nb-layout-column>
          <router-outlet />
        </nb-layout-column>
      </nb-layout>
    `,
    styles: `
      .playground-banner {
        font: 600 0.8rem/1.2 system-ui, sans-serif;
        letter-spacing: 0.02em;
      }
    `,
})
export class App {
    protected readonly showBanner = environment.useMocks === true;
    protected readonly banner = PLAYGROUND_BANNER;
}
