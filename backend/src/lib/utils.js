import jwt from 'jsonwebtoken'


export const generateToken = (userId, res) =>{
	const token = jwt.sign({userId}, process.env.JWT_SECRET, {
		expiresIn: '7d'
	});

	res.cookie('jwt', token,{
		maxAge: 7 * 24 * 60 * 60 * 1000, // MS
		httpOnly: true, // Only accessible through the HTTP protocol
		sameSite: 'strict',
		secure: process.env.NODE_ENV !== 'development'
	});

	return token;
};

export const verifyToken = (req, res, next) => {
	const token = req.cookies.jwt;

	if(!token) return res.status(401).send('Access denied. No token provided.');

	if (jwt.verify(token, process.env.JWT_SECRET)) {
		next();
	}else{
		return res.status(403).send('Access denied. Token invalid or expired.');
	}
}