'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Film extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'owner' });
    }
  }
  Film.init({
    nama_film: DataTypes.STRING,
    pemeran: DataTypes.TEXT,
    
    // --- TAMBAHKAN KOLOM BARU DI SINI ---
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true // Kita set `true` agar data lama tidak error
    },
    // ------------------------------------

    gambar: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Film',
  });
  return Film;
};