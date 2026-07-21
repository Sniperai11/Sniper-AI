import { ISubscription, ISubscriptionLimits } from "../types/user";

export class Subscription implements ISubscription {
  plan: string;
  status: string;
  currentPeriodEnd: string;
  limits: ISubscriptionLimits;
  cost: number;

  constructor(data: ISubscription) {
    this.plan = data.plan;
    this.status = data.status;
    this.currentPeriodEnd = data.currentPeriodEnd;
    this.limits = data.limits;
    this.cost = data.cost;
  }
}
