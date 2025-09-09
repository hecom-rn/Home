import Authority from '@hecom/authority';
import Util from '@hecom/util';
import * as Specials from 'specials';

enum types {
  ui = 'ui',
  action = 'action',
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

interface ItemConfig extends BaseConfig {
  type: UiTypes.cell | UiTypes.naviButton;
  label?: string;
  icon?: string;
  color?: string;
  [key: string]: any;
}

interface SectionConfig extends BaseConfig {
  type: UiTypes.section | UiTypes.function;
  cells: ItemConfig[];
}

interface PageConfig extends BaseConfig {
  type: UiTypes.page | UiTypes.function;
  label: string;
  icon: any;
  select_icon: any;
  sections: SectionConfig[];
  [key: string]: any;
}

type Config<T = any> = T & {
  init_name?: string;
  tabs?: PageConfig[];
};

type State = ItemConfig | SectionConfig | PageConfig;

type HandleFunc = (config?: State) => any;

type StateFunc = (config?: State) => boolean;

const instance = Specials.getInstance<State, State, HandleFunc>();

const rootNode: { defaultConfig: Config } = {
  defaultConfig: undefined,
};

const ModuleName = '@hecom/home';

export default {
  name: ModuleName,
  initGlobal: _initGlobal,
  get: _get,
  update: _update,
  setDefault: _setDefault,
  registerUi: {
    page: _registerUi(UiTypes.page),
    section: _registerUi(UiTypes.section),
    cell: _registerUi(UiTypes.cell),
    naviButton: _registerUi(UiTypes.naviButton),
    function: _registerUi(UiTypes.function),
  },
  unregisterUi: {
    page: _unregisterUi(UiTypes.page),
    section: _unregisterUi(UiTypes.section),
    cell: _unregisterUi(UiTypes.cell),
    naviButton: _unregisterUi(UiTypes.naviButton),
    function: _unregisterUi(UiTypes.function),
  },
  registerAction: (name, func) => _general([types.action, name], func),
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
  matchUi: (params) => _match([types.ui, params.type, params.name], params),
  matchAction: (name, params) => _match([types.action, name], params),
  type: {
    isPage: (config) => config.type === UiTypes.page,
    isSection: (config) => config.type === UiTypes.section,
    isCell: (config) => config.type === UiTypes.cell,
    isNaviButton: (config) => config.type === UiTypes.naviButton,
    isFunction: (config) => config.type === UiTypes.function,
  },
};

function _initGlobal() {}

function _update(func: (config: Config) => Config): void {
  const newConfig = func(rootNode.defaultConfig);
  _setDefault(newConfig);
}

function _get(): Config {
  return Util.Obj.deepJsonCopy(rootNode.defaultConfig);
}

function _setDefault(config: Config): void {
  rootNode.defaultConfig = config;
}

function _unregisterUi(showtype: UiTypes) {
  return function (name: string, funcId?: Specials.HandleId): boolean {
    return instance.unregister([types.ui, showtype, name], funcId);
  };
}

function _registerUi(showtype: UiTypes) {
  return function (name: string, func: HandleFunc, filter?: StateFunc): Specials.HandleId | void {
    return _general([types.ui, showtype, name], func, filter);
  };
}

function _general(types, finalFunc: HandleFunc, filter?: StateFunc): Specials.HandleId | void {
  if (filter) {
    return instance.registerSpecial(types, filter, finalFunc);
  }
  return instance.registerDefault(types, finalFunc);
}

function _match(keys: string[], params: State) {
  const keyType = keys[0];
  const { auth = [] } = params;
  const result = auth.reduce((prv, cur) => {
    const { app, metaName, innerApp = 'std', action } = cur;
    let result;
    if (metaName) {
      result = Authority.obj.verify(metaName, innerApp, action);
    } else {
      result = Authority.app.verify(app, innerApp, action);
    }
    return prv && result;
  }, true);
  if (!result) {
    if (keyType === types.ui) {
      return null;
    } else if (keyType === types.action) {
      return null;
    }
  }
  return instance.get(keys, params, params);
}

function _createMetaCell(metaName, label, icon, color, other): ItemConfig {
  return { type: UiTypes.cell, name: 'meta', metaName, label, icon, color, ...other };
}

function _createFunctionCell(name, label, icon, color, other): ItemConfig {
  return { type: UiTypes.cell, name, label, icon, color, ...other };
}

function _createNaviButton(name, icon, color, other): ItemConfig {
  return { type: UiTypes.naviButton, name, icon, color, ...other };
}

function _createRowSection(cells, other): ItemConfig {
  return { type: UiTypes.section, name: '', cells, ...other };
}

function _createFunctionSection(name, other): ItemConfig {
  return { type: UiTypes.function, name, ...other };
}

function _createSectionPage(name, label, icon, selected_icon, sections, other): ItemConfig {
  return { type: UiTypes.page, name, label, icon, selected_icon, sections, ...other };
}

function _createFunctionPage(name, label, icon, selected_icon, other): ItemConfig {
  return { type: UiTypes.function, name, label, icon, selected_icon, ...other };
}

function _createTabHome(init_name, tabs, other): Config {
  return { init_name, tabs, ...other };
}
