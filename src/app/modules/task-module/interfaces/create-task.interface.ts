export interface CreateTaskInterface {
  name: string;
  description?: string;
  isImportant?: boolean;
  endTime?: string | null;
  endDate: string;
  tags: string[];
}
