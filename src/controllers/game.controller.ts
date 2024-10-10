import {Body, Controller, Path, Get, Route, Tags, Post, Patch, Delete} from "tsoa";
import {CreateGameDTO, GameDTO} from "../dto/game.dto";
import { gameService } from "../services/game.service";
import { notFound } from "../error/NotFoundError";
import {Game} from "../models/game.model";

@Route("games")
@Tags("Games")
export class GameController extends Controller {
  @Get("/")
  public async getAllGames(): Promise<GameDTO[]> {
    return gameService.getAllGames();
  }
  @Get("{id}")
  public async getGameById(@Path() id: number): Promise<GameDTO > {
    const game = await gameService.getGameById(id);
    console.log(game);
    if (!game) notFound("Game");
    return game;
  }
  @Post("/")
  public async createGame(@Body() gameData: CreateGameDTO): Promise<GameDTO> {
    if (!gameData.consoleid) {
      notFound("Game");
    }
    const newGame = await gameService.createGame(gameData);
    return newGame;
  }
  @Patch("{id}")
  public async updateGame(
      @Path() id: number,
      @Body() gameData: Partial<GameDTO>
  ): Promise<GameDTO> {
    const updatedGame = await gameService.updateGame(id, gameData);
    return updatedGame;
  }
  @Delete("{id}")
  public async deleteGame(@Path() id: number): Promise<void> {
    const canDelete = await gameService.canDeleteGame(id);
    if (!canDelete) {
      notFound(`Cannot delete game with ID ${id} because it has associated reviews.`);
    }

    await gameService.deleteGame(id);
  }

}