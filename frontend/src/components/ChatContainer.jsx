import React from 'react'
import { useChatStore } from '../store/useChatStore'

const ChatContainer = () => {
	const { messages, getMessages, isMessagesLoading, selectedUser } = useChatStore();
	// Handle user selection

	useEffect(() => {
		getMessages(selectedUser._id);
	}, [selectedUser._id, getMessages])
	
	if (isMessagesLoading) return <div>Loading...</div>


	return (
		<div className='flex-1 flex flex-col overflow-auto'>
			<ChatHeader />
			<p>messages...</p>
			<MessageInput />
		</div>
	)
}

export default ChatContainer