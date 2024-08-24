import Users from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userCtrl = {
    registerUser: async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const user = await Users.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: "The email already exists" });
            }
            const passwordHash = await bcrypt.hash(password, 10);
            const newUser = new Users({
                username,
                email,
                password: passwordHash
            });
            await newUser.save();
            res.json({ msg: "Signup successful" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await Users.findOne({ email });
            if (!user) return res.status(400).json({ msg: "User does not exist." });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: "Incorrect Password" });

            const payload = { id: user._id, name: user.username };
            const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "50m" });

            res.json({ token });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    verifiedToken: async (req, res) => {
        try {
            const token = req.header("Authorization");
            if (!token) return res.send(false);

            jwt.verify(token, process.env.TOKEN_SECRET, async (err, verified) => {
                if (err) return res.send(false);

                const user = await Users.findById(verified.id);
                if (!user) return res.send(false);
                return res.send(true);
            });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    }
};

export default userCtrl;
