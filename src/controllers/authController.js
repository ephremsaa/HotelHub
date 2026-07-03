const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        const existingUser = await User.findByEmail(email);
        if (existingUser) return res.status(400).json({ error: 'Email already registered' });

        const newUser = await User.create(name, email, password, role);
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);
        
        if (!user) return res.status(400).json({ error: 'Invalid email or password' });

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(400).json({ error: 'Invalid email or password' });

        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ message: 'Logged in successfully', token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during login' });
    }
};
