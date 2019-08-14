import { injectable } from "inversify";
import { Validator } from "jsonschema";

@injectable()
export default class SchemaValidator {
	public validate(data: any, schema: any): void {
		const validator = new Validator();
		validator.validate(data, schema, {throwError: true});
	}
}
