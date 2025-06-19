// Tracking service for user flow analytics
export interface TrackingEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

export interface UserSession {
  sessionId: string;
  startTime: Date;
  userId?: string;
}

class TrackingService {
  private sessionId: string;
  private sessionStartTime: Date;
  private isEnabled: boolean;
  private gaTrackingId: string = 'G-XSX7PSJKEQ';

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.sessionStartTime = new Date();
    this.isEnabled = true;
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('tracking_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('tracking_session_id', sessionId);
    }
    return sessionId;
  }

  private addSessionContext(properties: Record<string, any> = {}): Record<string, any> {
    return {
      ...properties,
      sessionId: this.sessionId,
      sessionStartTime: this.sessionStartTime.toISOString(),
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };
  }

  // Core tracking method
  private track(event: string, properties: Record<string, any> = {}) {
    if (!this.isEnabled) return;

    const trackingData = {
      event,
      properties: this.addSessionContext(properties)
    };

    console.log('[Tracking]', trackingData);

    // Send to Google Analytics if available
    this.sendToGA(event, properties);

    // Send to custom analytics endpoint if needed
    this.sendToCustomAnalytics(trackingData);
  }

  private sendToGA(event: string, properties: Record<string, any>) {
    if (typeof window.gtag === 'function') {
      // Send custom event to GA4
      window.gtag('event', event, {
        event_category: 'user_flow',
        session_id: this.sessionId,
        archetype_id: properties.archetypeId || '',
        question_number: properties.questionNumber || '',
        cta_label: properties.ctaLabel || '',
        page: properties.page || '',
        custom_parameter_1: properties.sessionId,
        custom_parameter_2: properties.archetypeId || '',
        custom_parameter_3: properties.questionNumber || '',
        value: properties.value || 1
      });
    } else {
      console.warn('[Tracking] Google Analytics gtag function not available');
    }
  }

  private sendToCustomAnalytics(data: TrackingEvent) {
    // Store in localStorage for potential batch sending
    try {
      const storedEvents = JSON.parse(localStorage.getItem('tracking_events') || '[]');
      storedEvents.push(data);
      // Keep only last 100 events to avoid storage issues
      if (storedEvents.length > 100) {
        storedEvents.splice(0, storedEvents.length - 100);
      }
      localStorage.setItem('tracking_events', JSON.stringify(storedEvents));
    } catch (error) {
      console.warn('[Tracking] Failed to store event:', error);
    }
  }

  // Public tracking methods for each user flow event
  
  pageView(pageName: string, additionalProps: Record<string, any> = {}) {
    this.track('page_view', {
      page: pageName,
      ...additionalProps
    });
  }

  ctaClicked(ctaLabel: string, location: string, destination: string) {
    this.track('cta_clicked', {
      ctaLabel,
      location,
      destination
    });
  }

  assessmentStarted() {
    this.track('assessment_started', {
      startTime: new Date().toISOString()
    });
  }

  questionAnswered(questionNumber: number, questionId: string, answer: string, totalQuestions: number) {
    this.track('question_answered', {
      questionNumber,
      questionId,
      answer,
      totalQuestions,
      progress: Math.round((questionNumber / totalQuestions) * 100)
    });
  }

  assessmentCompleted(archetypeResult: string, totalTime: number, exactEmployeeCount?: number) {
    this.track('assessment_completed', {
      archetypeResult,
      totalTime,
      exactEmployeeCount,
      completionTime: new Date().toISOString()
    });
  }

  unlockFormViewed(archetypeId: string) {
    this.track('unlock_form_viewed', {
      archetypeId
    });
  }

  unlockFormSubmitted(archetypeId: string, formData: { name: string; organization: string; email: string }) {
    this.track('unlock_form_submitted', {
      archetypeId,
      hasName: !!formData.name,
      hasOrganization: !!formData.organization,
      hasEmail: !!formData.email
    });
  }

  unlockFormSuccess(archetypeId: string) {
    this.track('unlock_form_success', {
      archetypeId
    });
  }

  // Utility methods
  getSessionInfo(): UserSession {
    return {
      sessionId: this.sessionId,
      startTime: this.sessionStartTime
    };
  }

  disable() {
    this.isEnabled = false;
  }

  enable() {
    this.isEnabled = true;
  }
}

// Create singleton instance
export const trackingService = new TrackingService();

// Export convenience functions for easier imports
export const {
  pageView,
  ctaClicked,
  assessmentStarted,
  questionAnswered,
  assessmentCompleted,
  unlockFormViewed,
  unlockFormSubmitted,
  unlockFormSuccess
} = trackingService;
