import { IApiResponse } from "../types/api";

export class Formatter {
  public static success<T = any>(data: T, message: string = "تمت العملية بنجاح"): IApiResponse<T> {
    return {
      success: true,
      message,
      data,
      errors: [],
      timestamp: new Date().toISOString()
    };
  }

  public static error(errors: string | string[], message: string = "حدث خطأ أثناء تنفيذ العملية"): IApiResponse<null> {
    const errList = Array.isArray(errors) ? errors : [errors];
    return {
      success: false,
      message,
      data: null,
      errors: errList,
      timestamp: new Date().toISOString()
    };
  }
}
