const Sequelize = require("sequelize");

const sequelize = new Sequelize("mysql://root:@localhost:3306/delilah", {
  dialect: "mysql",
  define: {
    underscored: true,
    freezeTableName: true,
    timestamps: false 
  },
  dialectOptions: {
    dateStrings: true,
    typeCast: function(field, next) {
      if (field.type === "DATETIME") {
        return field.string();
      }
      return next();
    }
  },
  timezone: "-03:00"
});

module.exports = { sequelize };
