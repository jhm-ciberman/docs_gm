import {
	Expect,
	Setup,
	SpyOn,
	Test,
	TestFixture,
} from "alsatian";

import { Container } from "inversify";
import ConsoleReporter from "../../src/reporter/ConsoleReporter";

/* tslint:disable:max-classes-per-file completed-docs */

@TestFixture("ConsoleReporter")
export class ConsoleReporterFixture {

	public cr: ConsoleReporter;

	@Setup
	public setup() {
		const container = new Container();
		this.cr = container.resolve(ConsoleReporter);
	}
	@Test("error")
	public error() {
		const spy = SpyOn(console, "error");
		spy.andStub();
		this.cr.error("foo");
		Expect(spy).toHaveBeenCalled();
	}
	@Test("warn")
	public warn() {
		const spy = SpyOn(console, "warn");
		spy.andStub();
		this.cr.warn("foo");
		Expect(spy).toHaveBeenCalled();
	}
	@Test("info")
	public info() {
		const spy = SpyOn(console, "info");
		spy.andStub();
		this.cr.info("foo");
		Expect(spy).toHaveBeenCalled();
	}
	@Test("debug")
	public debug() {
		const spy = SpyOn(console, "debug");
		spy.andStub();
		this.cr.debug("foo");
		Expect(spy).toHaveBeenCalled();
	}
}
