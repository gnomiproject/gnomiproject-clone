import { supabase } from '@/integrations/supabase/client';

export interface StandardizedAverageData {
  [key: string]: number;
}

export class AverageDataService {
  private static instance: AverageDataService;
  private cachedData: StandardizedAverageData | null = null;
  private cacheExpiry: number | null = null;
  private isUsingFallback: boolean = false;
  private readonly cacheDuration = 60 * 60 * 1000; // 1 hour

  private constructor() {}

  public static getInstance(): AverageDataService {
    if (!AverageDataService.instance) {
      AverageDataService.instance = new AverageDataService();
    }
    return AverageDataService.instance;
  }

  isUsingFallbackData(): boolean {
    return this.isUsingFallback;
  }

  private setCachedData(data: StandardizedAverageData) {
    this.cachedData = data;
    this.cacheExpiry = Date.now() + this.cacheDuration;
  }

  private isValidCache(): boolean {
    return !!(this.cachedData && this.cacheExpiry && Date.now() < this.cacheExpiry);
  }

  clearCache() {
    console.log('[AverageDataService] Clearing average data cache');
    this.cachedData = null;
    this.cacheExpiry = null;
  }

  /**
   * Processes raw data from the database to standardize keys and values
   */
  private processRawData(rawData: any): StandardizedAverageData {
    const processedData: StandardizedAverageData = {};

    for (const key in rawData) {
      if (Object.hasOwnProperty.call(rawData, key) && key !== 'id') {
        // Convert values to numbers, default to 0 if conversion fails
        const value = Number(rawData[key]);
        processedData[key] = isNaN(value) ? 0 : value;
      }
    }

    return processedData;
  }

  /**
   * Provides default average data as a fallback
   */
  getDefaultAverageData(): StandardizedAverageData {
    console.log('[AverageDataService] Generating default average data');
    return {
      "Cost_Medical & RX Paid Amount PEPY": 13440,
      "Risk_Average Risk Score": 0.95,
      "Util_Emergency Visits per 1k Members": 135,
      "Util_Specialist Visits per 1k Members": 2250
    };
  }

  /**
   * Main method to get average data with improved error handling and fallback strategy
   */
  async getAverageData(): Promise<StandardizedAverageData> {
    try {
      // Check cache first
      if (this.cachedData && this.isValidCache()) {
        console.log('[AverageDataService] Using cached data');
        this.isUsingFallback = false;
        return this.cachedData;
      }

      // Clear any stale cache
      if (this.cachedData && !this.isValidCache()) {
        console.log('[AverageDataService] Clearing stale cache');
        this.clearCache();
      }

      console.log('[AverageDataService] Fetching fresh average data from database');
      
      // Try to fetch from database with timeout
      const fetchPromise = supabase
        .from('Core_Archetypes_Metrics')
        .select('*')
        .eq('id', 'All_Average')
        .single();

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database query timeout')), 10000);
      });

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      if (error) {
        console.warn('[AverageDataService] Database error, using fallback:', error.message);
        this.isUsingFallback = true;
        const fallbackData = this.getDefaultAverageData();
        this.setCachedData(fallbackData);
        return fallbackData;
      }

      if (!data) {
        console.warn('[AverageDataService] No average data found, using fallback');
        this.isUsingFallback = true;
        const fallbackData = this.getDefaultAverageData();
        this.setCachedData(fallbackData);
        return fallbackData;
      }

      console.log('[AverageDataService] Successfully fetched data from database');
      
      // Process and cache the data
      const processedData = this.processRawData(data);
      this.setCachedData(processedData);
      this.isUsingFallback = false;
      
      return processedData;

    } catch (fetchError) {
      console.error('[AverageDataService] Error fetching average data:', fetchError);
      
      // Try to use any existing cached data, even if expired
      if (this.cachedData) {
        console.log('[AverageDataService] Using expired cache due to fetch error');
        this.isUsingFallback = true;
        return this.cachedData;
      }

      // Final fallback to default data
      console.log('[AverageDataService] Using default fallback data');
      this.isUsingFallback = true;
      const fallbackData = this.getDefaultAverageData();
      this.setCachedData(fallbackData);
      return fallbackData;
    }
  }
}

export const averageDataService = AverageDataService.getInstance();
