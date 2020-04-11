class Room{
    constructor(owner){
        this.owner = owner;
        this.participantList = [owner];
        this.chatlog = [];
        this.wolflog = [];
    }
}