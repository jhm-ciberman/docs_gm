import { IRoot } from "../../../../src/template/TemplateJSON";

export const myTemplateJSON: IRoot = {
	author: "Darth Vader",
	web: "http://foo.com/",
	description: "My description",
	defaultDesign: "myDesign",
	designs: {
		myDesign: {
			displayName: "My design",
			index: "index.njk",
		},
		myOtherDesign: {
			displayName: "My Other design",
			index: "index.njk",
		},
	},
};
