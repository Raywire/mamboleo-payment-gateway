import bcrypt from 'bcrypt';

const userModel = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    photo: {
      allowNull: true,
      type: DataTypes.JSON
    },
    role: {
      type: DataTypes.ENUM('administrator', 'organiser', 'user'),
      defaultValue: 'user'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    logoutTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    billingInfo: {
      allowNull: true,
      type: DataTypes.JSON
    }
  });

  User.beforeSave(async (user) => {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  async function comparePassword (password, cbFunc) {
    const match = await bcrypt.compare(password, this.password);
    if (match) {
      return cbFunc(match);
    }
    return cbFunc(false);
  }

  User.prototype.comparePassword = comparePassword;

  User.prototype.toJSONFor = function () {
    return {
      id: this.id,
      country: this.country,
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      email: this.email,
      phone: this.phone,
      photo: this.photo,
      role: this.role,
      isActive: this.isActive,
      isVerified: this.isVerified,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      billingInfo: this.billingInfo
    };
  };

  // User.associate = (models) => {
  //   User.hasMany(models.Event, {
  //     foreignKey: 'userId'
  //   });
  //   User.hasMany(models.Ticket, {
  //     foreignKey: 'userId'
  //   });
  //   User.hasMany(models.Invite, {
  //     foreignKey: 'userId'
  //   });
  // };

  return User;
};

export default userModel;
