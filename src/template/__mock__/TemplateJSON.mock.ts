import { PageFeedWith } from "../enums/PageFeedWith";
import { IRoot } from "../interfaces/TemplateJSON";

export const myTemplateJSON: IRoot = {
	author: "Darth Vader",
	web: "http://foo.com/",
	description: "My description",
	defaultDesign: "myDesign",
	designs: {
		myDesign: {
			displayName: "My design",
			pages: [
				{ in: "page.njk", out: "index.html", feedWith: PageFeedWith.Scripts },
			],
		},
		myOtherDesign: {
			displayName: "My Other design",
			pages: [
				{ in: "page.njk", out: "index.html", feedWith: PageFeedWith.Scripts },
			],
		},
	},
};
