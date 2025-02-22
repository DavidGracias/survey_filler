import { Information } from "./Information";

type MatchText = string[];
type MatchAction = (information: Information, i: number) => void;
type Match = { text: MatchText; action: MatchAction };
export type MatchedQuestion = Match & { i: number };

type SurveyAnswersContext = {
  nextButtonAction: (selector: string | null) => void;
  additionalContext: ((...args: any[]) => unknown)[];
  nextButtonSelector: string | null;
  questionSelectAction: (
    document: Document,
    selector: string | null
  ) => HTMLElement[];
};
type SurveyAnswersConstructor = {
  nextButtonAction: string | SurveyAnswersContext["nextButtonAction"];
  questionSelector: string;
  additionalContext: SurveyAnswersContext["additionalContext"];
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
      return Array.from(
        document.querySelectorAll(selector!)
      ) as HTMLElement[];
    };
    
    this.additionalContext = c.additionalContext;
  }

  addQuestion(questionText: MatchText, questionAction: MatchAction): void {
    const questionPromise = new Promise<void>((resolve, reject) => {
      if (
        this.questions.some(
          (question) =>
            question.text.sort().join() === questionText.sort().join()
        )
      ) {
        reject(new Error("Question already exists for: " + questionText));
      } else {
        this.questions.push({ text: questionText, action: questionAction });
        resolve();
      }
    });

    this.questionPromises.push(questionPromise);
  }

  private getQuestions(document: Document): HTMLElement[] {
    return this.questionSelectAction(document, this.questionSelector);
  }

  getQuestionsFromDocument(document: Document): MatchedQuestion[] {
    return this.getQuestions(document)
      .map((question, i) => this.matchedQuestion(question, i))
      .filter((question): question is MatchedQuestion => question !== null);
  }

  private matchedQuestion(
    questionFound: HTMLElement,
    i: number
  ): MatchedQuestion | null {
    for (let question of this.questions) {
      var found = true;
      for (let text of question.text) {
        found &&= questionFound.outerHTML.includes(text);
      }
      if (found) return { ...question, i: i };
    }
    return null;
  }

  printQuestions(): void {
    let alertMessage = "";
    for (let question of this.questions) {
      alertMessage += question.text.join("\n") + "\n\n---\n";
    }
    window.alert("Survey Questions:" + alertMessage);
  }

  async waitForAllQuestions(): Promise<void> {
    await Promise.all(this.questionPromises);
  }

  getContext(): {
    [K in keyof SurveyAnswersContext]: string;
  } {
    return {
      nextButtonAction: this.nextButtonAction.toString(),
      nextButtonSelector: this.nextButtonSelector ? this.nextButtonSelector : "",
      questionSelectAction: this.questionSelectAction.toString(),
      additionalContext: this.additionalContext.toString(),
    };
  }
}

export default SurveyAnswers;
