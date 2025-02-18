import { WidgetType } from "../../model/Widget.ts";
import { WidgetData } from "../../types/widgetdata.types.ts";
import { MastodonService } from "./mastodon.service.ts";
import { PixelfedService } from "./pixelfed.service.ts";
import { NoteService } from "./note.service.ts";
import { GithubService } from "./github.service.ts";
import { LocalTimeService } from "./localTime.service.ts";

export interface WidgetDataService<TInput, TOutput extends WidgetData> {
  fetchData(input: TInput): Promise<TOutput>;
}

export class WidgetDataServiceFactory {
  static createService<TInput, TOutput extends WidgetData>(
    type: WidgetType,
  ): WidgetDataService<TInput, TOutput> {
    switch (type) {
      case WidgetType.Mastodon:
        return new MastodonService() as unknown as WidgetDataService<
          TInput,
          TOutput
        >;
      case WidgetType.Pixelfed:
        return new PixelfedService() as unknown as WidgetDataService<
          TInput,
          TOutput
        >;
      case WidgetType.Note:
        return new NoteService() as unknown as WidgetDataService<
          TInput,
          TOutput
        >;
      case WidgetType.Github:
        return new GithubService() as unknown as WidgetDataService<
          TInput,
          TOutput
        >;
      case WidgetType.LocalTime:
        return new LocalTimeService() as unknown as WidgetDataService<
          TInput,
          TOutput
        >;
      default:
        throw new Error(`Unsupported widget type: ${type}`);
    }
  }
}
