import { ObjectId } from "mongoose";
import { model, Schema } from "mongoose";
import { urlParser } from "../utils/UrlParser.ts";
import {
  IFediverse,
  IFediverseWidget,
  IImage,
  ILink,
  IWidgetsData,
  WidgetType,
} from "../types/widget.types.ts";

export interface ISize {
  cols: number;
  rows: number;
}

export interface IWidget {
  _id: string;
  user: ObjectId;
  type: WidgetType;
  variant: number;
  size: ISize;
  priority: number;
  data: IWidgetsData;
}

export const widgetSchema = new Schema<IWidget>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },
  variant: { type: Number, required: true },
  size: { type: Object, required: true },
  priority: { type: Number, required: true, default: 1 },
  data: { type: Schema.Types.Mixed, required: true },
});

widgetSchema.pre("save", function (next) {
  console.log("Save");
  switch (this.type) {
    case WidgetType.Pixelfed:
    case WidgetType.Lemmy:
    case WidgetType.Mastodon:
    case WidgetType.Peertube:
    case WidgetType.NeoDb:
    case WidgetType.BookyWyrm:
      (this.data as IFediverse).instance = urlParser(
        (this.data as IFediverse).instance,
      );
      break;
    case WidgetType.Fediverse:
      (this.data as IFediverseWidget).link = urlParser(
        (this.data as IFediverseWidget).link,
      );
      break;
    case WidgetType.Link:
      (this.data as ILink).link = urlParser(
        (this.data as ILink).link,
      );
      break;
    case WidgetType.Image:
      if ((this.data as IImage).link) {
        (this.data as IImage).link = urlParser(
          (this.data as IImage).link!,
        );
      }
  }
  next();
});

export default model<IWidget>("Widget", widgetSchema);
