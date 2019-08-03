export default interface IReporter {

	debug(...str: any[]): void;

	info(...str: any[]): void;

	warn(...str: any[]): void;

	error(...str: any[]): void;

}
