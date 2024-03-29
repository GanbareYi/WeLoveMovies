const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

// The movies playing at each theatre added to the movies key.
const reduceMovies = reduceProperties("theater_id", {
    "movie_id": ["movies", null, "movie_id"],
    "title": ["movies", null, "title"],
    "runtime_in_minutes": ["movies", null, "runtime_in_minutes"],
    "rating": ["movies", null, "rating"],
    "description": ["movies", null, "description"],
    "image_url": ["movies", null, "image_url"],
    "is_showing": ["movies", null, "is_showing"],
    "theater_id": ["movies", null, "theater_id"]
});

function list() {

    return knex("theaters as t")
            .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
            .join("movies as m", "m.movie_id", "mt.movie_id")
            .select("t.*", "m.*", "mt.*")
            .then(reduceMovies);
}

module.exports = {
    list,
}