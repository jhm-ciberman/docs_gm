import * as fg from "fast-glob";
import * as fse from "fs-extra";
import { injectable } from "inversify";
import * as path from "path";
import Design from "../template/Design";
import IDesignFilesCopier from "./IDesignFilesCopier";

@injectable()
export default class DesignFilesCopier implements IDesignFilesCopier {
	/**
	 * Copy the Design files inside the outputFolder. By default, it will copy
	 * all files except the package.json, template.json and *.njk files.
	 * @param outputFolder The output folder
	 */
	public async copy(outputFolder: string, design: Design): Promise<void> {
		const files = await fg(design.copy, {
			cwd: design.template.folder,
			baseNameMatch: true,
			ignore: Design.DEFAULT_IGNORE,
		});
		for (const file of files) {
			const outputFile = path.resolve(outputFolder, file);
			const inputFile = path.resolve(design.template.folder, file);
			await fse.copy(inputFile, outputFile);
		}
	}
}
