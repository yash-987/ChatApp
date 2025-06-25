export const getSender = (loggedUser, users) => {
	if (!Array.isArray(users) || users.length < 2 || !loggedUser?._id) {
		console.warn('getSender called with invalid data', { loggedUser, users });
		return 'Unknown';
	}

	const sender = users.find((u) => u._id !== loggedUser._id);
	return sender?.name || 'Unknown';
};

export const getSenderFull = (loggedUser, users) => {
	return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (messages, m, i, userId) => {
	return (
		i < messages.length - 1 &&
		(messages[i + 1].sender._id !== m.sender._id ||
			messages[i + 1].sender._id === undefined) &&
		messages[i].sender._id !== userId
	);
};

export const isLastSender = (messages, i, userId) => {
	return (
		i === messages.length - 1 &&
		messages[messages.length - 1].sender._id !== userId &&
		messages[messages.length - 1].sender._id
	);
};

export const isSameSenderMargin = (messages, m, i, userId) => {
	if (
		i < messages.length - 1 &&
		messages[i + 1].sender._id === m.sender._id &&
		messages[i].sender._id !== userId
	)
		return 33;
	else if (
		(i < messages.length - 1 &&
			messages[i + 1].sender._id !== m.sender._id &&
			messages[i].sender._id !== userId) ||
		(i === messages.length - 1 && messages[i].sender._id !== userId)
	) {
		return 0;
	} else return 'auto';
};

export const isSameUser = (messages, m, i) => {
	return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
