import { IRoot } from "../TemplateJSON";

export const myTemplateJSON: IRoot = {
	author: "Darth Vader",
	web: "http://foo.com/",
	description: "My description",
	defaultDesign: "myDesign",
	designs: {
		myDesign: {
			displayName: "My design",
			pages: [
				{ in: "page.njk", out: "index.html", feedWith: "scripts" },
			],
		},
		myOtherDesign: {
			displayName: "My Other design",
			pages: [
				{ in: "page.njk", out: "index.html", feedWith: "scripts" },
			],
		},
	},
};
