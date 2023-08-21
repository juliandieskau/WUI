import { ECTS } from '@/ECTS/ECTS';
import { ECTSPlugin } from '@/ECTS/ECTSPlugin';

export default class TestPlugin extends ECTSPlugin {
  private iteration: number = 0;

  constructor(ects: ECTS) {
    super('TestPlugin', 'Test Plugin', ects, {
      componentNames: ['TestPlugin'],
      topics: new Map<string, string>([['test1/test', 'test/message']])
    });
  }
  update(topic: string, message: { test: string }) {
    message.test = message.test + ' (' + this.iteration++ + ')';
    super.update(topic, message);
  }
}
