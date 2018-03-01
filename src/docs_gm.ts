#!/usr/bin/env node

/**
 * This file is the entry point for the command line interface (CLI)
 */

import Cli from "./cli/Cli";
import container from "./inversify.config";

// CLI Composition root
const cli = container.get(Cli);
cli.parse(process.argv);
