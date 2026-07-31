import { apiClient } from './apiClient';

/**
 * Health API module to check backend connectivity and database health
 */
export const healthApi = {
  /**
   * Fetch full status of backend service and DB connection
   */
  async checkHealth() {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        status: 'unreachable',
        timestamp: new Date().toISOString(),
        database: {
          status: 'unknown',
          error: error.message || 'Backend service is unreachable'
        },
        system: {
          error: error.message
        }
      };
    }
  },

  /**
   * Quick liveness check
   */
  async checkLiveness() {
    try {
      const response = await apiClient.get('/health/liveness');
      return response.data;
    } catch (error) {
      return { success: false, status: 'dead' };
    }
  }
};

export default healthApi;
