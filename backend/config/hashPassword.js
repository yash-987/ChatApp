// userSchema.pre('save',async function (next) {
// 	if (!this.isModified) {
//         next();
// 	}

// 	try {
// 		const salt = bcrypt.genSaltSync(10);
// 		this.password = bcrypt.hashSync(this.password, salt);
// 		console.log(this.password);
//     } catch (error) {
//         console.log(error.message);
//     }
// });
// userSchema.methods.matchPassword = async function (enteredPassword) {
//     console.log('done')
//     return bcrypt.compareSync(enteredPassword, this.password)
//
const bcrypt = require("bcryptjs")


const hashPassword = async(pass) => {
    const salt = bcrypt.genSaltSync(10);
    return  bcrypt.hashSync(pass, salt);
}


const matchPassword = async (password, hashedPass) => {
    return  bcrypt.compareSync(password,hashedPass)
}


module.exports = {hashPassword,matchPassword}