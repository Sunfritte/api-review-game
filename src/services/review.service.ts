import {CreateReviewDTO, ReviewDTO} from "../dto/review.dto";
import { Review } from "../models/review.model";
import {notFound} from "../error/NotFoundError";
import {Game} from "../models/game.model";

export class ReviewService {
    // Méthode pour obtenir tous les avis
    public async getAllReviews(): Promise<ReviewDTO[]> {
        const reviews = await Review.findAll();
        return reviews;
    }

    // Méthode pour obtenir un avis par ID
    public async getReviewById(id: number): Promise<ReviewDTO | null> {
        const review = await Review.findByPk(id);
        return review;
    }

    public async createReview(reviewData: CreateReviewDTO): Promise<ReviewDTO> {
        const game = await Game.findByPk(reviewData.game_id);
        if (!game) {
            throw notFound("Game");
        }
        const newReview = await Review.create(reviewData);
        return newReview;
    }

    public async updateReview(id: number, reviewData: Partial<CreateReviewDTO>): Promise<ReviewDTO | null> {
        const review = await Review.findByPk(id);
        if (!review) {
            throw notFound("Review");
        }
        if (reviewData.game_id) {
            const game = await Game.findByPk(reviewData.game_id);
            if (!game) {
                throw notFound("Game");
            }
            review.game_id = reviewData.game_id;
        }
        if (reviewData.rating !== undefined) {
            review.rating = reviewData.rating;
        }
        if (reviewData.review_text) {
            review.review_text = reviewData.review_text;
        }
        await review.save();
        return review;
    }

    public async deleteReview(id: number): Promise<void> {
        await Review.destroy({ where: { id } });
    }
}

export const reviewService = new ReviewService();
