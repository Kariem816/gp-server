import { exec } from "child_process";
import { promisify } from "util";

type RTSPCredentials =
	| {
			username: string;
			password: string;
			ip: string;
	  }
	| {
			url: string;
	  };

const execAsync = promisify(exec);

export class RTSP {
	public url: string;
	constructor(
		credentials: RTSPCredentials,
		public tcp: boolean,
		public name = "cam"
	) {
		if ("url" in credentials) {
			this.url = encodeURI(credentials.url);
		} else {
			// TODO: verify ip format: ip must be a valid domain or ip address with port
			this.url = encodeURI(
				`rtsp://${credentials.username}:${credentials.password}@${credentials.ip}/cam/realmonitor?channel=1&subtype=0`
			);
		}
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

const FakeImgs: string[] = [];

export class FakeRTSP {
	constructor() {}

	async capture(): Promise<string> {
		return FakeImgs[Math.floor(Math.random() * FakeImgs.length)];
	}
}
