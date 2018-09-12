import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Message } from './message';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private basePath = '/panaltec/P1';
  items: AngularFireList<Message[]> = null; //  list of objects
  item: AngularFireObject<Message> = null; //   single object

  constructor(private db: AngularFireDatabase) { }

  getMessagesList(): any {
    this.items = this.db.list(this.basePath);
    return this.items;
  }

  getDateListQueried(child, equal): any {
    this.items = this.db.list(this.basePath, ref => ref.orderByChild(child).startAt(equal));
    return this.items;
  }

  getLastData(child): any {
    this.items = this.db.list(this.basePath, ref => ref.orderByChild(child).limitToLast(1));
    return this.items;
  }

  getDataList(path): AngularFireList<any[]> {
    this.items = this.db.list(path);
    return this.items;
  }
}


