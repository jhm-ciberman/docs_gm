#!/usr/bin/env node

import Cli from "./cli/Cli";
import container from "./inversify.config";

// CLI Composition root
const cli = container.get(Cli);
cli.parse(process.argv);
