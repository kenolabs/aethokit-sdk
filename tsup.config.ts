import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"], // entry file
	format: ["cjs", "esm"], // build both
	dts: true, // generate .d.ts
	clean: true, // clean dist before build
	sourcemap: true,
	outDir: "dist",
});
