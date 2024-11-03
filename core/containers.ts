import { createContainer } from 'awilix';
import { ILogger } from './types/logger';
import { TBaseConfig } from './types/config';
import { IErrorFactory } from './types/error';

type TContainer = {
  logger: ILogger;
  config: TBaseConfig;
  errorFactory: IErrorFactory;
};

export * as Awilix from 'awilix';

export const appContainer = createContainer<TContainer>();