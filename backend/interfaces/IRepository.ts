export interface IRepository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(item: T): Promise<T>;
  update(id: ID, item: Partial<T>): Promise<T | null>;
  delete(id: ID): Promise<boolean>;
}
