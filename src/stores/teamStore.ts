import { defineStore } from "pinia";
import { ref } from "vue";
import type { Team } from "@/models/Team";
import TeamService from "@/services/TeamService";

export const useTeamStore = defineStore("team", () => {
  const activeTeam = ref<Team | null>(null);
  const teams = ref<Team[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchTeams() {
    isLoading.value = true;
    error.value = null;

    try {
      const teamsData = await TeamService.getAllTeams();
      teams.value = teamsData || [];

      if (teamsData && teamsData.length > 0) {
        const storedTeamId = localStorage.getItem("activeTeamId");

        if (storedTeamId) {
          const storedTeam = teamsData.find((team) => team.id === storedTeamId);
          if (storedTeam) {
            setActiveTeam(storedTeam);
            return;
          }
        }

        const personalTeam = teamsData.find((team) => team.isPersonal);
        setActiveTeam(personalTeam || teamsData[0]);
      } else {
        activeTeam.value = null;
      }
    } catch (err: any) {
      console.error("Error fetching teams:", err);
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  function setActiveTeam(team: Team) {
    activeTeam.value = team;
    localStorage.setItem("activeTeamId", team.id);
  }

  return {
    activeTeam,
    teams,
    isLoading,
    error,
    fetchTeams,
    setActiveTeam,
  };
});
