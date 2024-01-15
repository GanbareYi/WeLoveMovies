const { format } = require("morgan");
const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

// The critic information set to the critic property
const addProperties = mapProperties({
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name"
});

function read(movieId) {
    return knex("movies")
            .select("*")
            .where("movie_id", movieId)
            .first();
}

function list() {
    return knex("movies").select("*");
}

function listMoviesIsShowing() {
    return knex("movies as m")
            .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
            .distinct()
            .select("m.*")
            .where("mt.is_showing", true);
}

function movieTheaters(movieId) {
    return knex("theaters as t")
            .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
            .select("t.*", "mt.*")
            .where("mt.movie_id", movieId);
}

function movieReviews(movieId) {
    return knex("reviews as r")
            .join("critics as c", "r.critic_id", "c.critic_id")
            .select("r.*", "c.*")
            .where("r.movie_id", movieId)
            // Iterate all the returning reviews
            // Set the critic information to the critic property
            .then(reviews => {
                const result = [];
                reviews.forEach(review => {
                    const formattedReview = addProperties(review);
                    result.push(formattedReview);
                });
                return result;
            }); 
}

module.exports = {
    read,
    list,
    listMoviesIsShowing,
    movieTheaters,
    movieReviews
}