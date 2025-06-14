import Lyra from "@rbxts/lyra";
import { DataStoreService, Players } from "@rbxts/services";
import { Leaderstats } from "server/modules/leaderstats";
import { PlayerDataConfig } from "server/stores/player-data";

// TODO: Maybe create a module for saving points for DRY
const PointsStore = DataStoreService.GetOrderedDataStore("Points");
const PlayerDataStore = Lyra.createPlayerStore({
  name: "PlayerData",
  template: PlayerDataConfig.DataStructure,
  schema: PlayerDataConfig.Schema,
  changedCallbacks: PlayerDataConfig.ChangedCallbacks,
});

Players.PlayerAdded.Connect((player: Player) => {
  PlayerDataStore.loadAsync(player);

  const [success, result] = pcall(() => {
    return PointsStore.GetAsync(tostring(player.UserId))!;
  });

  Leaderstats.setup(player, success ? { Points: result } : undefined);
});

Players.PlayerRemoving.Connect((player: Player) => {
  PlayerDataStore.unloadAsync(player);

  const [success, err] = pcall(() => {
    PointsStore.SetAsync(tostring(player.UserId), Leaderstats.getValues(player).Points);
  });

  if (!success) {
    print(`An error occured: ${err}`);
  }
});

game.BindToClose(async () => {
  PlayerDataStore.closeAsync();

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 0.1;

  for (const player of Players.GetPlayers()) {
    await Promise.retryWithDelay(
      () =>
        new Promise((resolve, reject) => {
          const [success, err] = pcall(() =>
            PointsStore.SetAsync(tostring(player.UserId), Leaderstats.getValues(player).Points)
          );
          if (success) resolve(true);
          else reject(err);
        }),
      MAX_RETRIES,
      RETRY_DELAY
    );
  }
});
