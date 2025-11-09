export default {
  up: async (queryInterface, Sequelize) => {
    // Add 'expired' to the enum if it doesn't already exist
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_enum
          WHERE enumtypid = (
            SELECT oid FROM pg_type WHERE typname = 'enum_stock_reservation_status'
          ) AND enumlabel = 'expired'
        ) THEN
          ALTER TYPE enum_stock_reservation_status ADD VALUE 'expired';
        END IF;
      END $$;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Note: Removing enum values is not straightforward and can be dangerous.
    // For simplicity, we'll skip the down migration for this change.
    // If needed, manually handle enum value removal.
  },
};
