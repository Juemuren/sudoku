const args = [
  "compile",
  "-A",
  "--include",
  "src/ui/tui/storage/gameValidationWorker.ts",
  "--output",
  "dist/sudoku",
  ...(Deno.build.os === "windows" ? ["--icon", "src/ui/tui/favicon.ico"] : []),
  "src/ui/tui/index.tsx",
];

const command = new Deno.Command(Deno.execPath(), {
  args,
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});
const status = await command.spawn().status;
Deno.exit(status.code);
