export class PaginationDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class ApiPaginatedResponse<T> {
  data: T[];
  meta: PaginationDto;
}