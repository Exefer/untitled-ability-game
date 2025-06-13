interface LeaderstatValues {
  Punches: number;
}

export class Leaderstats {
  /**
   * Gets a player's leaderstats folder.
   * @param player The player to get leaderstats for.
   * @returns The leaderstats folder.
   */
  private static getLeaderstatsFolder(player: Player): Folder {
    return player.FindFirstChild("leaderstats") as Folder;
  }

  /**
   * Update leaderstat values using key-value pairs.
   * @param leaderstats The leaderstats folder.
   * @param values The key-value pairs to update.
   */
  private static updateLeaderstatValues(leaderstats: Folder, values: Partial<LeaderstatValues>): void {
    for (const [key, value] of pairs(values)) {
      const valueBase = leaderstats.FindFirstChild(key, true) as ValueBase;
      valueBase.Value = value;
    }
  }

  /**
   * Sets up the leaderstats folder for a player, initializing it with default or specified values.
   * @param player - The player for whom the leaderstats are being set up.
   * @param startValues - Optional initial values to set for the leaderstats.
   * The keys should match the names of the leaderstats instances and have proper types.
   */
  public static setup(player: Player, startValues?: Partial<LeaderstatValues>): void {
    const leaderstats = new Instance("Folder");
    leaderstats.Name = "leaderstats";
    leaderstats.Parent = player;

    const punches = new Instance("IntValue");
    punches.Name = "Punches";
    punches.Value = 0;
    punches.Parent = leaderstats;

    const isPrimary = new Instance("BoolValue");
    isPrimary.Name = "IsPrimary";
    isPrimary.Value = true;
    isPrimary.Parent = punches;

    if (!startValues) return;
    this.updateLeaderstatValues(leaderstats, startValues);
  }

  /**
   * Updates specific leaderstat values for a player.
   * @param player The player to update.
   * @param updates The values to update.
   */
  public static updateValues(player: Player, updates: Partial<LeaderstatValues>): void {
    const leaderstats = this.getLeaderstatsFolder(player);
    this.updateLeaderstatValues(leaderstats, updates);
  }

  /**
   * Gets all current leaderstat values for a player.
   * @param player The player to get values for.
   * @returns Object containing current values.
   */
  public static getValues(player: Player): LeaderstatValues {
    const leaderstats = this.getLeaderstatsFolder(player);
    const punches = leaderstats.FindFirstChild("Punches") as IntValue;
    return {
      Punches: punches.Value,
    };
  }
}
