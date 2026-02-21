const User = require('../models/User');
const Project = require('../models/Project');

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCurrentUser = async (req, res) => {
  try {
    let { name, email, country } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Trim inputs if provided
    if (name) name = name.trim();
    if (email) email = email.trim();
    if (country) country = country.trim();

    // Validate empty strings
    if (name === "") {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    if (email === "") {
      return res.status(400).json({ message: "Email cannot be empty" });
    }

    if (country === "") {
      return res.status(400).json({ message: "Country cannot be empty" });
    }

    // Email format validation
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check email uniqueness only if changed
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Update fields only if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (country) user.country = country;

    const updatedUser = await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        country: updatedUser.country,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getCurrentUser, updateCurrentUser };
