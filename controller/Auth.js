

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = async (req, res) => {
    const { firstname,lastname,email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ firstname,lastname,email, password });

        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        res.json({ msg: 'User created successfully',success:true });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error in signup');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, 'secretkey', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token,
            success:true,
            userId:user.id
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(' Error in login');
    }
};


exports.savePalette = async (req, res) => {
    try {
        
        const { userId, paletteData } = req.body;
       

        if (!userId || !paletteData) {
            return res.status(400).json({ msg: 'userId and paletteData are required' });
        }

       
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

       
        user.saved.push(paletteData); 


        await user.save();

    
        res.json({ msg: 'Palette saved successfully', success: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error in saved endpoint');
    }
};

exports.saveFullPalette = async (req, res) => {
    try {
    
        const { userId, paletteData } = req.body;
      
        

        
        if (!userId || !paletteData) {
            return res.status(400).json({ msg: 'userId and paletteData are required' });
        }


        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }


        user.savefullpalette.push(paletteData); 


        await user.save();

        res.json({ msg: 'Palette saved successfully', success: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error in saved endpoint');
    }
};



exports.getSavedPalette = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("user id get",userId)

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json({ savedPalettes: user.saved,success:true });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error in getSavedPalette');
    }
};

exports.getFullPalette = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("user id get",userId)

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

       
        res.json({ savedPalettes: user.savefullpalette,success:true });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error in getSavedPalette');
    }
};
