/////////// docs_gm template.json file

declare namespace TemplateJSON {
	interface Root {
		author: string;
		description: string;
		web: string;
		defaultDesign: string;
		designs: DesignsMap;
	}

	interface DesignsMap {
		[key: string]: Design;
	}

	interface Design {
		name: string;
		copy?: string[];
		pages: Page[];
	}

	interface Page {
		in: string;
		out: string;
		feedwith: string;
	}
}

