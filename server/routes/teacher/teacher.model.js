const { DataTypes } = require('sequelize');
 
module.exports = model;

function model(sequelize) {
    const attributes = {
        teacher_ID:{ type: DataTypes.STRING, allowNull: false},
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        class_assigned: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: true},
        subject: { type: DataTypes.STRING, allowNull: false },
        phone_No: { type: DataTypes.STRING, allowNull: false },
        username: { type: DataTypes.STRING, allowNull: false },
        hash: { type: DataTypes.STRING, allowNull: false } 
    };

    const options = {
        defaultScope: {
            //exclude hash by default
            attributes: { exclude: ['hash'] }
        },
        scopes: {
            //include hash with this scope
            withHash: { attributes: {}, }
        }
    };
    return sequelize.define('teacher', attributes, options);
}