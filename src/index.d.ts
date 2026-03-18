import { IRequestUser } from "../user-type";

declare global {
  namespace Express {
    export interface Request {
      user?: IRequestUser;
    }
  }
}
