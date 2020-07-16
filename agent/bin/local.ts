#!/usr/bin/env node
import init from '../init';

(function runAtCmd() {
  init(process.cwd());
})();
