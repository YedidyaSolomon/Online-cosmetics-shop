import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const StockReservation = sequelize.define(
  'StockReservation',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    reserved_quantity: { type: DataTypes.INTEGER, allowNull: false },
    reserved_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    status: {
    type: DataTypes.ENUM('active', 'released', 'used', 'expired'),
    allowNull: false,
    defaultValue: 'active',
  },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { tableName: 'stock_reservation', timestamps: false, underscored: true }
);

export default StockReservation;
