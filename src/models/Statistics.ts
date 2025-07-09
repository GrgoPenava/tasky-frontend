export interface StatisticsSummary {
  tasksCreated: number;
  tasksAssigned: number;
  tasksCompleted: number;
  createdInPeriod: number;
  completionRate: number;
}

export interface StatusDistribution {
  todo: number;
  in_progress: number;
  done: number;
}

export interface MonthlyTrend {
  month: string;
  count: number;
}

export interface StatisticsCharts {
  statusDistribution: StatusDistribution;
  teamTaskDistribution: Record<string, number>;
  taskCompletionTrend: MonthlyTrend[];
  taskCreationTrend: MonthlyTrend[];
}

export interface StatisticsPeriod {
  start: string;
  end: string;
  label: "week" | "month" | "year";
}

export interface UserStatistics {
  summary: StatisticsSummary;
  charts: StatisticsCharts;
  period: StatisticsPeriod;
}
