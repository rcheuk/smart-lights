import { Subject, Observable, Observer } from 'rxjs/Rx';
import {Injectable} from '@angular/core';

Injectable()
export class DataService {
  private socket: Subject<MessageEvent>;
  public connect(url): Subject<MessageEvent> {
    if(!this.socket) {
      this.socket = this.create(url);
    }
    return this.socket;
  }

  private create(url): Subject<MessageEvent> {
    let ws = new WebSocket(url);
    let observable = Observable.create(
        (obs: Observer<MessageEvent>) => {
            ws.onmessage = obs.next.bind(obs);
            ws.onerror = obs.error.bind(obs);
            ws.onclose = obs.complete.bind(obs);
            return ws.close.bind(ws);
        }
    );
    let observer = {
        next: (data: Object) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(data));
            }
        },
    };
    return Subject.create(observer, observable);
}
}