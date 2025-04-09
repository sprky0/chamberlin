// 88-Key Virtual Piano with Playback Rate Adjustment
// This implementation creates 88 audio buffers, each playing at different rates
// to achieve the correct pitch for each piano key from a single audio sample

class Chaberlin {
	constructor() {
		this.audioCtx = null;
		this.sampleBuffer = null;
		this.keys = [];
		this.isLoaded = false;
		this.noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
		
		// The base frequency used for the sample (A4 = 440Hz by default)
		// In a real implementation, this should match your sample's actual frequency
		this.baseFrequency = 440;
		
		// Initialize the 88 keys (A0 to C8)
		this.initializeKeys();
	}
	
	// Calculate the frequency for a piano key (1-88)
	// Using equal temperament where A4 (key 49) = 440 Hz
	getFrequencyForKey(keyNumber) {
		return this.baseFrequency * Math.pow(2, (keyNumber - 49) / 12);
	}
	
	// Convert key number to note name (A0 = key 1)
	getNoteName(keyNumber) {
		const octave = Math.floor((keyNumber - 1) / 12);
		const noteIndex = (keyNumber - 1) % 12;
		// Adjust for piano starting at A
		const adjustedIndex = (noteIndex + 9) % 12;
		return this.noteNames[adjustedIndex] + octave;
	}
	
	// Set up all 88 keys with their frequencies and playback rates
	initializeKeys() {
		for (let i = 1; i <= 88; i++) {
			const frequency = this.getFrequencyForKey(i);
			const playbackRate = frequency / this.baseFrequency;
			const noteName = this.getNoteName(i);
			
			this.keys.push({
				keyNumber: i,
				noteName: noteName,
				frequency: frequency,
				playbackRate: playbackRate,
				sourceNode: null,
				isPlaying: false
			});
		}
		
		console.log("Virtual piano initialized with 88 keys");
	}
	
	// Load an audio sample to use for all keys
	async loadSample(url) {
		if (!this.audioCtx) {
			// Create audio context on first user interaction
			this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		}
		
		try {
			const response = await fetch(url);
			const audioData = await response.arrayBuffer();
			this.sampleBuffer = await this.audioCtx.decodeAudioData(audioData);
			this.isLoaded = true;
			console.log(`Sample loaded: ${url}`);
			return true;
		} catch (error) {
			console.error(`Failed to load audio sample: ${error.message}`);
			return false;
		}
	}
	
	// Play a specific piano key
	playKey(keyNumber) {
		if (!this.isLoaded) {
			console.error("Cannot play - sample not loaded");
			return false;
		}
		
		if (keyNumber < 1 || keyNumber > 88) {
			console.error(`Invalid key number: ${keyNumber}. Must be between 1-88.`);
			return false;
		}
		
		const key = this.keys[keyNumber - 1];
		
		// If the key is already playing, stop it first
		if (key.isPlaying) {
		this.stopKey(keyNumber);
		}
		
		// Create a new buffer source for this key
		const source = this.audioCtx.createBufferSource();
		source.buffer = this.sampleBuffer;
		source.connect(this.audioCtx.destination);
		source.loop = true;
		source.playbackRate.value = key.playbackRate;
		source.start();
		
		// Store the source node so we can stop it later
		key.sourceNode = source;
		key.isPlaying = true;
		
		console.log(`Playing ${key.noteName} (key ${keyNumber}), ` +
					`frequency: ${key.frequency.toFixed(2)} Hz, ` +
					`playback rate: ${key.playbackRate.toFixed(4)}`);
		
		return true;
	}
	
	// Stop a specific piano key
	stopKey(keyNumber) {
		if (keyNumber < 1 || keyNumber > 88) {
			console.error(`Invalid key number: ${keyNumber}. Must be between 1-88.`);
			return false;
		}
		
		const key = this.keys[keyNumber - 1];
		
		if (key.isPlaying && key.sourceNode) {
			key.sourceNode.stop();
			key.sourceNode = null;
			key.isPlaying = false;
			console.log(`Stopped ${key.noteName} (key ${keyNumber})`);
			return true;
		}
		
		return false;
	}
	
	// Stop all playing keys
	stopAllKeys() {
		this.keys.forEach((key, index) => {
		if (key.isPlaying) {
			this.stopKey(index + 1);
		}
		});
		console.log("All keys stopped");
	}
	
	// Play a chord (multiple keys at once)
	playChord(keyNumbers) {
		keyNumbers.forEach(keyNumber => this.playKey(keyNumber));
		console.log(`Playing chord: ${keyNumbers.map(k => this.keys[k-1].noteName).join(', ')}`);
	}
	
	// Return information about all 88 keys
	getAllKeyInfo() {
		return this.keys.map(key => ({
			keyNumber: key.keyNumber,
			noteName: key.noteName,
			frequency: key.frequency.toFixed(2),
			playbackRate: key.playbackRate.toFixed(4),
			isPlaying: key.isPlaying
		}));
	}
	
	// Log the status of all keys to the console
	logKeyboardStatus() {
		console.log("Virtual Piano - 88 Keys Status:");
		
		// Group by octave for easier reading
		for (let octave = 0; octave <= 8; octave++) {
			const octaveKeys = this.keys.filter(key => key.noteName.includes(octave));
			if (octaveKeys.length > 0) {
				console.log(`\nOctave ${octave}:`);
				octaveKeys.forEach(key => {
				const status = key.isPlaying ? "PLAYING" : "silent";
				console.log(`${key.noteName.padEnd(3)} | Key ${String(key.keyNumber).padStart(2)} | ` +
							`${key.frequency.toFixed(2).padStart(7)} Hz | ` +
							`Rate: ${key.playbackRate.toFixed(4).padStart(6)} | ${status}`);
				});
			}
		}
	}
}
