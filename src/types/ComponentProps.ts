// Define the props interface for all components
import { Information } from '../types/Information';
import SurveyAnswers from './SurveyAnswers';
export default interface ComponentProps {
  url: string;
  body: string;
  tabId: number;
  information: Information;
  surveyAnswer: SurveyAnswers;
}