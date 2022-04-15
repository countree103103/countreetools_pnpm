import { execaCommandSync } from "execa"
import ora from "ora";

const spin = ora()

async function main(){
  try {
    spin.start("installing dependencies...");
    execaCommandSync(`pnpm install`, {stdio:"inherit"});
    execaCommandSync(`pnpm install -F *server -F *utils`, {stdio:"inherit"});
    execaCommandSync(`pnpm install --shamefully-hoist -F *client`, {stdio:"inherit"});
    spin.succeed("installed dependencies succeed!");
  } catch (error) {
    spin.fail("something went wrong during install dependencies progress!")
  }
}


main()