export interface EditTaskInterface {
  name?: string;
  description?: string;
  isImportant?: boolean;
  endTime?: string | null;
  endDate?: string;
  tags?: string[];
}
