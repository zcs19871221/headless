import { FactoryBean, Resource } from 'better-inject';
import Logger from 'better-loger';
import ConsoleAppender from 'better-loger/console_appender';

@Resource({ type: 'single', id: 'logger' })
export default class LogerFactory extends FactoryBean {
  private logger: Logger;
  constructor(debug: boolean) {
    super();
    const logger = Logger.get();
    if (debug) {
      logger.setLevel('debug');
      logger.setAppender(new ConsoleAppender({ threshold: 'debug' }));
    }
    this.logger = logger;
  }

  getObject() {
    return this.logger;
  }
}
