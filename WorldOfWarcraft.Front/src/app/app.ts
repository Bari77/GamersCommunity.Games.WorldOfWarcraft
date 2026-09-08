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
            <span class="playground-banner gc-display">{{ banner }}</span>
          } @else {
            <span class="playground-banner gc-display" i18n="@@wow.playground.banner">WoW Playground</span>
          }
        </nb-layout-header>
        <nb-layout-column>
          <router-outlet />
        </nb-layout-column>
      </nb-layout>
    `,
    styles: `
      .playground-banner {
        font-size: 0.8rem;
        font-weight: 600;
        line-height: 1.2;
      }
    `,
})
export class App {
    protected readonly showBanner = environment.useMocks === true;
    protected readonly banner = PLAYGROUND_BANNER;
}
