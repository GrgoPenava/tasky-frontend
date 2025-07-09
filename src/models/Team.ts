/**
 * Model tima
 */
export interface Team {
  id: string;
  name: string;
  description: string | null;
  isPersonal: boolean;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

/**
 * Model za kreiranje tima
 */
export interface CreateTeamData {
  name: string;
  description?: string | null;
  isPersonal?: boolean;
}

/**
 * Model za ažuriranje tima
 */
export interface UpdateTeamData {
  name?: string;
  description?: string | null;
}
