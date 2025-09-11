import en from "./en.json";
import fr from "./fr.json";

import frenchMessages from "ra-language-french";
import englishMessages from "ra-language-english";

const french = {
	...frenchMessages,
	...fr,
};

const english = {
	...englishMessages,
	...en,
};

export default {
	french,
	english
};