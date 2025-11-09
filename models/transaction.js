import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Transaction = sequelize.define(
  'Transaction',
  {
    transaction_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    phone_number: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    currency: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    tx_ref: { type: DataTypes.STRING, allowNull: false, unique: true },
    charge: { type: DataTypes.JSON },
    payment_method: { type: DataTypes.STRING },
    reason: { type: DataTypes.STRING },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { tableName: 'transaction', timestamps: false, underscored: true }
);

export default Transaction;
