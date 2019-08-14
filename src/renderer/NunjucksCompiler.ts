import * as nunjucks from "nunjucks";

export default class NunjucksCompiler {

	private _env: nunjucks.Environment;

	private _precompiledTemplates: Map<string, nunjucks.Template> = new Map();

	constructor(folder: string) {
		this._env = nunjucks.configure(folder, {
			autoescape: false,
			throwOnUndefined: true,
		});

		this._env.addGlobal("date", new Date());
	}

	public addGlobal(name: string, value: any): void {
		this._env.addGlobal(name, value);
	}

	public render(templatePath: string, context: object): string {
		return this.getTemplate(templatePath).render(context);
	}

	public getTemplate(templatePath: string): nunjucks.Template {
		return this._precompiledTemplates.get(templatePath) || this._precompile(templatePath);
	}

	private _precompile(templatePath: string): nunjucks.Template {
		const template = this._env.getTemplate(templatePath, true);
		this._precompiledTemplates.set(templatePath, template);
		return template;
	}
}
