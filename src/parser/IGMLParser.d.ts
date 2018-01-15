export default interface IGMLParser {
	countFixedArguments(): number;
	countOptionalArguments(): number;
	hasReturn(): boolean;
}