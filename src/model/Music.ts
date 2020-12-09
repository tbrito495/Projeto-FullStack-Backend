export class Music {
    constructor(
        private id: string,
        private title: string, 
        private author: string,
        private date: Date, 
        private file: string,
        private genre: string[],
        private album: string, 
        private author_name: string,
    ) {}

    public getId(): string {
        return this.id
    }

    public getTitle(): string {
        return this.title
    }

    public getAuthor(): string {
        return this.author
    }

    public getDate(): Date {
        return this.date
    }
    
    public getFile(): string {
        return this.file
    }

    public getGenre(): string[] {
        return this.genre
    }

    public getAlbum(): string {
        return this.album
    }

    public getAuthorName():string{
        return this.author_name
    }

    public setId(id: string) {
        this.id = id
    }

    public setTitle(title: string) {
        this.title = title
    }

    public setauthor(author: string) {
        this.author = author
    }
    
    public setDate(date: Date) {
        this.date = date
    }

    public setFile(file:string) {
        this.file = file
    }

    public setGenre(genre:string[]) {
        this.genre = genre
    }

    public setAlbum(album:string) {
        this.album = album
    }
    public setAuthorName(author_name:string) {
        this.author_name = author_name
    }
    
    static toMusicModel(music: any): Music {
        return new Music(
            music.id,
            music.title,
            music.author,
            music.date,
            music.file,
            music.genre,  
            music.album,
            music.author_name
               );
      }
}
export interface MusicInputDTO {
    title: string;
    file: string,
    genre:string[],
    album:string,
    author_name:string
}   

