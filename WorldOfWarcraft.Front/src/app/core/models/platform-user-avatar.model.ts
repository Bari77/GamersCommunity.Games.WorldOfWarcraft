/** Minimal Platform user projection used by WoW for avatars. */
export class PlatformUserAvatar {
    public constructor(
        public publicId: string,
        public avatarUrl: string,
    ) {}

    public static fromDto(dto: { publicId: string; avatarUrl: string }): PlatformUserAvatar {
        return new PlatformUserAvatar(dto.publicId, dto.avatarUrl ?? "");
    }
}
