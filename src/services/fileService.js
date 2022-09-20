export const uploadFile = async (file) => {
	let formData = new FormData();

	formData.set('file', file, file.name);

	const response = await fetch('/upload', {
		method: 'POST',
		body: formData
	});

	if (response.status !== 200) {
		return { success: false };
	}

	const { id, filename, sha_256 } = await response.json();

	return { success: true, fileId: id, fileName: filename, hash: sha_256 };
};

