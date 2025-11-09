export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('product', {
      product_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      product_name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      quantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      status: { type: Sequelize.ENUM('active','inactive','out_of_stock'), allowNull: false, defaultValue: 'active' },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('product');
  },
};
