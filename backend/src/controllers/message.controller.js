import User from "../models/user.models.js";
import Message from "../models/message.models.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsers = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;
		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');

		res.status(200).json(filteredUsers);

	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error: " + error.message });
	}
};

export const getMessages = async (req, res) => {

	try {
		const { id: userToChatId } = req.params;
		const loggedInUserId = req.user._id;

		const messages = await Message.find({
			$or: [
				{ senderId: loggedInUserId, receiverId: userToChatId },
				{ senderId: userToChatId, receiverId: loggedInUserId },
			],
		});
		// .sort({ createdAt: 1 });
		res.status(200).json(messages);

	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error: " + error.message });
	}
};


export const sendMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;

		const { text, image } = req.body;
		const loggedInUserId = req.user._id;

		let imageUrl;
		if (image) {
			const uploadResponse = await cloudinary.uploader.upload(image)
			imageUrl = uploadResponse.secure_url;
		}

		const messages = new Message({
			senderId: loggedInUserId,
			receiverId: userToChatId,
			text,
			image: imageUrl
		});

		await messages.save();
		res.status(201).json(messages);

		// todo: socket.io 


	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error: " + error.message });
	}
};
