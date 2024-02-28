import { application } from "satis/controllers/application"

import AppearanceSwitcherComponentController from "satis/components/appearance_switcher/component_controller";
application.register("satis-appearance-switcher", AppearanceSwitcherComponentController);

import DateTimePickerComponentController from "satis/components/date_time_picker/component_controller";
application.register("satis-date-time-picker", DateTimePickerComponentController);

import DropdownComponentController from "satis/components/dropdown/component_controller";
application.register("satis-dropdown", DropdownComponentController);

import InputComponentController from "satis/components/input/component_controller";
application.register("satis-input", InputComponentController);

import InputArrayComponentController from "satis/components/input_array/component_controller";
application.register("satis-input-array", InputArrayComponentController);

import MapComponentController from "satis/components/map/component_controller";
application.register("satis-map", MapComponentController);

import MenuComponentController from "satis/components/menu/component_controller";
application.register("satis-menu", MenuComponentController);

import PageComponentController from "satis/components/page/component_controller";
application.register("satis-page", PageComponentController);

import SidebarMenuComponentController from "satis/components/sidebar_menu/component_controller";
application.register("satis-sidebar-menu", SidebarMenuComponentController);

import SidebarMenuItemComponentController from "satis/components/sidebar_menu_item/component_controller";
application.register("satis-sidebar-menu-item", SidebarMenuItemComponentController);

import SwitchComponentController from "satis/components/switch/component_controller";
application.register("satis-switch", SwitchComponentController);

import TabsComponentController from "satis/components/tabs/component_controller";
application.register("satis-tabs", TabsComponentController);

import LinkController from "satis/controllers/link_controller";
application.register("satis-link", LinkController);

import EditorController from "satis/controllers/editor_controller";
application.register("satis-editor", EditorController);

// See: https://github.com/hotwired/stimulus-rails/blob/main/app/assets/javascripts/stimulus-loading.js

// // Eager load all controllers defined in the import map under controllers/**/*_controller
// import { eagerLoadControllersFrom } from "@hotwired/stimulus-loading"
// eagerLoadControllersFrom("controllers", application)

// Lazy load controllers as they appear in the DOM (remember not to preload controllers in import map!)
// import { lazyLoadControllersFrom } from "@hotwired/stimulus-loading"
// lazyLoadControllersFrom("controllers", application)
