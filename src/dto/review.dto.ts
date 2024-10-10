import { GameDTO } from "./game.dto";

export interface ReviewDTO {
    id: number;
    game_id: number;
    rating: number;
    review_text: string;
}

export interface CreateReviewDTO {
    game_id: number;
    rating: number;
    review_text: string;
}