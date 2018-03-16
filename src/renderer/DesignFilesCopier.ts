import * as fse from "fs-extra";
import * as globby from "globby";
import { injectable } from "inversify";
import * as path from "path";
import Design from "../template/Design";
import IDesignFilesCopier from "./interfaces/IDesignFilesCopier";

@injectable()
export default class DesignFilesCopier implements IDesignFilesCopier {
	/**
	 * Copy the Design files inside the outputFolder. By default, it will copy
	 * all files except the package.json, template.json and *.njk files.
	 * @param outputFolder The output folder
	 */
	public async copy(outputFolder: string, design: Design): Promise<void> {
		const files = await globby(design.copy, { cwd: design.template.folder });
		for (const file of files) {
			const outputFile = path.resolve(outputFolder, file);
			const inputFile = path.resolve(design.template.folder, file);
			await fse.copy(inputFile, outputFile);
		}
	}
}
