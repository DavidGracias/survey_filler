import * as Utils from "../../constants/util/index";

export default class DuplicateFunctionDefinitionError extends Error {
  private static readonly UTIL_MINIFIED_FUNS = Object.entries(Utils).map(
    ([_, func]) => func.name
  );

  static validate(funcs: Function[]): void {
    const duplicates = funcs
      .map((func) => func.name)
      .filter((name) => this.UTIL_MINIFIED_FUNS.includes(name));

    if (duplicates.length > 0) {
      throw new DuplicateFunctionDefinitionError(duplicates);
    }
  }

  constructor(duplicateFunctions: string[]) {
    super(DuplicateFunctionDefinitionError.formatMessage(duplicateFunctions));
    this.name = "DuplicateFunctionDefinitionError";
  }

  private static formatMessage(duplicateFunctions: string[]): string {
    return [
      "Duplicate utility functions detected:",
      duplicateFunctions.map((f) => `- ${f}`).join("\n"),
      "",
      "These functions are already available in surveyAnswers/util/index.ts.",
      "Please remove them from the additionalContext passed to the SurveyAnswers constructor.",
      "",
      "Tip: Use command+shift+F (or ctrl+shift+F) to find where these functions are defined in your code.",
    ].join("\n");
  }
}
