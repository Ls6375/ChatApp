import User from "../models/user.models.js";
import Message from "../models/message.models.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsers = async (req, res) => {
	try {
		const senderId = req.user._id;
		const filteredUsers = await User.find({ _id: { $ne: senderId } }).select('-password');

		res.status(200).json(filteredUsers);

	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error: " + error.message });
	}
};

export const getMessages = async (req, res) => {

	try {
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		const messages = await Message.find({
			$or: [
				{ senderId: senderId, receiverId: receiverId },
				{ senderId: receiverId, receiverId: senderId },
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
		const { id: receiverId } = req.params;

		const { text, image } = req.body;
		const senderId = req.user._id;

		let imageUrl;
		if (image) {
			const uploadResponse = await cloudinary.uploader.upload(image)
			imageUrl = uploadResponse.secure_url;
		}

		const messages = new Message({
			senderId: senderId,
			receiverId: receiverId,
			text,
			image: imageUrl
		});

		await messages.save();
		
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			console.log('Broadcasting to ' , receiverId);
			
			io.to(receiverSocketId).emit("newMessage", messages);
		}else{
			console.log('No receiver socket found for ', receiverId);
		}
		
		res.status(201).json(messages);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error: " + error.message });
	}
};
