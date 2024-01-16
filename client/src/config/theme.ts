import { createTheme } from "@mantine/core";

import type { MantineColorsTuple } from "@mantine/core";

const primary: MantineColorsTuple = [
	"#e4f8ff",
	"#d2eafd",
	"#a6d2f3",
	"#78b8eb",
	"#52a3e4",
	"#3996e1",
	"#288fe0",
	"#177bc7",
	"#036eb4",
	"#005f9f",
];

const secondary: MantineColorsTuple = [
	"#fcebff",
	"#f1d4fc",
	"#dfa8f4",
	"#cc78ec",
	"#bd4fe5",
	"#b335e1",
	"#af28e1",
	"#991ac8",
	"#8914b3",
	"#77099d",
];

export const theme = createTheme({
	colors: {
		primary,
		secondary,
	},
	primaryColor: "primary",
	defaultRadius: 12,
	defaultGradient: {
		from: "primary",
		to: "secondary",
		deg: 270,
	},
});
