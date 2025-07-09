import ApiService from "./ApiService";

class AuthService {
  public async initializeUser(): Promise<void> {
    return ApiService.get<void>("/auth/initialize");
  }
}

export default new AuthService();
