export default class ComponentExistsError extends Error {
  constructor(name: string) {
    super(`Component Type ${name} exists`);
  }
}
