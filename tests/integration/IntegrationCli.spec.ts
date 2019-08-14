import {
	Expect,
	Setup,
	Teardown,
	Test,
	TestCase,
	TestFixture,
	Timeout,
} from "alsatian";
import { exec } from "child_process";
import { TempDir } from "../_testing_helpers/TempDir.help";
// import * as FileSystem from "fs";

/* tslint:disable:max-classes-per-file completed-docs */
@TestFixture("Integration test")
export class CliFixture {

	public dir: TempDir;

	@Setup
	public setup() {
		this.dir = TempDir.create("output", {});
	}

	@Teardown
	public teardown() {
		TempDir.removeAll();
	}

	@TestCase("gms1-project")
	@TestCase("gms2-project")
	@Test("generate")
	@Timeout(10000)
	public generate(folder: string) {
		const result = exec([
			"docs_gm",
			"generate",
			`"./tests/integration/${ folder }"`,
			`--outputFolder="${ this.dir.dir }"`,
			"--noOpen",
			"--folderPages=false",
			"--scriptPages=false",
		].join(" "));

		let stdoutStr = "";
		let stderrStr = "";

		if (result.stdout) {
			result.stdout.on("data", (data: string) => {
				stdoutStr += data;
				// tslint:disable-next-line:no-console
				console.log(data);
			});
		}

		if (result.stderr) {
			result.stderr.on("data", (data: string) => {
				stderrStr += data;
				// tslint:disable-next-line:no-console
				console.log(data);
			});
		}

		return new Promise<void>((resolve, _reject) => {
			result.on("close", (code: number) => {
				Expect(code).toBe(0);
				Expect(stderrStr).toBe("");
				Expect(stdoutStr.toLowerCase()).not.toContain("error");

				const str = this.dir.read("index.html");
				Expect(str).toContain("scr_jump");
				Expect(str).toContain("The jump height");
				Expect(str).toContain("Makes the player jump");
				resolve();
			});
		});
	}
}
