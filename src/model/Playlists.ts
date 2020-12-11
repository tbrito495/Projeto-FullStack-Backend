export class Playlists {
    constructor(
        private playlist_id: string,
        private title: string, 
        private subtitle: string,
        private image: string,
        private date: Date, 
    ) {}

    public getPlaylistId(): string {
        return this.playlist_id
    }

    public getTitle(): string {
        return this.title
    }

    public getSubtitle(): string {
        return this.subtitle
    }
    
    public getImage(): string {
        return this.image
    }
    public getDate(): Date {
        return this.date
    }
    

    public setPlaylistId(playlist_id: string) {
        this.playlist_id = playlist_id
    }

    public setTitle(title: string) {
        this.title = title
    }

    public setSubtitle(subtitle: string) {
        this.subtitle = subtitle
    }

    public setImage(image:string) {
        this.image = image
    }
        
    public setDate(date: Date) {
        this.date = date
    }

        static toPlaylistModel(playlist: any): Playlists {
        return new Playlists(
            playlist.id,
            playlist.title,
            playlist.subtitle,
            playlist.image,
            playlist.date,

               );
      }
}
export interface PlaylistInputDTO {
    title: string;
    subtitle: string,
    image:string,

}   

