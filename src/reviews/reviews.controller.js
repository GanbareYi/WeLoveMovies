const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
    const { reviewId } = req.params;

    const review = await service.read(reviewId);
    if (review) {
        res.locals.review = review;
        return next();
    }

    return next({ status: 404, message: "Review cannot be found."});
}

async function update(req, res) {
    const reviewId = res.locals.review.review_id;

    const updatedReview = {
        ...res.locals.review,
        ...req.body.data,
    }

    // Update the review first.
    await service.update(updatedReview);

    /* Response the updated review record with newly patched critic 
       information being set to the critic property. 
    */
    const data = await service.updatedReviewWithCritic(reviewId);
    res.json({ data });
}

async function destroy(req, res) {
    const { reviewId } = req.params;

    const data = await service.destroy(reviewId);
    res.status(204).json({ data });
}

async function list(req, res) {
    const { movie_id: movieId } = req.params;

    const reviews = await service.list(movieId);
    res.json({ data: reviews });
}

module.exports = {
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
    list: asyncErrorBoundary(list),
}