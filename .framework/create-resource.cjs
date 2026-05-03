const resourceList = [
  "component",
  "view",
  "provider",
  "layout",
  "constant",
  "form",
  "hook",
  "mutation",
  "query",
  "route",
  "store",
  "type",
  "util",
];

const args = process.argv.slice(2);
const resourceType = args[0];
const resourceName = args[1];

if (!resourceList.includes(resourceType)) {
  console.error(`🛑 Invalid resource type.`);
  console.error(`🛑 Please choose from: ${resourceList.join(", ")}`);
  process.exit(1);
} else if (resourceType === "component") {
  const atomicLevel = args[1];
  const componentName = args[2];
  const {
    VALID_ATOMIC_LEVELS: validAtomicLevels,
  } = require("./create-component.cjs");
  if (!atomicLevel || !validAtomicLevels.includes(atomicLevel)) {
    console.error(`🛑 Invalid or missing atomic level.`);
    console.error(`🛑 Valid levels: ${validAtomicLevels.join(", ")}`);
    process.exit(1);
  } else if (componentName) {
    const { createComponent } = require("./create-component.cjs");
    createComponent(atomicLevel, componentName);
  } else {
    console.error(`🛑 Missing component name.`);
    console.error(
      `Usage: node .framework/create-resource.cjs component {atomicLevel} {ComponentName}`,
    );
    process.exit(1);
  }
} else if (resourceType === "view" && resourceName) {
  const { createView } = require("./create-view.cjs");
  createView(resourceName);
} else if (resourceType === "provider" && resourceName) {
  const { createProvider } = require("./create-provider.cjs");
  createProvider(resourceName);
} else if (resourceType === "constant" && resourceName) {
  const { createConstant } = require("./create-constant.cjs");
  createConstant(resourceName);
} else if (resourceType === "layout" && resourceName) {
  const { createLayout } = require("./create-layout.cjs");
  createLayout(resourceName);
} else if (resourceType === "hook" && resourceName) {
  const { createHook } = require("./create-hook.cjs");
  createHook(resourceName);
} else if (resourceType === "form" && resourceName) {
  const { createForm } = require("./create-form.cjs");
  createForm(resourceName);
} else if (resourceType === "mutation" && resourceName) {
  const { createMutation } = require("./create-mutation.cjs");
  createMutation(resourceName);
} else if (resourceType === "query" && resourceName) {
  const { createQuery } = require("./create-query.cjs");
  createQuery(resourceName);
} else if (resourceType === "route" && resourceName) {
  const { createRoute } = require("./create-route.cjs");
  createRoute(resourceName);
} else if (resourceType === "store" && resourceName) {
  const { createStore } = require("./create-store.cjs");
  createStore(resourceName);
} else if (resourceType === "type" && resourceName) {
  const { createType } = require("./create-type.cjs");
  createType(resourceName);
} else if (resourceType === "util" && resourceName) {
  const { createUtil } = require("./create-util.cjs");
  createUtil(resourceName);
}
