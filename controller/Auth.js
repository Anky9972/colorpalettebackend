
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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

exports.verifyGoogleToken = async (req, res) => {
    console.log("google auth called")
    const { credential } = req.body;
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      
      const payload = ticket.getPayload();
      
      // Split name or provide defaults
      const nameParts = payload['name'].split(' ');
      const firstname = nameParts[0] || 'Google';
      const lastname = nameParts.slice(1).join(' ') || 'User';
      
      // Find or create user
      let user = await User.findOne({ 
        $or: [
          { email: payload['email'] },
          { googleId: payload['sub'] }
        ]
      });
      
      if (!user) {
        user = new User({
          email: payload['email'],
          firstname: firstname,
          lastname: lastname,
          googleId: payload['sub'],
          authMethod: 'google',
          // Optional: set an unguessable temporary password for google users
          password: Math.random().toString(36).slice(-8)
        });
        await user.save();
      }
  
      // Generate JWT
      const token = jwt.sign(
        { 
          id: user._id, 
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );
      
      res.json({ 
        token, 
        user: { 
          id: user._id, 
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname
        }
      });
    } catch (error) {
      console.error('Google Auth Error:', error);
      res.status(401).json({ error: 'Authentication failed', details: error.message });
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
