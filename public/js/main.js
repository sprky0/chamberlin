// borrowed this beauty
// https://gongs-unlimited.com/products/freenotes-waves-a-440-hz?srsltid=AfmBOoqWFxwv85WlnkBfxy1TFhJ_ycw5x_4JgTE2agKuncQhOF-1DbcV&variant=43676800942272

const piano = new Chaberlin();

document.getElementById('load').addEventListener('click', async () => {
	await piano.loadSample('audio/note.wav');


	setTimeout(() => {	
		/*
		piano.playKey(40);
		piano.playKey(44);
		piano.playKey(47);
		piano.playKey(52);
		*/
		// can also do this
		piano.playChord([30,44,59,64,68]);

	}, 1000);

});

/*

at some point make a UI maybe

let keyState = {
	40: false, // C4
	42: false, // D4
	44: false, // E4
	// Add more keys as needed
};

document.addEventListener('keydown', (event) => {
	// Map computer keyboard keys to piano keys
	const keyMap = {
		'a': 40, // C4
		's': 42, // D4
		'd': 44, // E4
	};

	// 1x per keydown
	if (!keyState[keyMap[event.key]]) {
		piano.playKey(keyMap[event.key]);
		keyMap[event.key] = true;
	}

});
	
document.addEventListener('keyup', (event) => {
	const keyMap = {
		'a': 40,
		's': 42,
		'd': 44,
	};

	if (keyMap[event.key]) {
		piano.stopKey(keyMap[event.key]);
		if (!keyState[keyMap[event.key]]) {
			keyMap[event.key] = false;
		}
	}
});
*/
