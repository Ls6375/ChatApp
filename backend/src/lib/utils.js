import jwt from 'jsonwebtoken'

export const generateToken = (userId, res) =>{
	const token = jwt.sign({userId});
};