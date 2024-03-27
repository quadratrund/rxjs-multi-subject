# RxJS MultiSubject
This package contains a special RxJS observable, that allows to send differnt events to every subscriber. This is usefull for testing observable operators.
## Example Usage
```ts
import { MultiSubject } from 'rxjs-multi-subject';

const subject = new MultiSubject<number>();
subject.subscribe(value => console.log('first subscription: ' + value));
subject.subscribe(value => console.log('second subscription: ' + value));
subject.activeSubscribers[1].next(42);
// second subscription: 42
subject.activeSubscribers[0].next(38);
// first subscription: 38
subject.activeSubscribers[0].complete();
subject.activeSubscribers[0].next(4711);
// second subscription: 4711
```
## Properties of the MultiSubject
### subscribers
```ts
subscribers: readonly SubscriberInfo<T>[];
```
A list of all subscribers of the observable in subscription order. For every new subscriber a SubscriptionInfo is appended to this array. When the subscription ends, the SubscriberInfo stays in the array with `active = false`.
### activeSubscribers
```ts
activeSubscribers: readonly Subscriber<T>[];
```
A list of all active subscribers of the observable in subscription order. Every new subscriber is appended to this array and removed when the subscription ends.
### onSubscribe
```ts
onSubscribe: Observable<SubscriberInfo<T>>;
```
This observable emits a SubscriberInfo for every new subscriber of the MultiSubject.
### onUnsubscribe
```ts
onUnsubscribe: Observable<SubscriberInfo<T>>;
```
This observabele emits a SubscriberInfo for every ending subscription.