# Home

[![npm version](https://img.shields.io/npm/v/@hecom/home.svg?style=flat)](https://www.npmjs.com/package/@hecom/home)

这是功能。

**接口**：

* `name: string`：模块名称。
* `initGlobal: () => void`：全局初始化模块。
* `get: () => object`：获取当前主页完整配置。
* `setDefault: (config) => void`：设置默认主页配置。
* `registerUi`：注册UI组件的处理方式，统一参数：`name`为组件名称，`func: (config) => React.Component`为展示函数，其中`config`为当前组件的运行时参数。
  * `page: (name, func) => string`：注册页面的展示方式。
  * `section: (name, func) => string`：注册分区的展示方式。
  * `cell: (name, func) => string`：注册单元格的展示方式。
  * `naviButton: (name, func) => string`：注册导航按钮的展示方式。
  * `function: (name, func) => string`：注册定制功能组件的展示方式。
* `registerAction: (name, func) => string`：注册点击操作的处理方式，`name`为组件名称，`func: (config) => void`为展示函数，其中`config`为当前组件的运行时参数。
* `create`：创建组件配置项，
  * `metaCell: (metaName, label, icon, color, other) => object`：创建元数据单元格配置项。
  * `functionCell: (name, label, icon, color, other) => object`：创建定制功能单元格配置项。
  * `naviButton: (name, icon, color, other) => object`：创建导航按钮配置项。
  * `rowSection: (cells, other) => object`：创建行形式分区配置项。
  * `functionSection: (name, other) => object`：创建定制功能分区配置项。
  * `sectionPage: (name, label, icon, selected_icon, sections, other) => object`：创建分区形式的页面配置项。
  * `functionPage: (name, label, icon, selected_icon, other) => object`：创建定制功能的页面配置项。
  * `tabHome: (init_name, tabs, other) => object`：创建标签页形式的主页配置项。
* `matchUi: (params) => React.Component`：根据运行时的项目配置参数，在UI组件处理方式中寻找符合条件的处理项，并返回处理结果即组件视图。
* `matchAction: (name, params) => void`：根据运行时的项目配置参数，在点击操作处理方式中寻找符合条件的处理项，并执行操作动作。
* `type`：判断配置项类型的方法。
  * `isPage: (config) => boolean`：判断是否是页面配置。
  * `isSection: (config) => boolean`：判断是否是分区配置。
  * `isCell: (config) => boolean`：判断是否是单元格配置。
  * `isNaviButton: (config) => boolean`：判断是否是导航按钮配置。
  * `isFunction: (config) => boolean`：判断是否是定制功能配置。

**通用配置项信息**：

* `type`：配置项类型。
* `name`：配置项标识。
* `auth`：权限配置数组，只有满足所有权限才可以展示或执行。数组每一项是`{app, metaName, innerApp, action}`。判断`[app, innerApp, action]`或`[metaName, innerApp, action]`的权限。

**非通用配置项信息**：

每个类别下，都是包含通用部分的配置项信息。

* `MetaCell`：元数据单元格。
  * `type`：`CellType`。
  * `name`：元数据模块的标识。
  * `metaName`：对应业务对象的名称。
  * `label`：展示的文本标签。
  * `icon`：文本左侧的图标。
  * `color`：图标的颜色。
* `FunctionCell`：定制功能单元格。
  * `type`：`CellType`。
  * `label`：展示的文本标签。
  * `icon`：文本左侧的图标。
  * `color`：图标的颜色。
* `NaviButton`：导航按钮。
  * `type`：`NaviButtonType`。
  * `icon`：按钮图标。
  * `color`：按钮图标的颜色。
* `RowSection`：行形式分区。
  * `type`：`SectionType`。
  * `name`：空字符串。
  * `cells`：包含的单元格数组。
  * `style`：整个视图的自定义样式。
* `FunctionSection`：定制功能分区。
  * `type`：`FunctionType`。
  * `style`：整个视图的自定义样式。
* `SectionPage`：分区形式页面。
  * `type`：`PageType`。
  * `label`：标题。
  * `icon`：普通状态图标。
  * `selected_icon`：选中状态图标。
  * `sections`：分区列表。
  * `position`：标题位置，`left`、`center`、`right`。
  * `canRefresh`：是否可以下拉刷新。
  * `absolute`：绝对布局配置。
    * `offset`：滚动深浅颜色渐变的偏移量。
    * `light_color`：浅颜色，滑动渐变用。
    * `dark_bgcolor`：深颜色时的背景色。
    * `dark_color`：深颜色，滑动渐变用。
  * `right`：右侧按钮列表。
  * `disableScroll`：禁止滚动。
* `FunctionPage`：定制功能页面。
  * `type`：`FunctionType`。
  * `label`：标题。
  * `icon`：普通状态图标。
  * `selected_icon`：选中状态图标。
* `TabHome`：标签页式的主页。
  * `type`：`TabHomeType`：
  * `init_name`：初始选中的标签页的名称。
  * `tabs`：所有标签页的数组。
  * `activeTintColor`：标签的选中高亮颜色。