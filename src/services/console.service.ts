import { Console } from "../models/console.model";
import {Review} from "../models/review.model";
import {Game} from "../models/game.model";

export class ConsoleService {

  // Récupère toutes les consoles
  public async getAllConsoles(): Promise<Console[]> {
    return await Console.findAll();
  }

  // Récupère une console par ID
  public async getConsoleById(id: number): Promise<Console | null> {
    return Console.findByPk(id);
  }

  // Crée une nouvelle console
  public async createConsole(
    name: string,
    manufacturer: string
  ): Promise<Console> {
    return Console.create({name: name, manufacturer: manufacturer });
  }
  public async canDeleteConsole(consoleId: number): Promise<boolean> {
    const reviewsCount = await Review.count({
      include: [
        {
          model: Game,
          where: { consoleid: consoleId },
        },
      ],
    });

    return reviewsCount === 0;
  }

  // Supprime une console par ID
  public async deleteConsole(id: number): Promise<void> {
    const console = await Console.findByPk(id);
    if (console) {
      console.destroy();
    }
  }

  // Met à jour une console
  public async updateConsole(
    id: number,
    name?: string,
    manufacturer?: string
  ): Promise<Console | null> {
    const console = await Console.findByPk(id);
    if (console) {
      if (name) console.name = name;
      if (manufacturer) console.manufacturer = manufacturer;
      await console.save();
      return console;
    }
    return null;
  }
}

export const consoleService = new ConsoleService();
