import { ISize, IWidget } from "../model/Widget.ts";
import { HttpError } from "../utils/HttpError.ts";


export interface IFediverse {
  instance: string;
  username: string;
}

export interface INote {
  note: string;
}

export interface IUsername {
  username: string;
}

export interface IFediverseWidget {
  link: string;
  fediverseHandle: string;
}

export interface ILocalTime {
  timezone: string;
}

export interface ILink {
  link: string;
}

export interface IEmail {
  email: string;
}

export type IWidgetsData = IFediverse | INote | IUsername | ILocalTime | IFediverseWidget | IEmail | ILink;

export enum WidgetType {
  Pixelfed = "pixelfed",
  Mastodon = "mastodon",
  Fediverse = "fediverse",
  Matrix = "matrix",
  Note = "note",
  Github = "github",
  Codeberg = "codeberg",
  LocalTime = "localTime",
  Lemmy = "lemmy",
  Liberapay = "liberapay",
  Email = "email",
  Link = "link"
}

export class WidgetDto {
  constructor(
    public id: string,
    public type: string,
    public variant: number,
    public size: ISize,
    public priority: number,
    public data?: IWidgetsData,
  ) { }

  static fromWidget(widget: IWidget): WidgetDto {
    return new WidgetDto(
      widget._id,
      widget.type,
      widget.variant,
      widget.size,
      widget.priority,
      widget.data,
    );
  }
}

export class UpdateWidgetDto {
  constructor(
    public variant?: number,
    public size?: ISize,
    public data?: IWidgetsData,
  ) { }

  // deno-lint-ignore no-explicit-any
  static fromJson(json: any): UpdateWidgetDto {
    if (!json || typeof json !== "object") {
      throw new Error("Invalid JSON payload");
    }
    return new UpdateWidgetDto(
      json.variant,
      json.size,
      json.data,
    );
  }
}

export class CreateWidgetDto {
  constructor(
    public type: WidgetType,
    public variant: number,
    public size: ISize,
    public data: IWidgetsData,
  ) {
    if (!this.isValidData(type, data)) {
      throw new HttpError(400, "Invalid data for widget type: " + type);
    }
  }

  // deno-lint-ignore no-explicit-any
  static fromJson(json: any): CreateWidgetDto {
    if (!json || typeof json !== "object") {
      throw new Error("Invalid JSON payload");
    }
    return new CreateWidgetDto(
      json.type,
      json.variant,
      json.size,
      json.data,
    );
  }

  // deno-lint-ignore no-explicit-any
  isValidData(type: WidgetType, data: any): boolean {
    switch (type) {
      case WidgetType.Pixelfed:
      case WidgetType.Mastodon:
      case WidgetType.Lemmy:
      case WidgetType.Matrix:
        console.log(data)
        return this.isFediverseData(data);
      case WidgetType.Note:
        return this.isNoteData(data);
      case WidgetType.Liberapay:
      case WidgetType.Github:
      case WidgetType.Codeberg:
        return this.isUsernameData(data);
      case WidgetType.LocalTime:
        return this.isLocalTimeData(data);
      case WidgetType.Fediverse:
        return this.isFediverseWidgetData(data);
      case WidgetType.Email:
        return this.isEmailData(data);
      case WidgetType.Link:
        return this.isLinkData(data);
      default:
        return false;
    }
  }

  isFediverseData(data: IFediverse) {
    return typeof data === "object" && data !== null &&
      typeof data.instance === "string" &&
      typeof data.username === "string";
  }

  isNoteData(data: INote) {
    return typeof data === "object" && data !== null &&
      typeof data.note === "string";
  }

  isUsernameData(data: IUsername) {
    return typeof data === "object" && data !== null &&
      typeof data.username === "string";
  }

  isFediverseWidgetData(data: IFediverseWidget) {
    return typeof data === "object" && data !== null &&
      typeof data.link === "string" &&
      typeof data.fediverseHandle == "string"
  }

  isLocalTimeData(data: ILocalTime) {
    return typeof data === "object" && data !== null &&
      typeof data.timezone === "string" &&
      Intl.supportedValuesOf("timeZone").includes(data.timezone);
  }

  isEmailData(data: IEmail) {
    return typeof data === "object" && data !== null &&
      typeof data.email === "string";
  }

  isLinkData(data: ILink) {
    return typeof data === "object" && data !== null &&
      typeof data.link === "string";
  }
}
