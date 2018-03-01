import IReporter from "../reporter/IReporter";

export default interface IValidationRule<T> {
	reporter: IReporter;
	validate(element: T): boolean;
}