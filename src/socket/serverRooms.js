class RoomConstruct {
    constructor() {
        this.rooms = {},
            this.activeRooms = {};
    }

    addRoom(id) {
        this.rooms[id] = {
            capacity: this.findCapacity(id),
            deck: [], // draw card might be deck.shift();
            players: [
                // {socket.id, socket.nickname, socket.roomNumber},
            ],
            books: {
                // id: count of books
            }
        };
        this.activeRooms[id] = {
            capacity: 0,
            started: false,
        };
    }

    findCapacity(id) {
        if (this.rooms[id]) {
            return this.rooms[id].players.length;
        } else {
            return 0;
        }
    }

    // adjustRoomCapacity(id, bool) {
    //     if (bool) {
    //         this.activeRooms[id].capacity++;
    //         this.rooms[id].capacity++;
    //         return this.rooms[id].capacity;
    //     } else if (this.rooms[id].capacity === 1) {
    //         // 1 - 1 = 0, delete rooms
    //         delete this.activeRooms[id];
    //         delete this.rooms[id];
    //         return `Room ${id} shut down`;
    //     } else {
    //         this.rooms[id].capacity--;
    //         this.activeRooms[id].capacity--;
    //         return this.rooms[id].capacity;
    //     }
    // }

    addPlayerToRoom(id, player) {
        this.activeRooms[id].capacity++;
        this.rooms[id].players.push(player);
        return this.rooms[id].players;
    }

    removePlayer(id, room) {
        const playerObj = this.rooms[room].players.find(el => el.socket_id === id);
        const indexOfPlayerObj = this.rooms[room].players.indexOf(playerObj);
        if (this.activeRooms[room].capacity === 1) {
            // 1 - 1 = 0, delete rooms
            if (this.activeRooms[room]) {
                delete this.activeRooms[room];
            }
            delete this.rooms[room];
            // return `${user} left Room ${id}, and it was then empty, so it shut down`;
        } else {
            this.activeRooms[room].capacity--;
            return this.rooms[room].players.splice(indexOfPlayerObj, 1);
        }
    }

}

const ServerRooms = new RoomConstruct();

module.exports = ServerRooms;
