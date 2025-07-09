import ApiService from "./ApiService";
import type { Team, CreateTeamData, UpdateTeamData } from "@/models/Team";

class TeamService {
  public async getAllTeams(): Promise<Team[]> {
    return ApiService.get<Team[]>("/teams");
  }

  public async getTeamById(id: string): Promise<Team> {
    return ApiService.get<Team>(`/teams/${id}`);
  }

  public async createTeam(teamData: CreateTeamData): Promise<Team> {
    return ApiService.post<Team, CreateTeamData>("/teams", teamData);
  }

  public async updateTeam(id: string, teamData: UpdateTeamData): Promise<Team> {
    return ApiService.patch<Team, UpdateTeamData>(`/teams/${id}`, teamData);
  }

  public async deleteTeam(id: string): Promise<void> {
    return ApiService.delete<void>(`/teams/${id}`);
  }
}

export default new TeamService();
