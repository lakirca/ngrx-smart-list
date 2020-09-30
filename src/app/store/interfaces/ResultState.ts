import { AgentInfo } from './AgentInfo';
import { ResultFilter } from './ResultFilter';

export interface ResultState {
  showContactInfo: boolean;
  agentInfo: AgentInfo;
  filters: ResultFilter;
  unfiltered: Array<object>;
  filtered: Array<object>;
  role?: string;
  error: string;
  DisplayResults(): Array<object>;
}
