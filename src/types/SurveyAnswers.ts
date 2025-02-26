import { Information } from "./Information";

type MatchText = string[];
type MatchAction = (
  information: Information,
  selector: string,
  i: number
) => void;
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
      return Array.from(document.querySelectorAll(selector!)) as HTMLElement[];
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
    const documentQuestions = this.getQuestions(document);
    const matchedQuestions: MatchedQuestion[] = [];
    documentQuestions.forEach((docQuestion, i) => {
      const question_i_match = this.getMatchedQuestion(
        docQuestion,
        i,
        matchedQuestions
      );
      if (question_i_match) matchedQuestions.push(question_i_match);
    });
    return matchedQuestions;
  }

  private getMatchedQuestion(
    documentQuestionI: HTMLElement,
    i: number,
    matchedQuestions: MatchedQuestion[]
  ): MatchedQuestion | null {
    const question_i_matches: MatchedQuestion[] = [];

    for (let question of this.questions) {
      let found = true;

      // Check if all text parts of the question are included in the document's outerHTML
      for (let text of question.text)
        found &&= documentQuestionI.outerHTML.includes(text);

      if (found) question_i_matches.push({ ...question, i: i });
    }

    // Filter out questions that have already been matched
    const uniqueMatches = question_i_matches.filter(
      (q) => !matchedQuestions.some((mq) => mq.text === q.text)
    );

    // return most relevant question (more matched text = higher relevance)
    return uniqueMatches.sort(
      (a, b) => b.text.join("").length - a.text.join("").length
    )[0];
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
