const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

// Compile only these pure validators; no database or Next.js server is needed.
function loadValidator(name) {
  const filename = path.join(__dirname, "../src/lib", `${name}.ts`);
  const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  new Function("require", "exports", "module", source)(
    (specifier) => specifier === "./project-domain" ? loadValidator("project-domain") : require(specifier),
    module.exports, module,
  );
  return module.exports;
}
const { parseProjectInput } = loadValidator("project-input");
const valid = { title: "Portfolio", description: "Student project", techStack: ["Next.js"], liveUrl: "https://student.vercel.app", githubUrl: "https://github.com/student/project" };
let checks = 0;
for (const liveUrl of ["https://student.vercel.app", "https://project.example.kz/demo", "https://student.github.io/portfolio"]) {
  assert.ok(parseProjectInput({ ...valid, liveUrl }).data, liveUrl);
  checks++;
}
for (const liveUrl of ["", null, undefined, "https://example.kz", "http://localhost:3000", "https://127.0.0.1", "https://a.b.example.kz", "javascript:alert(1)", "https://user:password@student.vercel.app", "https://-bad.example.kz", "https://student.vercel.app:8080"]) {
  assert.ok(parseProjectInput({ ...valid, liveUrl }).error, String(liveUrl));
  checks++;
}
for (const input of [null, {}, { ...valid, title: "" }, { ...valid, techStack: [] }, { ...valid, githubUrl: "javascript:alert(1)" }]) {
  assert.ok(parseProjectInput(input).error);
  checks++;
}
console.log(`${checks} project validation checks passed.`);
