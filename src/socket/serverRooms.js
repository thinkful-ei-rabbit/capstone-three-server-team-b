class RoomConstruct {
    constructor() {
        this.rooms = {};
    }

    addRoom(id) {
        this.rooms[id] = 0;
    }

    adjustLength(id, bool) {
        return (bool)
            ? this.rooms[id]++
            : this.rooms[id]--;
    }

}

const ServerRooms = new RoomConstruct();

module.exports = ServerRooms;
