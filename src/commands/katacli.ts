const TEMPLATE_REPO = `https://github.com/samdelacruz/TypeScript-Kata-Starter.git`;
module.exports = {
  name: "katacli",
  run: async toolbox => {
    const {
      parameters,
      print: { info },
      filesystem: { remove },
      patching: { update },
      system: { run }
    } = toolbox;

    const name = parameters.first;

    let spinner = toolbox.print.spin(`cloning template project to ${name}`);
    await run(`git clone ${TEMPLATE_REPO} ${name}`);
    spinner.succeed();

    const pathToPackageJSON = `${name}/package.json`;

    spinner = toolbox.print.spin(`update package.json`);
    await update(pathToPackageJSON, pkg => {
      pkg.name = name;
      return pkg;
    });
    spinner.succeed();

    await remove(`${name}/.git`);
    await run(`git init ${name}`);

    spinner = toolbox.print.spin(`installing npm dependencies`);
    await run(`cd ${name} && npm install`);
    spinner.succeed();


    await run(`cd ${name} && git add -A && git commit -m "Initial commit"`);

    info(`Generated kata project at ${name}`);
  }
};
