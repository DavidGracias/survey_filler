import * as InformationEnums from "../types/InformationEnums";
import * as Utils from "../constants/util";
import SurveyAnswers, { NamedEnum } from "./SurveyAnswers";

export default class ContextBuilder {
  private static createEnumDefinition([name, enumObj]: [string, object]) {
    const entries = Object.entries(enumObj)
      .filter(([key]) => isNaN(Number(key))) // Only take the named keys
      .flatMap(([key, value]) => [
        `${key}: ${value}`, // EnumValue: Number
        `${value}: "${key}"`, // Number: "EnumValue"
      ]);

    let minifiedName = enumObj.constructor.name;
    if (minifiedName === "Object") minifiedName = name;
    return `globalThis.${minifiedName} = {${entries}};`;
  }

  static globalEnums = Object.entries(InformationEnums).filter(
    ([_, value]) => typeof value === "object"
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
      (item): item is NamedEnum =>
        Array.isArray(item) &&
        item.length === 2 &&
        typeof item[0] === "string" &&
        typeof item[1] === "object"
    );
    const contextEnumsDefinitions = contextEnums.map(([name, obj]) => {
      return this.createEnumDefinition([name, obj]);
    });

    const sections: [string, string[]][] = [
      ["// Utility Functions", this.utilDefinitions],
      ["// Context Variables", contextDefinitions],
      ["// Context Enums", contextEnumsDefinitions],
      ["// Helper Tools/Variables", [`const selector = ${JSON.stringify(surveyAnswers.questionSelector)};`]],
    ];

    return sections
      .map(([header, contents]) => `${header}\n${contents.join("\n")}`)
      .join("\n\n");
  }
}
