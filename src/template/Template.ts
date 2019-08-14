import * as fg from "fast-glob";
import * as fse from "fs-extra";
import * as path from "path";
import { DocResourceType } from "../doc_models/DocResourceType";
import * as TemplateJSON from "./TemplateJSON";

/**
 * Represents a Documentation HTML Template
 */
export default class Template {

	public static DEFAULT_COPY: string[] = [
		"**/*",
	];

	public static DEFAULT_IGNORE: string[] = [
		"**/template.json",
		"**/*.njk",
		"**/package.json",
		"**/package-lock.json",
		"**/.gitignore",
	];

	/**
	 * The design display name
	 */
	public name: string | null;

	/**
	 * An array with the globs used when copying files from the input template folder to the
	 * output documentation folder.
	 */
	public copy: string[] = Template.DEFAULT_COPY;

	/**
	 * The input file for the design
	 */
	public index: string;

	/**
	 * The folder of the template
	 */
	public folder: string;

	/**
	 * The template author
	 */
	public author: string | undefined;

	/**
	 * The default design name
	 */
	public description: string | undefined;

	/**
	 * The web of the author of the template
	 */
	public web: string | undefined;

	private _pages: TemplateJSON.IPages;

	/**
	 * Creates an instance of Template.
	 * @param {string} folder The template folder
	 * @memberof Template
	 */
	public constructor(folder: string, data: TemplateJSON.IRoot) {
		this.folder = folder;
		this.author = data.author;
		this.description = data.description;
		this.web = data.web;
		this.copy = data.copy || this.copy;
		this.name = data.name;
		this._pages = data.pages;
	}

	public getTemplatePathFor(type: DocResourceType): string {
		if (type === DocResourceType.Resource) {
			throw new Error("Unrecognized resource type");
		}
		return this._pages[type];
	}

	/**
	 * Copy the Design files inside the outputFolder. By default, it will copy
	 * all files except the package.json, template.json and *.njk files.
	 * @param outputFolder The output folder
	 */
	public async copyFiles(outputFolder: string): Promise<void> {
		const files = await fg(this.copy, {
			cwd: this.folder,
			baseNameMatch: true,
			ignore: Template.DEFAULT_IGNORE,
		});

		for (const file of files) {
			const outputFile = path.resolve(outputFolder, file);
			const inputFile = path.resolve(this.folder, file);
			await fse.copy(inputFile, outputFile);
		}
	}
}
