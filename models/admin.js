import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Admin = sequelize.define(
  'Admin',
  {
    admin_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: 'admin', timestamps: true, underscored: true }
);

export default Admin;
