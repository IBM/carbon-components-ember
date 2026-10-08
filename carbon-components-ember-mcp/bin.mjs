#!/usr/bin/env node

import { main } from './server.mjs';

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
