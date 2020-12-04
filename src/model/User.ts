export class User{
    constructor(
    private id: string,
    private name: string,
    private nickname:string,
    private password: string,
    private email: string,
 

    ){}

    getId(){
        return this.id;
    }

    getName(){
        return this.name
    }

    getNickname(){
        return this.email;
    }
    
    getPassword(){
        return this.password;
    }

    getEmail(){
        return this.nickname;
    }

    setId(id: string){
        this.id = id;
    }

    setName(name: string){
        this.name = name;
    }

    setNickname(name: string){
        this.name = name;
    }
    setPassword(password: string){
        this.password = password;
    }
    
    setEmail(email: string){
        this.email = email;
    }

 
    static toUserModel(user: any): User {
        return new User(user.id, user.name, user.nickname, user.password, user.email, );
    }
}

export interface UserInputDTO{
    name: string;
    nickname:string;
    password: string;
    email: string;
}

export interface LoginInputDTO{
    email: string;
    password: string;
}

