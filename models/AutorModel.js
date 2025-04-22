import { DataTypes } from "sequelize";
import banco from "../banco.js";

//Aqui ele mapeia e insere os dados na tabela do banco de dados
export default banco.define(
    'autor',
    {

        idautor: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nomeautor: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        nascimento: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        biografia: {
            type: DataTypes.STRING,
            allowNull: true
        },
        nacionalidade: {
            type: DataTypes.STRING(60),
            allowNull: true
        },
        foto: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }
);