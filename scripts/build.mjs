#!/usr/bin/env node
import * as child_process from 'child_process'
import * as fs from 'fs/promises'

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

await Promise.all([
  exec('webpack'),
  fs.cp(filepath('assets/public'), filepath('public'), { recursive: true }),
]);
