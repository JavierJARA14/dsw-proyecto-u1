const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || "1234";

async function register(req, res) {
    const { username, password, mail, role, rfc, address, facturapi_id } = req.body;

    if (!username || !password || !mail || !role) {
        return res.status(400).json({ message: "Username, password, mail and role are required" });
    }

    const existingUser = await User.findByUsername(username);
    if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const created = await User.addUser({
        username,
        password: hashedPassword,
        mail,
        role,
        rfc: rfc || "",
        address: address || "",
        facturapi_id: facturapi_id || ""
    });

    res.status(201).json({
        id: created.id,
        username: created.username,
        mail: created.mail,
        role: created.role,
        rfc: created.rfc,
        address: created.address,
        facturapi_id: created.facturapi_id
    });
}

async function login(req, res) {
    const {username, password} = req.body;
    if(!username || !password) {
        return res.status(400).json({message: "Username and Password are required"});
    }

    const user = await User.findByUsername(username);
    if(!user) {
        return res.status(401).json({message: "Invalid credentials"});
    };

    const match = await bcrypt.compare(password, user.password)
    if(!match) {
        return res.status(401).json({message: "Invalid credentials"});
    };

    const token = jwt.sign(
        {
            id: user.id,
            username: user.username,
            role: user.role 
        },
        JWT_SECRET,
        {expiresIn: '5min'}
    );

    res.status(200).json({token: token});
}


module.exports = {register, login};