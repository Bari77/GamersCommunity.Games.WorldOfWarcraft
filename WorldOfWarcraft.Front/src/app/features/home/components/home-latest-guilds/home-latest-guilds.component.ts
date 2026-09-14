import { Component, input } from "@angular/core";
import { GuildSummary } from "@features/guilds/models/guild.model";
import { EntityRowComponent, EntityRowFact } from "@shared/components/entity-row/entity-row.component";
import { GuildCrestComponent } from "@shared/components/guild-crest/guild-crest.component";
import { gameTerm } from "@shared/pipes/game-term.pipe";

@Component({
    standalone: true,
    selector: "wow-home-latest-guilds",
    imports: [EntityRowComponent, GuildCrestComponent],
    templateUrl: "./home-latest-guilds.component.html",
    styleUrl: "./home-latest-guilds.component.scss",
})
export class HomeLatestGuildsComponent {
    public readonly guilds = input.required<GuildSummary[]>();

    protected readonly levelLabel = $localize`:@@wow.guild.level:Level`;

    protected facts(guild: GuildSummary): EntityRowFact[] {
        const facts: EntityRowFact[] = [{ label: gameTerm(guild.serverName) }];

        if (guild.orientationName) {
            facts.push({ label: gameTerm(guild.orientationName) });
        }

        return facts;
    }
}
