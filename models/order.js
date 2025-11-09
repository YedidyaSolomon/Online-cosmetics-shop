import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Order = sequelize.define(
  'Order',
  {
    order_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    customer_id: { type: DataTypes.INTEGER, allowNull: false },
    total_amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
    tx_ref: { type: DataTypes.STRING, allowNull: false, unique: true },
    checkout_url: { type: DataTypes.STRING },
  },
  { tableName: 'order', timestamps: true, underscored: true }
);

export default Order;
