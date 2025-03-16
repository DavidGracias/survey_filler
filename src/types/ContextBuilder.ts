import * as InformationEnums from "../types/InformationEnums";
import * as Utils from "../constants/util";
import SurveyAnswers, { NamedEnum } from "./SurveyAnswers";


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

  private static createEnumDefinition([name, enumObj]: [string, object]) {
    const entries = Object.entries(enumObj)
      .filter(([key]) => isNaN(Number(key)))
      .map(([key, value]) => [`  ${key}: "${value}"`, `  "${value}": "${key}"`])
      .flat()
      .join(",\n");

    let minifiedName = enumObj.constructor.name;
    if (minifiedName === "Object") minifiedName = name;

    return `globalThis.${minifiedName} = createEnum({\n${entries}\n});`;
  }

  static globalEnums = Object.entries(InformationEnums).filter(
    ([_, value]) => typeof value === "object"
  );
  private static enumDefinitions = ContextBuilder.globalEnums.map(
    this.createEnumDefinition
  );

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

    const contextEnums = additionalContext.filter(
      (item): item is NamedEnum => Array.isArray(item) && item.length === 2 && typeof item[0] === 'string' && typeof item[1] === 'object'
    );
    const contextEnumsDefinitions = contextEnums
      .map(([name, obj]) => {
        return this.createEnumDefinition([
          name,
          obj,
        ]);
      });

    const sections: [string, string[]][] = [
      ["// Enum Helpers", [this.enumHelpers]],
      ["// Enum Definitions", this.enumDefinitions],
      ["// Utility Functions", this.utilDefinitions],
      ["// Context Variables", contextDefinitions],
      ["// Context Enums", contextEnumsDefinitions],
    ];

    return sections
      .map(([header, contents]) => `${header}\n${contents.join("\n")}`)
      .join("\n\n");
  }
}
