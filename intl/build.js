const fs = require("fs");
const path = require("path");

const translations = require("./langs.json");

const langs = {};

// Convert the translations to a format that the client can use
Object.keys(translations).forEach((key) => {
	Object.keys(translations[key]).forEach((lang) => {
		if (!langs[lang]) {
			langs[lang] = {};
		}
		langs[lang][key] = translations[key][lang];
	});
});

// Make sure the directory exists
if (!fs.existsSync(path.join(__dirname, "..", "client/public/langs"))) {
	fs.mkdirSync(path.join(__dirname, "..", "client/public/langs"));
}

// Write the files
Object.keys(langs).forEach((lang) => {
	fs.writeFileSync(
		path.join(__dirname, "..", "client/public/langs", `${lang}.json`),
		JSON.stringify(langs[lang], null, 2)
	);
});
