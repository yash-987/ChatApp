const User = require('../models/userModel');
const generateToken = require('../config/generateToken');
const expressAsyncHandler = require('express-async-handler');
const { query } = require('express');
const { decodeBase64 } = require('bcryptjs');

const registerUser = expressAsyncHandler(async (req, res) => {
	
	if (req.method === 'POST') {
		const { name, email, password, pic } = req.body;

		if (!name || !email || !password) {
			res.status(400);
			throw new Error('Please Enter all the fields');
		}
		console.log(req.body)
		const userExists = await User.findOne({ email });

		if (userExists) {
			res.status(400);
			throw new Error('User already exists');
		}

		const user = await User.create({
			name,
			email,
			password,
			pic,
		});

		if (user) {
			res.status(201).json({
				_id: user._id,
				name: user.name,
				email: user.email,
				isAdmin: user.isAdmin,
				pic: user.pic,
				token: generateToken(user._id),
			});
		} else {
			console.log('error');
			res.status(400);
			throw new Error('User not created');
		}
	} else {
		console.log('not a post request');
		res.setHeader('Allow', ['POST']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
});

//login
const authUser = expressAsyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password)
		return res.status(401).json({ msg: 'Please fill all the fields' });

	console.log(email);

	const user = await User.findOne({ email });

	console.log(user);

	if (user && (await user.matchPassword(password))) {
		console.log(user);
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,

			password: user.password,
			token: generateToken(user._id),
		});
	} else {
		res.status(401).json({ msg: 'Login failed' });
	}
});

//all users
const allUsers = expressAsyncHandler(async (req, res) => {
	const keyword = req.query.search
		? {
				$or: [
					{ name: { $regex: req.query.search, $options: 'i' } },
					{ email: { $regex: req.query.search, $options: 'i' } },
				],
		  }
		: {};

	try {
		const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

		if (users.length === 0) {
			return res.status(400).json({ msg: 'No users found' });
		}
		res.send(users);
	} catch (error) {
		res.status(400).json({ msg: 'No users exists with this name' });
	}
});
module.exports = { registerUser, authUser, allUsers };
