const bcrypt = require("bcryptjs");
const { User } = require("../models");

exports.getAll = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Manejo de cambio de contraseña
    if (req.body.currentPassword || req.body.newPassword) {
      if (!req.body.currentPassword || !req.body.newPassword) {
        return res.status(400).json({
          message:
            "Para cambiar contraseña se requieren currentPassword y newPassword",
        });
      }
      const match = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!match) {
        return res
          .status(400)
          .json({ message: "Contraseña actual incorrecta" });
      }
    }

    // Campos permitidos
    const allowed = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "phone",
      "country",
      "favoriteMethod",
      "optInSony",
      "optInFiltr",
    ];
    const data = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) {
        data[key] = req.body[key];
      }
    });

    // Si solicita cambio de contraseña
    if (req.body.newPassword) {
      const salt = await bcrypt.genSalt(12);
      data.password = await bcrypt.hash(req.body.newPassword, salt);
    }

    await User.update(data, { where: { id: userId } });
    res.json({ message: "Usuario actualizado" });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const deleted = await User.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    next(err);
  }
};
