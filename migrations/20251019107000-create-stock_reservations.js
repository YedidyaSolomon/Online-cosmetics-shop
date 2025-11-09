export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('stock_reservation', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'order', key: 'order_id' },
        onDelete: 'CASCADE',
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'product', key: 'product_id' },
        onDelete: 'CASCADE',
      },
      reserved_quantity: { type: Sequelize.INTEGER, allowNull: false },
      reserved_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      expires_at: { type: Sequelize.DATE, allowNull: false },
      status: {
        type: Sequelize.ENUM('active','released','used', 'expired' ),
        allowNull: false,
        defaultValue: 'active',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('stock_reservation');
  },
};
