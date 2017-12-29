import { IGMResource } from '../IGMInterfaces';

export default interface IGetResourceByKey {
	getResourceByKey(key: string): IGMResource | undefined;
}