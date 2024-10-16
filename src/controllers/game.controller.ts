import { Body, Controller, Path, Get, Route, Tags, Post, Patch, Delete } from "tsoa";
import { CreateGameDTO, GameDTO } from "../dto/game.dto";
import { gameService } from "../services/game.service";
import { notFound } from "../error/NotFoundError";
import { ReviewDTO } from "../dto/review.dto";

@Route("games")
@Tags("Games")
export class GameController extends Controller {

  // Récupère tous les jeux
  @Get("/")
  public async getAllGames(): Promise<GameDTO[]> {
    return gameService.getAllGames();
  }

  // Récupère un jeu par ID
  @Get("{id}")
  public async getGameById(@Path() id: number): Promise<GameDTO> {
    const game = await gameService.getGameById(id);
    if (!game) {
      notFound("Game");
    }
    return game;
  }

  // Crée un nouveau jeu
  @Post("/")
  public async createGame(@Body() gameData: CreateGameDTO): Promise<GameDTO> {
    if (!gameData.consoleid) {
      notFound("Console ID is required to create a game.");
    }
    return gameService.createGame(gameData);
  }

  // Met à jour un jeu par ID
  @Patch("{id}")
  public async updateGame(
      @Path() id: number,
      @Body() gameData: Partial<GameDTO>
  ): Promise<GameDTO> {
    const updatedGame = await gameService.updateGame(id, gameData);
    return updatedGame;
  }

  // Supprime un jeu par ID
  @Delete("{id}")
  public async deleteGame(@Path() id: number): Promise<void> {
    const canDelete = await gameService.canDeleteGame(id);
    if (!canDelete) {
      notFound(`Cannot delete game with ID ${id} because it has associated reviews.`);
    }
    await gameService.deleteGame(id);
  }

  // Récupère les reviews d'un jeu
  @Get("{id}/reviews")
  public async getReviewsByGameId(@Path() id: number): Promise<ReviewDTO[]> {
    const reviews = await gameService.getReviewsByGameId(id);
    if (!reviews.length) {
      notFound("No reviews found for this game.");
    }
    return reviews;
  }
}
