export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cart', {
      cart_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      first_name: { type: Sequelize.STRING, allowNull: true },
          last_name: { type: Sequelize.STRING, allowNull: true},
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'customer', key: 'customer_id' },
        onDelete: 'CASCADE',
      },
      guest_id:{type:Sequelize.STRING, allowNull:true, },
      status: { type: Sequelize.ENUM('active','completed','cancelled'), allowNull: false, defaultValue: 'active' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      expired_at: { type: Sequelize.DATE, allowNull: false },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('cart');
  },
};
