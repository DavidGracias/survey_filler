import * as Utils from "../../constants/util/index";
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
  static validate(context: (Function | object)[], questions: MatchedQuestion[]): void {
    return;

    // TODO: fix this function

    // // find all functions being called in the questions
    // const functionsInQuestions = questions.reduce((funcs, question) => {
    //   const actionString = question.action.toString();
    //   // Match function calls: functionName(...) or functionName.call(...) or functionName.apply(...)
    //   const matches = actionString.match(/\b\w+(?=\s*[\(.])|(?<=\.)(call|apply)\b/g) || [];
    //   matches.forEach(match => funcs.add(match));
    //   return funcs;
    // }, new Set<string>());

    // // determine if these function names are present in the context
    // const availableFunctions = new Set<string>([
    //   // Functions from context
    //   ...context.map(f => f.name),
    //   // Browser APIs that are always available
    //   'querySelector', 'querySelectorAll', 'click',
    //   'setTimeout', 'setInterval', 'console'
    // ]);

    // // find which functions are missing
    // const missingFunctions = Array.from(functionsInQuestions)
    //   .filter(funcName => !availableFunctions.has(funcName));

    // // if not, throw an error
    // if (missingFunctions.length > 0) {
    //   throw new MissingContextFunctionError(missingFunctions);
    // }
  }
}
