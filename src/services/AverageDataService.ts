
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
  private fetchPromise: Promise<StandardizedAverageData> | null = null;

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
    this.fetchPromise = null;
  }

  private processRawData(rawData: any): StandardizedAverageData {
    const processedData: StandardizedAverageData = {};
    for (const key in rawData) {
      if (Object.hasOwnProperty.call(rawData, key) && key !== 'id') {
        const value = Number(rawData[key]);
        processedData[key] = isNaN(value) ? 0 : value;
      }
    }
    return processedData;
  }

  getDefaultAverageData(): StandardizedAverageData {
    console.log('[AverageDataService] Generating default average data');
    return {
      "Cost_Medical & RX Paid Amount PEPY": 13440,
      "Risk_Average Risk Score": 0.95,
      "Util_Emergency Visits per 1k Members": 135,
      "Util_Specialist Visits per 1k Members": 2250
    };
  }

  async getAverageData(): Promise<StandardizedAverageData> {
    try {
      // Check cache first
      if (this.cachedData && this.isValidCache()) {
        console.log('[AverageDataService] Using cached data');
        this.isUsingFallback = false;
        return this.cachedData;
      }

      // If there's already a fetch in progress, wait for it
      if (this.fetchPromise) {
        console.log('[AverageDataService] Waiting for existing fetch');
        return await this.fetchPromise;
      }

      // Start new fetch
      this.fetchPromise = this.fetchFromDatabase();
      const result = await this.fetchPromise;
      this.fetchPromise = null;
      return result;

    } catch (fetchError) {
      console.error('[AverageDataService] Error fetching average data:', fetchError);
      this.fetchPromise = null;
      
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

  private async fetchFromDatabase(): Promise<StandardizedAverageData> {
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
  }
}

export const averageDataService = AverageDataService.getInstance();
