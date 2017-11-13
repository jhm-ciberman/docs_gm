/////////// docs_gm template.json file

declare interface TemplateJSON {
	author: string;
	description: string;
	web: string;
	designs: TemplateJSONDesign[];
}

declare interface TemplateJSONDesign {
	name: string,
	copy: string[],
	pages: TemplateJSONPage[]
}
declare interface TemplateJSONPage {
    in: string;
	out: string;
	feedwith: string;
}
