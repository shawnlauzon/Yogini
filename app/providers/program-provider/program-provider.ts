import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

/*
  Generated class for the ProgramProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProgramProvider {

  // FIXME Cache is always missing, perhaps because provider is recreated
  // every time?
  index: any;
  programs: Map<string, Program> = new Map<string, Program>();

  constructor(private http: Http) {
    this.index = null;
  }

  loadIndex(): Promise<Index> {
    console.log('Loading index');

    if (this.index != null) {
      // already loaded index
      return Promise.resolve(this.index);
    }

    // don't have the index yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the index,
      // then on the response it'll map the JSON index to a parsed JS object.
      // Next we process the index and resolve the promise with the new index.
      this.http.get('programs/index.json')
        .map(res => res.json())
        .subscribe(index => {
          // we've got back the raw index, now generate the core schedule index
          // and save the index for later reference
          this.index = index;
          resolve(this.index);
        });
    });
  }

  loadProgram(id: string): Promise<Program> {
    console.log('Loading program ' + id);
    if (this.programs.has(id) === true) {
      return Promise.resolve(this.programs.get(id));
    }

    return new Promise(resolve => {
      this.http.get(`programs/${id}.json`)
        .map(res => res.json())
        .subscribe(program => {
          if (program.parent) {
            this.setPrototypes(program);
          }

          this.programs.set(id, program);
          resolve(program);
        });
    });
  }

  // Set the prototype for each of the objects. With this magic, all the
  // variables on the parent are accessible through the child
  setPrototypes(program: Program) {
    this.loadProgram(program.parent).then(prototype => {
      console.log(program.asanas.length);
      for (let i = 0; i < program.asanas.length; i++) {
        // Must do the sequence first because after the asana prototype is set,
        // there will always be a sequence (from the prototype!)
        if (program.asanas[i].sequence) {
          for (let j = 0; j < program.asanas[i].sequence.length; j++) {
            Object.setPrototypeOf(program.asanas[i].sequence[j], prototype.asanas[i].sequence[j]);
          }
        }
        Object.setPrototypeOf(program.asanas[i], this.findAsana(program.asanas[i].id, prototype));
      }
    });
  }

  findAsana(id: string, program: Program): Asana {
    for (let i = 0; i < program.asanas.length; i++) {
      if (program.asanas[i].id === id) {
        return program.asanas[i];
      }
    }
    console.error("Could not find asana with id " + id);
    return null;
  }
}

export interface Index {
  programs: Array<ProgramInfo>
}

export interface ProgramInfo {
  id: string;
  name: string;
  creator: string;
  image: string;
  imageSrc?: string;
}

export interface Program {
  id: string;
  name: string;
  parent?: string;
  creator: string;
  image: string;
  asanas: Array<Asana>;
}

export interface Asana {
  id: string;
  name: string;
  image: string;
  imageSrc?: string;
  order: number;
  sequence: Array<SequenceItem>;
  timeRemaining?: string;
}

export interface SequenceItem {
  audio: string;
  wait: number;
  name: string;
}
