// Type definitions for get-installed-path 4.0.8
// Project: get-installed-path
// Definitions by: Javier "Ciberman" Mora <https://github.com/jhm-ciberman/>

declare namespace GetInstalledPath {
	interface Options {
		local?: boolean;
		cwd?: string;
	}
}

declare module "get-installed-path" {
	export function getInstalledPath(name: string, opts?: GetInstalledPath.Options): Promise<string>;
	export function getInstalledPathSync(name: string, opts?: GetInstalledPath.Options): string;
}