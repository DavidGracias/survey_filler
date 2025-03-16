import ContextBuilder from "../ContextBuilder";
import { MatchedQuestion } from "../SurveyAnswers";

export default class MissingContextFunctionError extends Error {
  constructor(missingFunctions: string[]) {
    super(MissingContextFunctionError.formatMessage(missingFunctions));
    this.name = "MissingContextFunctionError";
  }

  private static formatMessage(missingFunctions: string[]): string {
    return [
      "Missing context functions detected for the following functions:",
      missingFunctions.map((f) => `- ${f}`).join("\n"),
    ].join("\n");
  }
  static validate(
    context: (Function | object)[],
    questions: MatchedQuestion[]
  ): void {
    // Map to store minified enum name -> array of enum values
    const enumUsages = new Map<string, Set<string>>();

    questions.forEach((question) => {
      const actionString = question.action.toString();
      // Find all "case EnumName.Value:" patterns
      const matches = actionString.matchAll(/case\s+(\w+)\.(\w+):/g);

      for (const match of matches) {
        const [_, minifiedEnumName, enumValue] = match;
        if (!enumUsages.has(minifiedEnumName)) {
          enumUsages.set(minifiedEnumName, new Set());
        }
        enumUsages.get(minifiedEnumName)!.add(enumValue);
      }
    });

    // find which enum has all these values from InformationEnums
    enumUsages.forEach((values, enumName) => {
      const enumObj = ContextBuilder.globalEnums.find((item) =>
        Array.from(values).every((value) =>
          Object.prototype.hasOwnProperty.call(item?.[1], value)
        )
      );

      // add the enum to the context
      if (enumObj) {
        context.push([enumName, enumObj?.[1]]);
      }
    });

    return;
  }
}
