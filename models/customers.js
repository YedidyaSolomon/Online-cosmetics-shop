import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Cart from './cart.js';
import Order from './order.js';

const Customer = sequelize.define(
  'Customer',
  {
    customer_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: { msg: "You should enter in the correct format /@gmail.com" },
        notNull: { msg: "You need to enter your email address" }
      }
    },
    password: { type: DataTypes.STRING, allowNull: false },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: [/^(\+251|0)[79]\d{8}$/, /^09\d{8}$/],
          msg: "please enter the correct Ethiopian phone number"
        }
      }
    },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'customer' }
  },
  {
    tableName: 'customer',
    timestamps: true,
    underscored: true
  }
);



export default Customer;
