CREATE TABLE user_scores (
    "user_id" INTEGER REFERENCES "users"(id)
        ON DELETE CASCADE NOT NULL,
    "total_wins" SMALLINT DEFAULT 0
);