import * as InformationEnums from "../types/InformationEnums";
import * as Utils from "../constants/util";
import SurveyAnswers from "./SurveyAnswers";

export default class ContextBuilder {
  private static readonly enumHelpers = `
function createEnum(obj) {
  var f = function() {};
  for(var k in obj) {
    if(obj.hasOwnProperty(k)) {
      f[k] = obj[k];
    }
  }
  return f;
}`.trim();

  private static enumDefinitions = Object.entries(InformationEnums)
    .filter(([_, value]) => typeof value === "object")
    .map(([name, enumObj]) => {
      const entries = Object.entries(enumObj)
        .filter(([key]) => isNaN(Number(key)))
        .map(([key, value]) => [
          `  ${key}: "${value}"`,
          `  "${value}": "${key}"`,
        ])
        .flat()
        .join(",\n");

      let minifiedName = enumObj.constructor.name;
      if (minifiedName === "Object") minifiedName = name;

      return `globalThis.${minifiedName} = createEnum({\n${entries}\n});`;
    });

  private static utilDefinitions = Object.entries(Utils)
    .filter(([_, value]) => typeof value === "function")
    .map(([, func]) => `globalThis.${func.name} = ${func};`);

  static getInjectionContext(surveyAnswers: SurveyAnswers): string {
    const { additionalContext, ...mainContext } = surveyAnswers.getContext();

    const contextDefinitions = Object.entries({
      ...mainContext,
      ...Object.fromEntries(
        additionalContext
          .filter((item): item is Function => typeof item === "function")
          .map((item) => [item.name, item])
      ),
    }).map(
      ([key, value]) =>
        `globalThis.${key} = ${
          typeof value === "string" ? JSON.stringify(value) : value
        };`
    );

    const sections: [string, string[]][] = [
      ["// Enum Helpers", [this.enumHelpers]],
      ["// Enum Definitions", this.enumDefinitions],
      ["// Utility Functions", this.utilDefinitions],
      ["// Context Variables", contextDefinitions],
    ];

    return sections
      .map(([header, contents]) => `${header}\n${contents.join("\n")}`)
      .join("\n\n");
  }
}
