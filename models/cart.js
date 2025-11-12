import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Cart = sequelize.define(
  'Cart',
  {
    cart_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    first_name: { type: DataTypes.STRING, allowNull: true },
    last_name: { type: DataTypes.STRING, allowNull: true },
    guest_id:{type:DataTypes.STRING, allowNull:true, },
    customer_id: { type: DataTypes.INTEGER, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    expired_at: { type: DataTypes.DATE, allowNull: false },
  },
  {
    tableName: 'cart',
    timestamps: false,
    underscored: true,
  }
);

export default Cart;
