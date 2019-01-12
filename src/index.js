import { Alert } from 'react-native';
import * as Specials from 'specials';
import Foundation from '@hecom/foundation';
import Meta from '@hecom/meta';
import Authority from '@hecom/authority';

const types = {
    ui: 'ui',
    action: 'action',
};

const rootNode = {
    defaultConfig: undefined,
};

const ModuleName = '@hecom/home';
const TabHomeType = 'tab';
const PageType = 'page';
const SectionType = 'section';
const CellType = 'cell';
const NaviButtonType = 'naviButton';
const FunctionType = 'function';

export default {
    name: ModuleName,
    initGlobal: _initGlobal,
    get: _get,
    setDefault: _setDefault,
    registerUi: {
        page: _registerUi(PageType),
        section: _registerUi(SectionType),
        cell: _registerUi(CellType),
        naviButton: _registerUi(NaviButtonType),
        function: _registerUi(FunctionType),
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
        isPage: (config) => config.type === PageType,
        isSection: (config) => config.type === SectionType,
        isCell: (config) => config.type === CellType,
        isNaviButton: (config) => config.type === NaviButtonType,
        isFunction: (config) => config.type === FunctionType,
    },
};

function _initGlobal() {
    // TODO 添加人员自定义主页时用到
}

function _get() {
    return Foundation.ObjectUtil.deepJsonCopy(rootNode.defaultConfig);
}

function _setDefault(config) {
    rootNode.defaultConfig = config;
}

function _registerUi(showtype) {
    return function (name, func) {
        return _general([types.ui, showtype, name], func);
    };
}

function _general(types, finalFunc) {
    return Specials.register(rootNode, types, undefined, finalFunc);
}

function _match(keys, params) {
    const keyType = keys[0];
    const {auth = []} = params;
    const result = auth.reduce((prv, cur) => {
        const {app, metaName, innerApp, action} = cur;
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
            Alert.alert('', '你没有权限操作');
            return;
        }
    }
    return Specials.get(rootNode, keys, params, params);
}

function _createMetaCell(metaName, label, icon, color, other) {
    return {type: CellType, name: Meta.name, metaName, label, icon, color, ...other};
}

function _createFunctionCell(name, label, icon, color, other) {
    return {type: CellType, name, label, icon, color, ...other};
}

function _createNaviButton(name, icon, color, other) {
    return {type: NaviButtonType, name, icon, color, ...other};
}

function _createRowSection(cells, other) {
    return {type: SectionType, name: '', cells, ...other};
}

function _createFunctionSection(name, other) {
    return {type: FunctionType, name, ...other};
}

function _createSectionPage(name, label, icon, selected_icon, sections, other) {
    return {type: PageType, name, label, icon, selected_icon, sections, ...other};
}

function _createFunctionPage(name, label, icon, selected_icon, other) {
    return {type: FunctionType, name, label, icon, selected_icon, ...other};
}

function _createTabHome(init_name, tabs, other) {
    return {type: TabHomeType, init_name, tabs, ...other};
}