import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Product = sequelize.define(
  'Product',
  {
    product_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    status: { type: DataTypes.ENUM('active','inactive','out_of_stock'), allowNull: false, defaultValue: 'active' },
  },
  { tableName: 'product', timestamps: false, underscored: true }
);

export default Product;
