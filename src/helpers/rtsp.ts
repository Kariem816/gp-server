import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export class RTSP {
	constructor(
		public url: string,
		public name = "cam"
	) {}

	async capture(fileName?: string) {
		let args = ["-i", this.url, "-vframes", "1"];

		let actualFileName = fileName ?? `./${this.name}-${Date.now()}.jpg`;

		const cmd = "ffmpeg " + args.join(" ") + " " + actualFileName;
		await execAsync(cmd);
		return actualFileName;
	}
}
