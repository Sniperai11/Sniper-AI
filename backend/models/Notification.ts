export interface INotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  createdAt: string;
}

export class Notification implements INotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  createdAt: string;

  constructor(data: INotification) {
    this.id = data.id;
    this.title = data.title;
    this.message = data.message;
    this.type = data.type;
    this.read = data.read;
    this.createdAt = data.createdAt;
  }
}
