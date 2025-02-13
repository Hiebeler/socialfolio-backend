import { ObjectId } from "mongoose";
import Widget, { IWidget } from "../model/Widget.ts";
import { CreateWidgetDto, WidgetDto } from "../types/widget.types.ts";
import { UserService } from "./user.service.ts";
import { HttpError } from "../utils/HttpError.ts";
import { WidgetDataServiceFactory } from "./widgets/widgetdata.service.ts";
import { WidgetDataDto } from "../types/widgetdata.types.ts";

export class WidgetService {
  static async widgets(username: string): Promise<WidgetDto[]> {
    const user = await UserService.getByUsername(username);
    const widgets: IWidget[] = await Widget.find({
      user: user._id,
    });
    return widgets.map((widget) => WidgetDto.fromWidget(widget));
  }

  static async getWidget(id: string): Promise<WidgetDataDto> {
    const widget: IWidget | null = await Widget.findById(id);
    if (widget == null) {
      throw new HttpError(400, "Widget not found");
    }

    const service = WidgetDataServiceFactory.createService(widget.type);
    const data = await service.fetchData(widget.data);

    return WidgetDataDto.fromWidgetData(widget, data);
  }

  static async createWidget(
    userId: ObjectId,
    createWidgetDto: CreateWidgetDto,
  ): Promise<WidgetDto> {
    const newWidget: IWidget = await Widget.create({
      user: userId,
      type: createWidgetDto.type,
      variant: createWidgetDto.variant,
      size: createWidgetDto.size,
      data: createWidgetDto.data,
    });
    return WidgetDto.fromWidget(newWidget);
  }
}
