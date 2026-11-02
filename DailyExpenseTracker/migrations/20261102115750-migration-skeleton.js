'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'expenseData',
      'notes',
      {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'expenseData',
      'notes'
    );
  }
};