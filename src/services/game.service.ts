import {CreateGameDTO, GameDTO} from "../dto/game.dto";
import { Console } from "../models/console.model";
import { Game } from "../models/game.model";
import {notFound} from "../error/NotFoundError";
import {Review} from "../models/review.model";

export class GameService {
  public async getAllGames(): Promise<GameDTO[]> {
    return Game.findAll({
      include: [
        {
          model: Console,
          as: "console",
        },
      ],
    });
  }
  public async getGameById(id: number): Promise<Game | null> {
    return Game.findByPk(id);
  }

  public async createGame(gameData: CreateGameDTO): Promise<GameDTO> {
    // Vérifie que la console existe
    const console = await Console.findByPk(gameData.consoleid);
    if (!console) {
      notFound("Game");
    }

    // Crée le jeu
    const newGame = await Game.create({
      title: gameData.title,
      console_id: gameData.consoleid,
    });

    return newGame;
  }
  public async updateGame(id: number, gameData: Partial<GameDTO>): Promise<GameDTO> {
    const game = await Game.findByPk(id);
    if (!game) {
      throw notFound("Game");
    }
    if (gameData.console && gameData.console.id) {
      const console = await Console.findByPk(gameData.console.id);
      if (!console) {
        throw notFound("Console");
      }
      game.console_id = gameData.console.id;
    }
    if (gameData.title) {
      game.title = gameData.title;
    }
    await game.save();
    return game;
  }
  public async canDeleteGame(gameId: number): Promise<boolean> {
    const reviewsCount = await Review.count({
      where: { game_id: gameId },
    });

    return reviewsCount === 0;
  }
  public async deleteGame(id: number): Promise<void> {
    await Game.destroy({ where: { id } });
  }

    public async getGamesByConsoleId(consoleId: number): Promise<Game[]> {
    const games = await Game.findAll({
      where: { console_id : consoleId },
    });
    return games;
  }

  public async getReviewsByGameId(gameId: number): Promise<Review[]> {
    const game = await Game.findByPk(gameId);
    if (!game) {
      throw notFound("Game");
    }
    const reviews = await Review.findAll({
      where: { game_id: gameId },
    });

    return reviews;
  }
}

export const gameService = new GameService();