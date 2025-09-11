import Authority from '@hecom/authority';
import Util from '@hecom/util';
import { ReactNode } from 'react';
import * as Specials from 'specials';

enum types {
  ui = 'ui',
  action = 'action',
  filter = 'filter',
}

enum UiTypes {
  /**
   * 页面
   */
  page = 'page',
  /**
   * 分组
   */
  section = 'section',
  /**
   * 单元
   */
  cell = 'cell',
  /**
   * 导航按钮
   */
  naviButton = 'naviButton',
  /**
   * 自定义
   */
  function = 'function',
}

interface Auth {
  app: string;
  metaName?: string;
  innerApp?: string;
  action: string;
}

interface BaseConfig {
  type: UiTypes;
  auth?: Auth[];
  name: string;
}

export interface ItemConfig extends BaseConfig {
  type: UiTypes.cell | UiTypes.naviButton;
  label?: string;
  icon?: string;
  color?: string;
  [key: string]: any;
}

export interface SectionConfig extends BaseConfig {
  type: UiTypes.section | UiTypes.function;
  cells?: ItemConfig[];
}

export interface PageConfig extends BaseConfig {
  type: UiTypes.page | UiTypes.function;
  label: string;
  icon: any;
  selected_icon: any;
  sections?: SectionConfig[];
  [key: string]: any;
}

export type Config = {
  init_name?: string;
  tabs?: PageConfig[];
};

export type State = ItemConfig | SectionConfig | PageConfig;

type HandleFunc<C = State> = (config?: C) => ReactNode | null | void | boolean;

const instance = Specials.getInstance<State, State, HandleFunc>();

const rootNode: { defaultConfig: Config } = {
  defaultConfig: {},
};

const ModuleName = '@hecom/home';

export default {
  name: ModuleName,
  get: _get,
  update: _update,
  setDefault: _setDefault,
  registerUi: {
    page: _registerUi<PageConfig>(UiTypes.page),
    section: _registerUi<SectionConfig>(UiTypes.section),
    cell: _registerUi<ItemConfig>(UiTypes.cell),
    naviButton: _registerUi<ItemConfig>(UiTypes.naviButton),
    function: _registerUi(UiTypes.function),
  },
  unregisterUi: {
    page: _unregisterUi(UiTypes.page),
    section: _unregisterUi(UiTypes.section),
    cell: _unregisterUi(UiTypes.cell),
    naviButton: _unregisterUi(UiTypes.naviButton),
    function: _unregisterUi(UiTypes.function),
  },
  registerAction: (name: string, func: HandleFunc) => _general([types.action, name], func),
  create: {
    metaCell: _createMetaCell,
    functionCell: _createFunctionCell,
    naviButton: _createNaviButton,
    rowSection: _createRowSection,
    functionSection: _createFunctionSection,
    sectionPage: _createSectionPage,
    functionPage: _createFunctionPage,
    tabHome: _createTabHome,
  },
  matchUi: (params: State) => _match([types.ui, params.type, params.name], params),
  matchAction: (name: string, params: State) => _match([types.action, name], params, false),
  type: {
    isPage: (config: BaseConfig) => config.type === UiTypes.page,
    isSection: (config: BaseConfig) => config.type === UiTypes.section,
    isCell: (config: BaseConfig) => config.type === UiTypes.cell,
    isNaviButton: (config: BaseConfig) => config.type === UiTypes.naviButton,
    isFunction: (config: BaseConfig) => config.type === UiTypes.function,
  },
};

function _update(func: (config: Config) => Config): void {
  const newConfig = func(rootNode.defaultConfig);
  _setDefault(newConfig);
}

function _get(): Config {
  return Util.Obj.deepJsonCopy(rootNode.defaultConfig) as Config;
}

function _setDefault(config: Config): void {
  rootNode.defaultConfig = config;
}

function _unregisterUi(showtype: UiTypes) {
  return function (name: string, funcId?: Specials.HandleId): boolean {
    return instance.unregister([types.ui, showtype, name], funcId);
  };
}

function _registerUi<C = State>(showtype: UiTypes) {
  return function (name: string, func: HandleFunc<C>, filter?: HandleFunc<C>): void {
    if (filter) {
      _general([types.filter, showtype, name], filter);
    }
    if (func) {
      _general([types.ui, showtype, name], func);
    }
  };
}

function _general<C>(types, func: HandleFunc<C>): Specials.HandleId | void {
  return instance.registerDefault(types, func);
}

function _match(keys: string[], params: State, needFilter = true): ReactNode | null {
  const [keyType, ...otherKey] = keys;
  const { auth = [] } = params;
  const hasAuth = auth.reduce((prv, cur) => {
    const { app, metaName, innerApp = 'std', action } = cur;
    let result;
    if (metaName) {
      result = Authority.obj.verify(metaName, innerApp, action);
    } else {
      result = Authority.app.verify(app, innerApp, action);
    }
    return prv && result;
  }, true);
  if (!hasAuth) {
    if (keyType === types.ui) {
      return null;
    } else if (keyType === types.action) {
      return null;
    }
  }
  if (needFilter) {
    const filterHandle = instance.get([types.filter, ...otherKey], params);
    if (filterHandle && !filterHandle(params)) {
      return null;
    }
  }
  return instance.get(keys, params, params);
}

function _createMetaCell<T = {}>(metaName: string, label: string, icon: string, color: string, other?: T): ItemConfig {
  return { type: UiTypes.cell, name: 'meta', metaName, label, icon, color, ...other };
}

function _createFunctionCell<T = {}>(name: string, label: string, icon: string, color: string, other?: T): ItemConfig {
  return { type: UiTypes.cell, name, label, icon, color, ...other };
}

function _createNaviButton<T = {}>(name: string, icon: string, color: string, other?: T): ItemConfig {
  return { type: UiTypes.naviButton, name, icon, color, ...other };
}

function _createRowSection<T = {}>(cells: ItemConfig[], other?: T): SectionConfig {
  return { type: UiTypes.section, name: '', cells, ...other };
}

function _createFunctionSection<T = {}>(name: string, other?: T): SectionConfig {
  return { type: UiTypes.function, name, ...other };
}

function _createSectionPage<T = {}>(
  name: string,
  label: string,
  icon: string,
  selected_icon: string,
  sections: SectionConfig[],
  other?: T
): PageConfig {
  return { type: UiTypes.page, name, label, icon, selected_icon, sections, ...other };
}

function _createFunctionPage<T = {}>(
  name: string,
  label: string,
  icon: string,
  selected_icon: string,
  other?: T
): PageConfig {
  return { type: UiTypes.function, name, label, icon, selected_icon, ...other };
}

function _createTabHome<T = {}>(init_name: string, tabs: PageConfig[], other?: T): Config {
  return { init_name, tabs, ...other };
}
