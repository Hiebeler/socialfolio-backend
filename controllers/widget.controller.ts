import { RouterContext } from "@oak/oak/router";
import { WidgetService } from "../services/widget.service.ts";
import { GET_WIDGETS_ROUTE } from "../routes/widget.routes.ts";
import { HttpError } from "../utils/HttpError.ts";
import { Context } from "@oak/oak/context";

export class WidgetController {
  static async widgets(context: RouterContext<typeof GET_WIDGETS_ROUTE>) {
    const { username } = context.params;
    if (username == null) {
      context.response.status = 400;
      context.response.body = { message: "Username is required" };
      return;
    }
    try {
      const widgets = await WidgetService.widgets(context.params.username);
      context.response.status = 200;
      context.response.body = widgets;
    } catch (error) {
      HttpError.handleError(context, error);
    }
  }

  static async createWidget(context: Context) {
    const userId = context.state.user.id;

    try {
      const widget = await WidgetService.createWidget(userId);
      context.response.status = 201;
      context.response.body = widget;
    } catch (error) {
      HttpError.handleError(context, error);
    }
  }
}
