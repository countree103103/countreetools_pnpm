import ora from "ora";
import chalk from "chalk";
import { execaCommandSync,execaSync,execa } from "execa";
import path from "path";
import { existsSync, fstat, readdirSync, rmdirSync, rmSync, statSync } from "fs";

const __dirname = new URL('.',import.meta.url).pathname.replace(/^\//,"")
let spin = ora()
async function build(packageName){
  let {stdout,stderr,failed} = await execa("pnpm build",[],{cwd:path.resolve(__dirname,"../packages/"+packageName),stdio:"inherit"})
}

function clearPackageDist(packagesList){
  for(let packageName of packagesList){
    rmSync(path.resolve(__dirname,`../packages/${packageName}/dist`),{recursive:true, force:true})
    // console.log(path.resolve(__dirname,`../packages/${packageName}/dist`))
  }
}

function getPackagesList(){
  const packagesList = readdirSync(path.resolve(__dirname, "../packages"));
  return packagesList;
}

async function main(){

  try {
    spin.start("clearing dist...");
    clearPackageDist(getPackagesList());
    spin.succeed("cleared dist succeed!");
  } catch (error) {
    spin.fail("something went wrong during clear progess!")
  }

  try {
    spin.start("building server...")
    await build("countreetools_server")
    spin.succeed("server builded suceed!")
    spin.start("building client...")
    await build("countreetools_client")
    spin.succeed("client builded suceed!")
    spin.start("building utils...")
    await build("countreetools_utils")
    spin.succeed("utils builded suceed!")

    console.log(chalk.green("all packages builded succeed!check packages's dist directory to get programs."))
  } catch (error) {
    spin.fail("something went wrong during build progess!")
  }
}



main()