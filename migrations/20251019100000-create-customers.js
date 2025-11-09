export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('customer', {
      customer_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      first_name: { type: Sequelize.STRING, allowNull: false },
      last_name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      phone_number: { type: Sequelize.STRING },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      role: { type: Sequelize.STRING, allowNull: false, defaultValue: 'customer' },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('customer');
  },
};
