import { Checker } from 'better-inject';
import Command from '../utils/command';

export default Checker([
  {
    id: 'command',
    beanClass: Command,
    constructParams: {
      0: [
        {
          page: {
            value: '&page',
            isBean: true,
          },
          logger: {
            value: 'logger',
            isBean: true,
          },
        },
      ],
    },
  },
]);
