import { TaskTagValueEnum } from '../enums';

export interface EditTaskInterface {
  name?: string;
  description?: string;
  isImportant?: boolean;
  endTime?: string | null;
  endDate?: string;
  tags?: TaskTagValueEnum[];
}
