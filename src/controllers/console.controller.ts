import { Controller, Get, Post, Delete, Route, Path, Body, Tags, Patch } from "tsoa";
import { consoleService } from "../services/console.service";
import { ConsoleDTO } from "../dto/console.dto";
import {notFound} from "../error/NotFoundError";

@Route("consoles")
@Tags("Consoles")
export class ConsoleController extends Controller {
  // Récupère toutes les consoles
  @Get("/")
  public async getAllConsole(): Promise<ConsoleDTO[]> {
    return consoleService.getAllConsoles();
  }

  // Récupère une console par ID
  @Get("{id}")
  public async getConsoleById(@Path() id: number): Promise<ConsoleDTO > {
    const console = await consoleService.getConsoleById(id);

    if (!console) notFound("Console");

    return console;
  }

  // Crée une nouvelle console
  @Post("/")
  public async createConsole(
    @Body() requestBody: ConsoleDTO
  ): Promise<ConsoleDTO> {
    const { name, manufacturer } = requestBody;
    return consoleService.createConsole(name, manufacturer);
  }

  // Supprime une console par ID
  @Delete("{id}")
  public async deleteConsole(@Path() id: number): Promise<void> {
    const canDelete = await consoleService.canDeleteConsole(id);
    if (!canDelete) {
      notFound(`Cannot delete console with ID ${id} because it has associated reviews.`);
    }
    await consoleService.deleteConsole(id);
  }

  // Met à jour une console par ID
  @Patch("{id}")
  public async updateConsole(
      @Path() id: number,
      @Body() requestBody: ConsoleDTO
  ): Promise<ConsoleDTO > {
    const { name, manufacturer } = requestBody;
    const updatedConsole = await consoleService.updateConsole(id, name, manufacturer);


    if (!updatedConsole) notFound("Console");

    return updatedConsole;
  }
}