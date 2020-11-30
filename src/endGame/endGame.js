const GameService = {
    updatePlayerWin: (db, userObj) => {
        return db
            .raw(
                `UPDATE user_scores
            SET total_wins = total_wins + 1,
            books_collected = books_collected + ${userObj.booksCollected}
            WHERE user_id = ${userObj.user_id}`
            );
    },

    updatePlayerLoss: (db, userObj) => {
        return db
            .raw(
                `UPDATE user_scores
            SET books_collected = books_collected + ${userObj.booksCollected}
            WHERE user_id = ${userObj.user_id}`
            );
    },

    getPlayerInfo: (db, user_id) => {
        return db
            .select('*')
            .where(user_id);
        // [{user_id, total_wins, books_collected}]
    }



};

module.exports = GameService;