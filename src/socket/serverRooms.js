class RoomConstruct {
    constructor() {
        this.rooms = {},
            this.activeRooms = {};
    }

    addRoom(id) {
        this.rooms[id] = {
            capacity: 0,
            deck: [], // draw card might be deck.shift();
            players: [
                // {socket.id, socket.nickname, socket.roomNumber}
            ],
            // Books
        };
        this.activeRooms[id] = {
            capacity: 0
        };
    }

    adjustRoomCapacity(id, bool) {
        if (bool) {
            this.activeRooms[id].capacity++;
            this.rooms[id].capacity++;
            return this.rooms[id].capacity;
        } else if (this.rooms[id].capacity === 1) {
            // 1 - 1 = 0, delete rooms
            delete this.activeRooms[id];
            delete this.rooms[id];
            return `Room ${id} shut down`;
        } else {
            this.rooms[id].capacity--;
            this.activeRooms[id].capacity--;
            return this.rooms[id].capacity;
        }
    }

    addPlayerToRoom(id, player) {
        this.rooms[id].players.push(player);
        return this.rooms[id].players;
    }

    removePlayer(id, room) {
        const playerObj = this.rooms[room].players.find(el => el.id === id);
        const indexOfPlayerObj = this.rooms[room].players.indexOf(playerObj);
        return this.rooms[room].players.splice(indexOfPlayerObj, 1);
    }

}

const ServerRooms = new RoomConstruct();

module.exports = ServerRooms;
