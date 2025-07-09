import ApiService from "./ApiService";
import type { UserStatistics } from "@/models/Statistics";

class StatisticsService {
  public async getUserStatistics(
    period: "week" | "month" | "year" = "year"
  ): Promise<UserStatistics> {
    return ApiService.get<UserStatistics>(`/statistics/user?period=${period}`);
  }
}

export default new StatisticsService();
