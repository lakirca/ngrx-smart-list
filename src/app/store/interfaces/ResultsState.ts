import { AgentInfo } from './AgentInfo';
import { ResultsFilter } from './ResultsFilter';

export interface ResultsState {
  showContactInfo: boolean;
  agentInfo: AgentInfo;
  filters: ResultsFilter;
  unfiltered: Array<object>;
  filtered: Array<object>;
  role?: string;
  error: string;
  DisplayResults(): Array<object>;

}
