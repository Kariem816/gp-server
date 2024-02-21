class Recognizer {
	#token: string = "";
	constructor() {}

	get token() {
		return this.#token;
	}

	set token(token: string) {
		this.#token = token;
	}
}

export default new Recognizer();
