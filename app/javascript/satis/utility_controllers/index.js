import { application } from "satis/controllers/application"

import DraggableController from "satis/utility_controllers/draggable_controller";
application.register("draggable", DraggableController);

import HelpController from "satis/utility_controllers/help_controller";
application.register("help", HelpController);

import ShowHideController from "satis/utility_controllers/show_hide_controller";
application.register("show-hide", ShowHideController);

import ToggleController from "satis/utility_controllers/toggle_controller";
application.register("toggle", ToggleController);

