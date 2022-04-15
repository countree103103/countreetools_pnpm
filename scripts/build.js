import ora from "ora";
import chalk from "chalk";
import { execaCommandSync,execaSync,execa } from "execa";
import path from "path";
import { existsSync, fstat, readdirSync, rmdirSync, rmSync, statSync } from "fs";

const __dirname = new URL('.',import.meta.url).pathname.replace(/^\//,"");
let spin = ora();

async function runBuild(packagesList){
  for(let packageName of packagesList){
    await build(packageName);
  }
  console.log(chalk.green("all packages builded succeed!check packages's dist directory to get programs."));
}

async function build(packageName){
  spin.start(`building ${packageName}...`);
  let {stdout,stderr,failed} = await execa("pnpm build",[],{cwd:path.join(__dirname,"../packages/"+packageName),stdio:"inherit"});
  spin.succeed(`${packageName} builded succeed!`);
}

function clearPackageDist(packagesList){
  spin.start("clearing dist...");
  for(let packageName of packagesList){
    rmSync(path.join(__dirname,`../packages/${packageName}/dist`),{recursive:true, force:true});
  }
  spin.succeed("cleared dist succeed!");
}

function getPackagesList(){
  const packagesList = readdirSync(path.join(__dirname, "../packages"));
  return packagesList;
}

async function main(){

  try {
    clearPackageDist(getPackagesList());
  } catch (error) {
    spin.fail("something went wrong during clear progess!");
  }

  try {
    await runBuild(getPackagesList());
  } catch (error) {
    console.log(error)
    spin.fail("something went wrong during build progess!")
  }
}



main()