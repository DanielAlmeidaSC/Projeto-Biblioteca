import { DataTypes } from "sequelize";
import banco from "../banco.js";

// Questão 2 e 3 7 
export default banco.define(
    'funcionario',
    {
        idfuncionario: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nomefuncionario: {
            type: DataTypes.STRING(60),
            allowNull: false,
            field: 'nomefunctionario' // Nome do campo na tabela SQL
        },
        cpf: {
            type: DataTypes.STRING(15),
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        telefone: {
            type: DataTypes.STRING(15),
            allowNull: true
        },
        nascimento: {
            type: DataTypes.DATE,
            allowNull: true
        },
        salario: {
            type: DataTypes.DECIMAL(11, 2),
            allowNull: false,
            defaultValue: 0
        },
        contratacao: {
            type: DataTypes.DATE,
            allowNull: false
        },
        demissao: {
            type: DataTypes.DATE,
            allowNull: true
        },
        ativo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        senha: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        token: {
            type: DataTypes.STRING(100),
            allowNull: true
        }
    },
    {
        tableName: 'funcionario',
        timestamps: false
    }
);