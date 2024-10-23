import User from '../models/user.js'
import { generateToken } from '../config/jwtUtils.js'

export const create_session = async (req, res) => {
    try {
        const { emailUsername, password } = req.body;
        let user = await User.findOne({ $or: [{ email: emailUsername }, { username: emailUsername }] });
        
        if (!user || password !== user.password) {
            return res.status(401).json({ error: 'Invalid Email/Username or Password!' });
        }

        const token = generateToken(user);
        return res.status(200).json({ token: token, username: user.username });

    } catch (error) {
        console.log('Error: ', error);
        return res.status(500).json({ error: error });
    }
};