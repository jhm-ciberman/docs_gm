import {
	Expect,
	SetupFixture,
	Test,
	TestFixture,
} from "alsatian";

import DocParam from "../docs_models/DocParam";
import DocScript from "../docs_models/DocScript";
import IGMLParser from "./IGMLParser";
import OutputConfig from "./OutputConfig";
import Validator from "./Validator";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("ScriptParser")
export class ScriptParserFixture {

	public config: OutputConfig;
	@SetupFixture
	public setupFixture() {
		this.config = new OutputConfig();
	}

	@Test("validateDocScript should validate a valid script")
	public validateDocScript_Valid() {
		const docScript = new DocScript();
		docScript.description = "<p>My description</p>";
		docScript.undocumented = false;

		const validator = new Validator(docScript, this.config);
		Expect(validator.validateDocScript()).toBe(true);
	}

	@Test("validateDocScript should invalidate an undocumented script")
	public validateDocScript_Invalid_Undocumented() {
		const docScript = new DocScript();
		docScript.undocumented = true;

		const validator = new Validator(docScript, this.config);
		Expect(validator.validateDocScript()).toBe(false);
	}

	@Test("checkGMLFeaturesMatchDocs should validate a valid script with a non optional param")
	public checkGMLFeaturesMatchDocs_Valid_Params_nonOptional() {
		class MockGMLParser implements IGMLParser {
			public countFixedArguments(): number {
				return 1;
			}
			public countOptionalArguments(): number {
				return 0;
			}
			public hasReturn(): boolean {
				return true;
			}
		}

		const docScript = new DocScript();
		const argument0 = this._createParam("My param", "param_name", false, "real");
		docScript.params.push(argument0);
		docScript.undocumented = false;

		const validator = new Validator(docScript, this.config);
		const parser = new MockGMLParser();
		Expect(validator.checkGMLFeaturesMatchDocs(parser)).toBe(true);
	}

	private _createParam(desc: string, name: string, optional: boolean, type: string): DocParam {
		const p = new DocParam();
		p.description = desc;
		p.name = name;
		p.optional = optional;
		p.type = type;
		return p;
	}

}
