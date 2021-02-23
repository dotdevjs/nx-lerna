#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const workspaceConfigPath = path.join(process.cwd(), 'workspace.json');
if (!fs.existsSync(workspaceConfigPath)) {
  console.log(`Invalid workspaceConfigPath ${workspaceConfigPath}`);
  process.exit(1);
}
const configDataJSON = fs.readFileSync(workspaceConfigPath).toString();
const config = JSON.parse(configDataJSON);

Object.keys(config.projects).forEach((project) => {
  const projectConfig = config.projects[project];
  const build = projectConfig.architect.build.options || {};
  if (!build.outputPath) {
    return;
  }
  const outputPath = build.outputPath.substring(0, 5);
  if ('dist/' !== outputPath) {
    return;
  }
  const newOutputPath = build.outputPath.substring(5) + '/dist';
  projectConfig.architect.build.options.outputPath = newOutputPath;
  config.projects[project] = projectConfig;
});

try {
  fs.unlinkSync(workspaceConfigPath + '.bak');
} catch (e) {
  console.warn('Backup file not exists.');
}
fs.copyFileSync(workspaceConfigPath, workspaceConfigPath + '.bak');
fs.writeFileSync(workspaceConfigPath, JSON.stringify(config, null, 2));
fs.unlinkSync(workspaceConfigPath + '.bak');

console.log(`Done for ${workspaceConfigPath}.`);
