import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export class RTSP {
	public url: string;
	constructor(
		url: string,
		public tcp: boolean,
		public name = "cam"
	) {
		this.url = encodeURI(url);
	}

	async capture(fileName?: string) {
		let args = ["-i", '"' + this.url + '"', "-vframes", "1"];

		if (this.tcp) {
			args.unshift("-rtsp_transport", "tcp");
		}

		let actualFileName = fileName ?? `./${this.name}-${Date.now()}.jpg`;

		const cmd = "ffmpeg " + args.join(" ") + " " + actualFileName;
		await execAsync(cmd);
		return actualFileName;
	}
}
