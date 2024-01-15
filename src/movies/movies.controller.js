const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
    const { movieId } = req.params;

    const movie = await service.read(movieId);
    if (movie) {
        res.locals.movie = movie;
        return next();
    }

    return next({status: 404, message: "Movie cannot be found."});
}

function read(req, res) {
    const { movie } = res.locals;

    res.json({ data: movie });
}

async function list(req, res) {
    const { is_showing } = req.query;

    if (is_showing) {
        res.json({ data: await service.listMoviesIsShowing()});
    }else{
        res.json({ data: await service.list() });
    }
}

async function movieTheaters(req, res) {
    const { movieId } = req.params;

    const theaters = await service.movieTheaters(movieId);

    res.json({ data: theaters});
}

async function movieReviews(req, res) {
    const { movieId } = req.params;

    const reviews = await service.movieReviews(movieId);
    res.json({ data: reviews });
}

module.exports = {
    read: [asyncErrorBoundary(movieExists), read],
    list: asyncErrorBoundary(list),
    listTheaters: asyncErrorBoundary(movieTheaters),
    listReviews: asyncErrorBoundary(movieReviews)
}