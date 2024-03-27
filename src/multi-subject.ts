import { Observable, Subject, Subscriber, TeardownLogic } from 'rxjs';

export interface SubscriberInfo<T> {
  /** A subscriber of the MultiSubject */
  readonly subscriber: Subscriber<T>;
  /** This property changes from true to false when the subscription ends. */
  readonly active: boolean;
}

/**
 * This is a special RxJS observable, that allows to send differnt events to every subscriber.
 */
export class MultiSubject<T> extends Observable<T> {
  /**
   * A list of all subscribers of the observable in subscription order.
   * For every new subscriber a SubscriptionInfo is appended to this array.
   * When the subscription ends, the SubscriberInfo stays in the array with `active = false`.
   */
  public readonly subscribers: readonly SubscriberInfo<T>[];
  /**
   * A list of all active subscribers of the observable in subscription order.
   * Every new subscriber is appended to this array and removed when the subscription ends.
   */
  public readonly activeSubscribers: readonly Subscriber<T>[];
  /**
   * This observable emits a SubscriberInfo for every new subscriber of the MultiSubject.
   */
  public readonly onSubscribe: Observable<SubscriberInfo<T>>;
  /**
   * This observabele emits a SubscriberInfo for every ending subscription.
   */
  public readonly onUnsubscribe: Observable<SubscriberInfo<T>>;

  constructor() {
    const subscribers: SubscriberInfo<T>[] = [];
    const activeSubscribers: Subscriber<T>[] = [];
    const onSubscribe: Subject<SubscriberInfo<T>> = new Subject();
    const onUnsubscribe: Subject<SubscriberInfo<T>> = new Subject();

    super((subscriber: Subscriber<T>): TeardownLogic => {
      const info = {
        subscriber,
        active: true
      };
      subscribers.push(info);
      activeSubscribers.push(subscriber);
      onSubscribe.next(info);
      return () => {
        info.active = false;
        const index = activeSubscribers.indexOf(subscriber);
        activeSubscribers.splice(index, 1);
        onUnsubscribe.next(info);
      };
    });

    this.subscribers = subscribers;
    this.activeSubscribers = activeSubscribers;
    this.onSubscribe = onSubscribe.asObservable();
    this.onUnsubscribe = onUnsubscribe.asObservable();
  }
}
