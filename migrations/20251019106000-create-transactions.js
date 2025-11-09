export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transaction', {
      transaction_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      first_name: { type: Sequelize.STRING, allowNull: false },
      last_name: { type: Sequelize.STRING, allowNull: false },
      phone_number: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING },
      currency: { type: Sequelize.STRING, allowNull: false },
      amount: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      status: { type: Sequelize.STRING, allowNull: false },
      tx_ref: { type: Sequelize.STRING, allowNull: false, unique: true },
      charge: { type: Sequelize.JSON },
      payment_method: { type: Sequelize.STRING },
      reason: { type: Sequelize.STRING },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'order', key: 'order_id' },
        onDelete: 'CASCADE',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transaction');
  },
};
