import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { Game } from "./game.model"; // Importation du modèle Game pour la relation

// Définir les attributs de Review
export interface ReviewAttributes {
    id: number;
    game_id: number;
    rating: number;
    review_text: string;
}

// Définir un type pour les attributs optionnels lors de la création (par exemple, id sera généré automatiquement)
export interface ReviewCreationAttributes extends Optional<ReviewAttributes, "id"> {}

// Créer la classe Review qui étend Model
export class Review
    extends Model<ReviewAttributes, ReviewCreationAttributes>
    implements ReviewAttributes
{
    public id!: number;
    public game_id!: number;
    public rating!: number;
    public review_text!: string;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Review.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        game_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Game,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 10,
            },
        },
        review_text: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "reviews",
    }
);

Review.belongsTo(Game, { foreignKey: "game_id" });
Game.hasMany(Review, { foreignKey: "game_id" });
