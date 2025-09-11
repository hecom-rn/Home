# Home

[![npm version](https://img.shields.io/npm/v/@hecom/home.svg?style=flat)](https://www.npmjs.com/package/@hecom/home)

这是主页配置管理模块，主要用于注册主页配置，各种UI以及点击事件。

**接口**：

* `name: string`：模块名称。
* `get: () => Config`：获取当前主页完整配置。
* `update: (func: (config: Config) => Config) => void`：通过函数更新主页配置。
* `setDefault: (config: Config) => void`：设置默认主页配置。
* `registerUi`：注册UI组件的处理方式，统一参数：`name`为组件名称，`func: (config) => ReactNode | null | void | boolean`为展示函数，`filter?: (config) => ReactNode | null | void | boolean`为可选的过滤函数，其中`config`为当前组件的运行时参数。
  * `page: (name, func, filter?) => void`：注册页面的展示方式。
  * `section: (name, func, filter?) => void`：注册分区的展示方式。
  * `cell: (name, func, filter?) => void`：注册单元格的展示方式。
  * `naviButton: (name, func, filter?) => void`：注册导航按钮的展示方式。
  * `function: (name, func, filter?) => void`：注册定制功能组件的展示方式。
* `registerAction: (name, func) => HandleId | void`：注册点击操作的处理方式，`name`为组件名称，`func: (config) => ReactNode | null | void | boolean`为处理函数，其中`config`为当前组件的运行时参数。
* `create`：创建组件配置项，
  * `functionCell: (name, label, icon, color, other?) => ItemConfig`：创建定制功能单元格配置项。
  * `naviButton: (name, icon, color, other?) => ItemConfig`：创建导航按钮配置项。
  * `rowSection: (cells, other?) => SectionConfig`：创建行形式分区配置项。
  * `functionSection: (name, other?) => SectionConfig`：创建定制功能分区配置项。
  * `sectionPage: (name, label, icon, selected_icon, sections, other?) => PageConfig`：创建分区形式的页面配置项。
  * `functionPage: (name, label, icon, selected_icon, other?) => PageConfig`：创建定制功能的页面配置项。
  * `tabHome: (init_name, tabs, other?) => Config`：创建标签页形式的主页配置项。
* `matchUi: (params) => ReactNode | null`：根据运行时的项目配置参数，在UI组件处理方式中寻找符合条件的处理项，并返回处理结果即组件视图。
* `matchAction: (name, params) => void`：根据运行时的项目配置参数，在点击操作处理方式中寻找符合条件的处理项，并执行操作动作。
* `type`：判断配置项类型的方法。
  * `isPage: (config) => boolean`：判断是否是页面配置。
  * `isSection: (config) => boolean`：判断是否是分区配置。
  * `isCell: (config) => boolean`：判断是否是单元格配置。
  * `isNaviButton: (config) => boolean`：判断是否是导航按钮配置。
  * `isFunction: (config) => boolean`：判断是否是定制功能配置。

**通用配置项信息**：

* `type: UiTypes`：配置项类型（page | section | cell | naviButton | function）。
* `name: string`：配置项标识。
* `auth?: Auth[]`：权限配置数组，只有满足所有权限才可以展示或执行。数组每一项是`{app: string, metaName?: string, innerApp?: string, action: string}`。判断`[app, innerApp, action]`或`[metaName, innerApp, action]`的权限。

**非通用配置项信息**：

每个类别下，都是包含通用部分的配置项信息。

* `ItemConfig`：单元格和导航按钮的配置。
  * `type: UiTypes.cell | UiTypes.naviButton`：类型。
  * `label?: string`：展示的文本标签。
  * `icon?: string`：文本左侧的图标。
  * `color?: string`：图标的颜色。
* `SectionConfig`：分区的配置。
  * `type: UiTypes.section | UiTypes.function`：类型。
  * `cells?: ItemConfig[]`（仅行形式分区）：包含的单元格数组。
* `PageConfig`：页面的配置。
  * `type: UiTypes.page | UiTypes.function`：类型。
  * `label: string`：标题。
  * `icon: any`：普通状态图标。
  * `selected_icon: any`：选中状态图标。
  * `sections?: SectionConfig[]`（仅分区形式页面）：分区列表。
* `Config`：主页配置。
  * `init_name?: string`：初始选中的标签页的名称。
  * `tabs?: PageConfig[]`：所有标签页的数组。
