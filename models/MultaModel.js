import { DataTypes } from "sequelize";
import banco from "../banco.js";

// Questão 9
export default banco.define(
    'multa',
    {
        idmulta: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        idemprestimo: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'emprestimo',
                key: 'idemprestimo'
            }
        },
        valor: {
            type: DataTypes.DECIMAL(11, 2),
            allowNull: false,
            defaultValue: 0
        },
        vencimento: {
            type: DataTypes.DATE,
            allowNull: false
        },
        pagamento: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: 'multa',
        timestamps: false
    }
);