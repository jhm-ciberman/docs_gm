import Design from "../../template/entities/Design";

export default interface IDesignFilesCopier {
	copy(outputFolder: string, design: Design): Promise<void>;
}