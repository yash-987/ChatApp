const User = require('../models/userModel');
const { generateToken, decodeToken } = require('../config/generateToken');
const expressAsyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const { query } = require('express');
const { decodeBase64 } = require('bcryptjs');
const { hashPassword, matchPassword } = require('../config/hashPassword');

const registerUser = expressAsyncHandler(async (req, res) => {
	if (req.method === 'POST') {
		const { name, email, password, pic } = req.body;

		if (!name || !email || !password) {
			res.status(400);
			throw new Error('Please Enter all the fields');
		}
		console.log(req.body);
		const userExists = await User.findOne({ email });

		if (userExists) {
			res.status(400);
			throw new Error('User already exists');
		}

		const hashedPassword = await hashPassword(password);
		const user = await User.create({
			name,
			email,
			password: hashedPassword,
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

	if (!user) {
		return res.status(403).json({
			msg: 'Invalid email or password',
		});
	}

	const isMatchedPass = await matchPassword(password, user.password);

	if (!isMatchedPass) {
		return res.status(403).json({
			msg: 'Wrong Password',
		});
	}

	res.json({
		_id: user._id,
		name: user.name,
		email: user.email,
		password: user.password,
		token: generateToken(user._id),
	});
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

const forgetPassword = expressAsyncHandler(async (req, res) => {
	try {
		const { email } = req.body;
		if (!email) {
			return res.status(403).json({
				msg: 'Please provide your email',
			});
		}

		const userExists = await User.findOne({ email });

		if (!userExists) {
			return res.status(403).json({ msg: 'User does not exist' });
		}

		const token = generateToken(userExists.email);

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			secure: true,
			auth: {
				user: process.env.MY_GMAIL,
				pass: process.env.MY_PASSWORD,
			},
		});

		const receiver = {
			from: 'ys2599518@gmail.com',
			to: email,
			subject: 'Request for Password Reset',
			text: `Click on the link to generate your new password ${`
http://localhost:5173/LoginHelp/reset-password`}/${token}`,
		};
		await transporter.sendMail(receiver);

		return res.status(200).json({
			msg: `Password reset link sent successfully to email`,
		});
	} catch (error) {
		res.status(403).send({
			msg: 'Error sending password reset link',
		});
	}
});

const resetPassword = expressAsyncHandler(async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		if (!password) {
			return res.status(403).json({
				msg: 'Password is required',
			});
		}

		const decode = decodeToken(token);
		const user = await User.findOne({ email: decode.id });
		if (!user) {
			return res.status(403).json({
				msg: 'Invalid token',
			});
		}

		const newHashPass = await hashPassword(password);

		user.password = newHashPass;
		await user.save();

		return res.status(200).json({
			msg: 'Password reset successfully',
		});
	} catch (error) {
		res.status(403).json({
			msg: error.message,
		});
	}
});
module.exports = {
	registerUser,
	authUser,
	allUsers,
	forgetPassword,
	resetPassword,
};
