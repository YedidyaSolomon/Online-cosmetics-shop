export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('order', {
      order_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'customer', key: 'customer_id' },
        onDelete: 'CASCADE',
      },
      total_amount: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      status: { type: Sequelize.STRING, allowNull: false, defaultValue: 'pending' },
      tx_ref: { type: Sequelize.STRING, allowNull: false, unique: true },
      checkout_url: { type: Sequelize.STRING },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('order');
  },
};
