import { HttpService, MessagingService, Players } from "@rbxts/services";
import { t } from "@rbxts/t";
import { Leaderstats } from "server/modules/leaderstats";

const MessageSchema = t.strictInterface({
  targetId: t.number,
  value: t.number,
});

const TOPIC = "uag-setpoints";

MessagingService.SubscribeAsync(TOPIC, message => {
  const data = HttpService.JSONDecode(message.Data as string);

  if (!MessageSchema(data)) {
    warn(`Received message with topic "${TOPIC}" with an invalid object`);
    return;
  }

  const player = Players.GetPlayerByUserId(data.targetId);

  if (!player) return;
  Leaderstats.updateValues(player, { Points: data.value });
});
