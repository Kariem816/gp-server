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

const FakeImgs: string[] = [
	"https://cdn.discordapp.com/attachments/1067863167075631176/1254410236492644464/lp_1.jpg?ex=66796412&is=66781292&hm=d5e75712c287f7ca22f27f9080ef38a82e6085af27f872dd518a13f7e368ef5d&",
	"https://cdn.discordapp.com/attachments/1067863167075631176/1254410236983513179/lp_2.jpg?ex=66796412&is=66781292&hm=4f72f423e5637c0159bcd66b3fe035a9c82d133fe6728ebe2060c803b04b111a&",
	"https://cdn.discordapp.com/attachments/1067863167075631176/1254410237360996352/lp_3.jpg?ex=66796412&is=66781292&hm=bbf5ceaf9d17d60a39b98cce9a6a5770968b14ce49b2aac980ae72cee1e681be&",
	"https://cdn.discordapp.com/attachments/1067863167075631176/1254410237667053598/lp_4.jpg?ex=66796412&is=66781292&hm=e9485acbfdf96c1f21dd127ba5eea825032058d3b9867807cab87a69ac110a3f&",
	"https://cdn.discordapp.com/attachments/1067863167075631176/1254410237931159674/lp_5.jpg?ex=66796412&is=66781292&hm=0ebc1bbaf59ea5ef8a55fa2c024a62ad36005324173bf44c42ae0d6577eefca4&",
	"https://cdn.discordapp.com/attachments/1067863167075631176/1254410238208114700/lp_6.jpg?ex=66796412&is=66781292&hm=c8ace089ed2602b7883e4a740fb6fe8e72ee0cd5a3c3deac823a9b498cd8a1b6&",
	"https://cdn.discordapp.com/attachments/1067863167075631176/1254410238522822687/lp_7.jpg?ex=66796412&is=66781292&hm=33e3668901dee856176f2ec3d6684901c8af3af5a49b1bb0263537fdb56aebf7&",
	"https://cdn.discordapp.com/attachments/1067863167075631176/1254410238832934962/lp_8.jpg?ex=66796412&is=66781292&hm=7478575b4f1867277f0c5d1f34a9c727e4ab12f01d49d7680ed29ca516d81f86&",
	"https://cdn.discordapp.com/attachments/1067863167075631176/1254410239084728353/lp_9.jpg?ex=66796412&is=66781292&hm=4bc0028297feff523491ddced8a19f39c16b4bb7729f588650a3a64324445d9b&",
	"https://cdn.discordapp.com/attachments/1067863167075631176/1254410239491706941/lp_10.jpg?ex=66796412&is=66781292&hm=3ed43d5e5fdfe19040359a920e279311bb3fbe3770782151ccc584997c31c6a5&",
];

export class FakeRTSP {
	constructor() {}

	async capture(): Promise<string> {
		return FakeImgs[Math.floor(Math.random() * FakeImgs.length)];
	}
}
