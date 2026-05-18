export type TournamentDetailTab =
  | "informations"
  | "participants"
  | "matchs"
  | "options";

export function useTournamentLayout() {
  const activeTab = useState<TournamentDetailTab>(
    "tournament-layout-tab",
    () => "informations",
  );
  const tournamentName = useState<string | null>(
    "tournament-layout-name",
    () => null,
  );

  function setTournamentContext(name: string) {
    tournamentName.value = name;
  }

  function clearTournamentContext() {
    tournamentName.value = null;
    activeTab.value = "informations";
  }

  return {
    activeTab,
    tournamentName,
    setTournamentContext,
    clearTournamentContext,
  };
}
