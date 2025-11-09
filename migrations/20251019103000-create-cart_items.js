export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cart_item', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name:{type: Sequelize.STRING(500),allowNull:true},
      cart_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'cart', key: 'cart_id' },
        onDelete: 'CASCADE',
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'product', key: 'product_id' },
        onDelete: 'CASCADE',
      },
      quantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
      
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('cart_item');
  },
};