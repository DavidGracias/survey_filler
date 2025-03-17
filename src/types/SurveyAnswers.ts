import { Information } from "./Information";
import { DEBUG_MODE } from "../App";
import DuplicateFunctionDefinitionError from "./errors/DuplicateFunctionDefinitionError";
import MissingContextFunctionError from "./errors/MissingContextFunctionError";

type MatchText = string[];
type MatchAction = (
  information: Information,
  selector: string,
  i: number
) => void;
type Match = { text: MatchText; action: MatchAction; options: QuestionOptions };
export type MatchedQuestion = Match & { i: number };

export type QuestionOptions = {
  canDuplicate: boolean;
  hardcoded: boolean;
};

type SurveyAnswersContext = {
  nextButtonAction: (selector: string | null) => void;
  additionalContext: (Function | NamedEnum)[];
  nextButtonSelector: string | null;
  questionSelectAction: (
    document: Document,
    selector: string | null
  ) => HTMLElement[];
};
export type NamedEnum = [string, object];
type SurveyAnswersConstructor = {
  nextButtonAction: string | SurveyAnswersContext["nextButtonAction"];
  questionSelector: string;
  additionalContext: Function[];
};

class SurveyAnswers implements SurveyAnswersContext {
  private questions: Match[] = [];
  private questionPromises: Promise<void>[] = [];

  nextButtonSelector;
  nextButtonAction;
  questionSelector;
  questionSelectAction;
  additionalContext;

  constructor(c: SurveyAnswersConstructor) {
    if (typeof c.nextButtonAction === "function") {
      this.nextButtonSelector = null;
      this.nextButtonAction = c.nextButtonAction;
    } else {
      this.nextButtonSelector = c.nextButtonAction;
      this.nextButtonAction = (selector: string | null) => {
        (document.querySelector(selector!) as HTMLElement).click();
      };
    }

    this.questionSelector = c.questionSelector;
    this.questionSelectAction = (
      document: Document,
      selector: string | null
    ) => {
      return Array.from(document.querySelectorAll(selector!)) as HTMLElement[];
    };

    this.additionalContext = c.additionalContext;

    // Validate & Error check constructor:
    // DuplicateFunctionDefinitionError.validate(c.additionalContext);
  }

  addQuestion(
    questionText: MatchText,
    questionAction: MatchAction,
    overrideOptions: Partial<QuestionOptions> = {}
  ): void {
    // Apply defaults to the options
    const options: QuestionOptions = {
      canDuplicate: false,
      hardcoded: false,
      ...overrideOptions, // Override defaults with any provided values
    };
    const questionPromise = new Promise<void>((resolve, reject) => {
      const formattedQuestionText = questionText.map(this.formatString);
      if (
        this.questions.some(
          (question) =>
            question.text.sort().join() === formattedQuestionText.sort().join()
        )
      ) {
        reject(new Error("Question already exists for: " + questionText));
      } else {
        this.questions.push({
          text: formattedQuestionText,
          action: questionAction,
          options: options,
        });
        resolve();
      }
    });

    this.questionPromises.push(questionPromise);
  }

  private getQuestions(document: Document): HTMLElement[] {
    return this.questionSelectAction(document, this.questionSelector);
  }

  getQuestionsFromDocument(document: Document): [MatchedQuestion[], number[]] {
    const documentQuestions = this.getQuestions(document);
    const matchedQuestions: MatchedQuestion[] = [];
    const unmatchedQuestionIndices: number[] = [];
    documentQuestions.forEach((docQuestion, i) => {
      const question_i_match = this.getMatchedQuestion(
        docQuestion,
        i,
        matchedQuestions
      );
      if (question_i_match) matchedQuestions.push(question_i_match);
      else {
        unmatchedQuestionIndices.push(i);
        if (DEBUG_MODE)
          window.alert(
            "Question not matched: " + this.formatString(docQuestion.innerText)
          );
      }
    });

    return [matchedQuestions, unmatchedQuestionIndices];
  }

  private getMatchedQuestion(
    documentQuestionI: HTMLElement,
    i: number,
    matchedQuestions: MatchedQuestion[]
  ): MatchedQuestion | null {
    const question_i_matches: MatchedQuestion[] = [];

    const formattedDocumentQuestionI = this.formatString(
      documentQuestionI.innerText
    );

    function needlesFoundInHaystack(
      haystack: string,
      needles: string[]
    ): boolean {
      // Base case: if no more needles to find, we've found them all
      if (needles.length === 0) return true;

      function getAllIndexes(haystack: string, needle: string): number[] {
        const indexes: number[] = [];
        let index = haystack.indexOf(needle);

        while (index !== -1) {
          const isWordStart = !(index === 0 ? "" : haystack[index - 1]).match(/[a-z]/i);
          if (isWordStart) indexes.push(index);
          index = haystack.indexOf(needle, index + 1);
        }
        return indexes;
      }

      for (const index of getAllIndexes(haystack, needles[0])) {
        const remainingHaystack =
          haystack.substring(0, index) +
          haystack.substring(index + needles[0].length);
        if (needlesFoundInHaystack(remainingHaystack, needles.slice(1)))
          return true;
      }
      return false;
    }

    for (let question of this.questions)
      if (needlesFoundInHaystack(formattedDocumentQuestionI, question.text))
        question_i_matches.push({ ...question, i: i });

    // Filter out questions that have already been matched
    const uniqueMatches = question_i_matches.filter(
      (q) =>
        !matchedQuestions.some(
          (mq) => !mq.options.canDuplicate && mq.text === q.text
        )
    );

    // return most relevant question (shortest length matched text = higher relevance)
    return uniqueMatches.sort(
      (a, b) => a.text.join("").length - b.text.join("").length
    )[0];
  }

  private formatString(str: string): string {
    return str
      .replace(/\s{2,}/g, " ")
      .replace(/[^\w\s]/g, "")
      .toLowerCase()
      .trim()
      .split(" ")
      .filter((word) => word.length > 0)
      .join(" ");
  }

  printQuestions(): void {
    let alertMessage = "";
    for (let question of this.questions) {
      alertMessage += question.text.join("\n") + "\n\n---\n";
    }

    window.alert("Survey Questions:\n" + alertMessage);
  }

  async waitForAllQuestions(): Promise<void> {
    await Promise.all(this.questionPromises);
    MissingContextFunctionError.validate(
      this.additionalContext,
      this.questions.map((q) => ({ ...q, i: 0 }))
    );
  }

  getContext(): SurveyAnswersContext {
    return {
      nextButtonAction: this.nextButtonAction,
      nextButtonSelector: this.nextButtonSelector,
      questionSelectAction: this.questionSelectAction,
      additionalContext: this.additionalContext,
    };
  }
}

export default SurveyAnswers;
