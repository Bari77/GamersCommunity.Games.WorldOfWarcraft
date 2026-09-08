using System.Linq.Expressions;
using GamersCommunity.Core.Exceptions;
using GamersCommunity.Core.Rabbit;
using GamersCommunity.Core.Serialization;
using GamersCommunity.Core.Services;
using Microsoft.EntityFrameworkCore;
using WorldOfWarcraft.Consumer.Models;
using WorldOfWarcraft.Consumer.Security;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Consumer.Services.Data;

public class CharactersService(WorldOfWarcraftDbContext context)
    : GenericDataService<WorldOfWarcraftDbContext, Character>(context, "Characters")
{
    private const int MaxLevel = 80;
    private const int MaxIlvl = 1000;
    private const int MaxCharactersPerPlayer = 50;

    private static readonly Expression<Func<Character, CharacterDto>> Projection = c => new CharacterDto
    {
        PublicId = c.PublicId,
        PlayerPublicId = c.IdPlayerNavigation.PublicId,
        Pseudo = c.Pseudo,
        Level = c.Level,
        Ilvl = c.Ilvl,
        Achievement = c.Achievement,
        Sentence = c.Sentence,
        Main = c.Main,
        CreationDate = c.CreationDate,
        IdRace = c.IdRace,
        RaceName = c.IdRaceNavigation.Entitled,
        IdServer = c.IdServer,
        ServerName = c.IdServerNavigation.Entitled,
        IdDirection = c.IdDirection,
        DirectionName = c.IdDirectionNavigation.Entitled,
        IdAlignment = c.IdAlignment,
        AlignmentName = c.IdAlignmentNavigation == null ? null : c.IdAlignmentNavigation.Entitled,
        IdClass = c.IdMainSpecializationClassNavigation == null ? null : c.IdMainSpecializationClassNavigation.IdClass,
        ClassName = c.IdMainSpecializationClassNavigation == null ? null : c.IdMainSpecializationClassNavigation.IdClassNavigation.Entitled,
        IdMainSpecializationClass = c.IdMainSpecializationClass,
        MainSpecializationName = c.IdMainSpecializationClassNavigation == null ? null : c.IdMainSpecializationClassNavigation.IdSpecializationNavigation.Entitled,
        IdSecondarySpecializationClass = c.IdSecondarySpecializationClass,
        SecondarySpecializationName = c.IdSecondarySpecializationClassNavigation == null ? null : c.IdSecondarySpecializationClassNavigation.IdSpecializationNavigation.Entitled,
        GuildPublicId = c.IdGuildNavigation == null ? null : c.IdGuildNavigation.PublicId,
        GuildName = c.IdGuildNavigation == null ? null : c.IdGuildNavigation.Entitled,
        GuildDiscriminator = c.IdGuildNavigation == null ? null : c.IdGuildNavigation.Discriminator,
    };

    public override async Task<string> HandleAsync(BusMessage message, CancellationToken ct = default)
    {
        switch (message.Action?.ToUpperInvariant())
        {
            case "LIST":
                return JsonSafe.Serialize(await ListAsync(message, ct));

            case "GET":
                return JsonSafe.Serialize(await GetAsync(message, ct));

            case "OPTIONS":
                return JsonSafe.Serialize(await OptionsAsync(ct));

            case "CREATE":
                return JsonSafe.Serialize(await CreateAsync(message, ct));

            case "UPDATE":
                return JsonSafe.Serialize(await UpdateAsync(message, ct));

            case "DELETE":
                return JsonSafe.Serialize(await DeleteAsync(message, ct));
        }

        return await base.HandleAsync(message, ct);
    }

    private async Task<List<CharacterDto>> ListAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<CharacterListRequest>(message.Data);
        if (request.PlayerPublicId == Guid.Empty)
            throw new BadRequestException("INVALID_PLAYER", "Player public id is required");

        return await Context.Characters.AsNoTracking()
            .Where(c => c.IdPlayerNavigation.PublicId == request.PlayerPublicId)
            .OrderByDescending(c => c.Main)
            .ThenByDescending(c => c.Level)
            .ThenBy(c => c.Pseudo)
            .Select(Projection)
            .ToListAsync(ct);
    }

    private async Task<CharacterDto> GetAsync(BusMessage message, CancellationToken ct)
    {
        if (message.PublicId is not Guid publicId)
            throw new BadRequestException("ID_MANDATORY", "Id mandatory");

        return await Context.Characters.AsNoTracking()
                   .Where(c => c.PublicId == publicId)
                   .Select(Projection)
                   .FirstOrDefaultAsync(ct)
               ?? throw new NotFoundException("NOT_FOUND", "Cannot find ressource");
    }

    private async Task<CharacterOptionsDto> OptionsAsync(CancellationToken ct)
    {
        return new CharacterOptionsDto
        {
            Races = await Context.Races.AsNoTracking()
                .OrderBy(r => r.Entitled)
                .Select(r => new ReferenceItemDto { Id = r.Id, Entitled = r.Entitled })
                .ToListAsync(ct),
            Servers = await Context.Servers.AsNoTracking()
                .OrderBy(s => s.Entitled)
                .Select(s => new ReferenceItemDto { Id = s.Id, Entitled = s.Entitled })
                .ToListAsync(ct),
            Directions = await Context.Directions.AsNoTracking()
                .OrderBy(d => d.Id)
                .Select(d => new ReferenceItemDto { Id = d.Id, Entitled = d.Entitled })
                .ToListAsync(ct),
            Alignments = await Context.Alignments.AsNoTracking()
                .OrderBy(a => a.Id)
                .Select(a => new ReferenceItemDto { Id = a.Id, Entitled = a.Entitled })
                .ToListAsync(ct),
            Classes = await Context.Classes.AsNoTracking()
                .OrderBy(c => c.Entitled)
                .Select(c => new ReferenceItemDto { Id = c.Id, Entitled = c.Entitled })
                .ToListAsync(ct),
            SpecializationClasses = await Context.SpecializationClasses.AsNoTracking()
                .OrderBy(sc => sc.IdClass)
                .ThenBy(sc => sc.Entitled)
                .Select(sc => new SpecializationClassOptionDto
                {
                    Id = sc.Id,
                    Entitled = sc.Entitled,
                    IdClass = sc.IdClass,
                    SpecializationEntitled = sc.IdSpecializationNavigation.Entitled,
                })
                .ToListAsync(ct),
            RaceClasses = await Context.RaceClasses.AsNoTracking()
                .OrderBy(rc => rc.IdRace)
                .ThenBy(rc => rc.IdClass)
                .Select(rc => new RaceClassOptionDto { IdRace = rc.IdRace, IdClass = rc.IdClass })
                .ToListAsync(ct),
            MaxLevel = MaxLevel,
        };
    }

    private async Task<CharacterDto> CreateAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<CharacterCreateRequest>(message.Data);
        var caller = await CallerAuth.RequirePlayerAsync(Context, message, ct);

        var owned = await Context.Characters.CountAsync(c => c.IdPlayer == caller.Id, ct);
        if (owned >= MaxCharactersPerPlayer)
            throw new BadRequestException("TOO_MANY_CHARACTERS", $"A player cannot own more than {MaxCharactersPerPlayer} characters");

        var character = new Character
        {
            PublicId = Guid.NewGuid(),
            IdPlayer = caller.Id,
            Pseudo = request.Pseudo?.Trim() ?? "",
            Level = request.Level,
            Ilvl = request.Ilvl,
            Achievement = request.Achievement,
            Sentence = Normalize(request.Sentence),
            Main = request.Main || owned == 0,
            IdRace = request.IdRace,
            IdServer = request.IdServer,
            IdDirection = request.IdDirection,
            IdAlignment = request.IdAlignment,
            IdMainSpecializationClass = request.IdMainSpecializationClass,
            IdSecondarySpecializationClass = request.IdSecondarySpecializationClass,
            CreationDate = DateTime.UtcNow,
            ModificationDate = DateTime.UtcNow,
        };

        await ValidateAsync(character, ct);

        if (character.Main)
            await ClearMainAsync(caller.Id, currentCharacterId: null, ct);

        await Context.Characters.AddAsync(character, ct);
        await Context.SaveChangesAsync(ct);

        return await ToDtoAsync(character.Id, ct);
    }

    private async Task<CharacterDto> UpdateAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<CharacterUpdateRequest>(message.Data);
        var character = await RequireOwnedCharacterAsync(message, ct);

        if (request.Pseudo is not null)
            character.Pseudo = request.Pseudo.Trim();
        if (request.Level is int level)
            character.Level = level;
        if (request.Ilvl is int ilvl)
            character.Ilvl = ilvl;
        if (request.Achievement is int achievement)
            character.Achievement = achievement;
        if (request.Sentence is not null)
            character.Sentence = Normalize(request.Sentence);
        if (request.IdRace is int idRace)
            character.IdRace = idRace;
        if (request.IdServer is int idServer)
            character.IdServer = idServer;
        if (request.IdDirection is int idDirection)
            character.IdDirection = idDirection;
        if (request.IdAlignment is int idAlignment)
            character.IdAlignment = idAlignment;
        if (request.IdMainSpecializationClass is int idMainSpec)
            character.IdMainSpecializationClass = idMainSpec;
        if (request.IdSecondarySpecializationClass is int idSecondarySpec)
            character.IdSecondarySpecializationClass = idSecondarySpec;

        await ValidateAsync(character, ct);

        if (request.Main == true && !character.Main)
        {
            await ClearMainAsync(character.IdPlayer, character.Id, ct);
            character.Main = true;
        }

        character.ModificationDate = DateTime.UtcNow;
        await Context.SaveChangesAsync(ct);

        return await ToDtoAsync(character.Id, ct);
    }

    private async Task<CharacterDeleteResult> DeleteAsync(BusMessage message, CancellationToken ct)
    {
        var character = await RequireOwnedCharacterAsync(message, ct);

        if (await Context.Guilds.AnyAsync(g => g.IdLeader == character.Id, ct))
            throw new ForbiddenException("CHARACTER_IS_GUILD_LEADER", "Transfer guild leadership before deleting this character");

        var jobs = await Context.CharacterJobs.Where(j => j.IdCharacter == character.Id).ToListAsync(ct);
        Context.CharacterJobs.RemoveRange(jobs);

        var memberships = await Context.GuildMembers.Where(m => m.IdCharacter == character.Id).ToListAsync(ct);
        Context.GuildMembers.RemoveRange(memberships);

        Character? promoted = null;
        if (character.Main)
        {
            promoted = await Context.Characters
                .Where(c => c.IdPlayer == character.IdPlayer && c.Id != character.Id)
                .OrderByDescending(c => c.Level)
                .ThenBy(c => c.CreationDate)
                .FirstOrDefaultAsync(ct);

            if (promoted is not null)
                promoted.Main = true;
        }

        Context.Characters.Remove(character);
        await Context.SaveChangesAsync(ct);

        return new CharacterDeleteResult
        {
            PublicId = character.PublicId,
            NewMainPublicId = promoted?.PublicId,
        };
    }

    private async Task<Character> RequireOwnedCharacterAsync(BusMessage message, CancellationToken ct)
    {
        if (message.PublicId is not Guid publicId)
            throw new BadRequestException("ID_MANDATORY", "Id mandatory");

        var caller = await CallerAuth.RequirePlayerAsync(Context, message, ct);
        var character = await Context.Characters.FirstOrDefaultAsync(c => c.PublicId == publicId, ct)
            ?? throw new NotFoundException("NOT_FOUND", "Cannot find ressource");

        if (character.IdPlayer != caller.Id)
            throw new ForbiddenException("FORBIDDEN", "Cannot alter another player's character");

        return character;
    }

    private async Task ClearMainAsync(int playerId, int? currentCharacterId, CancellationToken ct)
    {
        var others = await Context.Characters
            .Where(c => c.IdPlayer == playerId && c.Main && (currentCharacterId == null || c.Id != currentCharacterId))
            .ToListAsync(ct);

        foreach (var other in others)
        {
            other.Main = false;
            other.ModificationDate = DateTime.UtcNow;
        }
    }

    private async Task ValidateAsync(Character character, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(character.Pseudo))
            throw new BadRequestException("PSEUDO_MANDATORY", "Character name is required");
        if (character.Pseudo.Length > 50)
            throw new BadRequestException("PSEUDO_TOO_LONG", "Character name cannot exceed 50 characters");
        if (character.Level < 1 || character.Level > MaxLevel)
            throw new BadRequestException("INVALID_LEVEL", $"Level must be between 1 and {MaxLevel}");
        if (character.Ilvl < 0 || character.Ilvl > MaxIlvl)
            throw new BadRequestException("INVALID_ILVL", $"Item level must be between 0 and {MaxIlvl}");
        if (character.Achievement < 0)
            throw new BadRequestException("INVALID_ACHIEVEMENT", "Achievement points cannot be negative");

        if (!await Context.Races.AnyAsync(r => r.Id == character.IdRace, ct))
            throw new BadRequestException("INVALID_RACE", "Unknown race");
        if (!await Context.Servers.AnyAsync(s => s.Id == character.IdServer, ct))
            throw new BadRequestException("INVALID_SERVER", "Unknown server");
        if (!await Context.Directions.AnyAsync(d => d.Id == character.IdDirection, ct))
            throw new BadRequestException("INVALID_DIRECTION", "Unknown role");
        if (character.IdAlignment is int alignmentId && !await Context.Alignments.AnyAsync(a => a.Id == alignmentId, ct))
            throw new BadRequestException("INVALID_ALIGNMENT", "Unknown faction");

        var duplicate = await Context.Characters.AnyAsync(
            c => c.Id != character.Id
                 && c.IdPlayer == character.IdPlayer
                 && c.IdServer == character.IdServer
                 && c.Pseudo == character.Pseudo,
            ct);
        if (duplicate)
            throw new BadRequestException("PSEUDO_TAKEN", "You already own a character with that name on this server");

        if (character.IdMainSpecializationClass is not int mainSpecId)
        {
            if (character.IdSecondarySpecializationClass is not null)
                throw new BadRequestException("MAIN_SPECIALIZATION_MANDATORY", "A secondary specialization requires a main one");
            return;
        }

        var mainSpec = await Context.SpecializationClasses.AsNoTracking()
                           .FirstOrDefaultAsync(sc => sc.Id == mainSpecId, ct)
                       ?? throw new BadRequestException("INVALID_SPECIALIZATION", "Unknown specialization");

        if (character.IdSecondarySpecializationClass is int secondarySpecId)
        {
            if (secondarySpecId == mainSpecId)
                throw new BadRequestException("DUPLICATE_SPECIALIZATION", "Main and secondary specializations must differ");

            var secondarySpec = await Context.SpecializationClasses.AsNoTracking()
                                    .FirstOrDefaultAsync(sc => sc.Id == secondarySpecId, ct)
                                ?? throw new BadRequestException("INVALID_SPECIALIZATION", "Unknown specialization");

            if (secondarySpec.IdClass != mainSpec.IdClass)
                throw new BadRequestException("SPECIALIZATION_CLASS_MISMATCH", "Both specializations must belong to the same class");
        }

        var allowed = await Context.RaceClasses.AnyAsync(
            rc => rc.IdRace == character.IdRace && rc.IdClass == mainSpec.IdClass,
            ct);
        if (!allowed)
            throw new BadRequestException("INVALID_RACE_CLASS", "This class is not available to that race");
    }

    private async Task<CharacterDto> ToDtoAsync(int characterId, CancellationToken ct) =>
        await Context.Characters.AsNoTracking()
            .Where(c => c.Id == characterId)
            .Select(Projection)
            .FirstAsync(ct);

    private static string? Normalize(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
