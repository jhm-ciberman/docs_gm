#!/usr/bin/env node

/**
 * This file is the entry point for the command line interface (CLI)
 */
import container from "./inversify.config";

import Cli from "./cli/Cli";

// CLI Composition root
const cli = container.resolve(Cli);
cli.parse(process.argv.slice(2));
