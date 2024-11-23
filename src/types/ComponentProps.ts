// Define the props interface for all components
import { Information } from '../types/Information';
export default interface ComponentProps {
  url: string;
  body: string;
  tabId: number;
  information: Information;
}