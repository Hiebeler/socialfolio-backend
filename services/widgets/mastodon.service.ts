import { IMastodon } from "../../model/Widget.ts";
import { MastodonData } from "../../types/widgetdata.types.ts";
import { WidgetDataService } from "./widgetdata.service.ts";

export class MastodonService
  implements WidgetDataService<IMastodon, MastodonData> {
  async fetchData(input: IMastodon): Promise<MastodonData> {
    const baseUrl = input.instance;
    const res = await fetch(
      `${baseUrl}/api/v1/accounts/lookup?acct=` + input.username,
    );
    const account = await res.json();

    return {
      username: account.username,
      displayName: account.display_name,
      description: account.note,
      avatar: account.avatar,
      followersCount: account.followers_count,
      url: account.url,
    };
  }
}
