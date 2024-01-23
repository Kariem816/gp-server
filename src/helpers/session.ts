import platform from "platform";

import type { Request } from "express";

export function parseUserAgent(UA: Request["headers"]["user-agent"]): string {
	if (UA?.startsWith("Smart Campus App")) {
		return UA;
	}
	return platform.parse(UA).toString();
}
