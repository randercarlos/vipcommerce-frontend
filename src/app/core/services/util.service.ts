import { AbstractControl, FormGroup, FormArray } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  public copyObj(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }

  public flattenObj(obj, prefix = null, current = null) {
    prefix = prefix || []
    current = current || {}

    // Remember kids, null is also an object!
    if (typeof (obj) === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        this.flattenObj(obj[key], prefix.concat(key), current)
      })
    } else {
      current[prefix.join('.')] = obj
    }

    return current
  }

}
