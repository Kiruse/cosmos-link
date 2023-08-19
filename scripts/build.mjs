#!/usr/bin/env node
import * as child_process from 'child_process'
import * as fs from 'fs/promises'
import { rimraf } from 'rimraf'

const urlof = (filename) => new URL(`../${filename}`, import.meta.url);
const filepath = (filename) => urlof(filename).pathname;

function exec(command, options) {
  return new Promise((resolve, reject) => {
    child_process.exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({stdout, stderr});
      }
    });
  });
}

console.log('Clearing public directory...');
await rimraf(filepath('public'));
console.log('Building...');
await rebuild();

async function rebuild() {
  if (global._rebuildAbort) {
    global._rebuildAbort.abort()
  }

  global._rebuildAbort = new AbortController();
  await Promise.all([
    exec('webpack', { signal: global._rebuildAbort.signal }),
    fs.cp(filepath('assets/public'), filepath('public'), { recursive: true }),
  ]);
  global._rebuildAbort = null;
}
