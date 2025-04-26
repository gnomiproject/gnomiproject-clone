export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Analysis_Archetype_Deep_Dive_Reports: {
        Row: {
          archetype_id: string | null
          benefits_structure: string | null
          care_gaps: string | null
          cost_analysis: string | null
          demographic_insights: string | null
          disease_prevalence: string | null
          id: string
          last_updated: string | null
          recommendations: string | null
          utilization_patterns: string | null
        }
        Insert: {
          archetype_id?: string | null
          benefits_structure?: string | null
          care_gaps?: string | null
          cost_analysis?: string | null
          demographic_insights?: string | null
          disease_prevalence?: string | null
          id?: string
          last_updated?: string | null
          recommendations?: string | null
          utilization_patterns?: string | null
        }
        Update: {
          archetype_id?: string | null
          benefits_structure?: string | null
          care_gaps?: string | null
          cost_analysis?: string | null
          demographic_insights?: string | null
          disease_prevalence?: string | null
          id?: string
          last_updated?: string | null
          recommendations?: string | null
          utilization_patterns?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Analysis_Archetype_Deep_Dive_Reports_archetype_id_fkey"
            columns: ["archetype_id"]
            isOneToOne: false
            referencedRelation: "Core_Archetype_Overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Analysis_Archetype_Deep_Dive_Reports_archetype_id_fkey"
            columns: ["archetype_id"]
            isOneToOne: false
            referencedRelation: "level3_report_data"
            referencedColumns: ["archetype_id"]
          },
        ]
      }
      Analysis_Archetype_Distinctive_Metrics: {
        Row: {
          archetype_average: number | null
          archetype_id: string | null
          archetype_value: number | null
          category: string | null
          difference: number | null
          id: string
          last_updated: string | null
          metric: string | null
          significance: string | null
        }
        Insert: {
          archetype_average?: number | null
          archetype_id?: string | null
          archetype_value?: number | null
          category?: string | null
          difference?: number | null
          id?: string
          last_updated?: string | null
          metric?: string | null
          significance?: string | null
        }
        Update: {
          archetype_average?: number | null
          archetype_id?: string | null
          archetype_value?: number | null
          category?: string | null
          difference?: number | null
          id?: string
          last_updated?: string | null
          metric?: string | null
          significance?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Analysis_Archetype_Distinctive_Metrics_archetype_id_fkey"
            columns: ["archetype_id"]
            isOneToOne: false
            referencedRelation: "Core_Archetype_Overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Analysis_Archetype_Distinctive_Metrics_archetype_id_fkey"
            columns: ["archetype_id"]
            isOneToOne: false
            referencedRelation: "level3_report_data"
            referencedColumns: ["archetype_id"]
          },
        ]
      }
      Analysis_Archetype_Full_Reports: {
        Row: {
          archetype_id: string
          archetype_overview: Json | null
          detailed_metrics: Json | null
          distinctive_metrics: Json | null
          executive_summary: string | null
          id: string
          key_findings: Json | null
          last_updated: string | null
          strategic_recommendations: Json | null
          swot_analysis: Json | null
        }
        Insert: {
          archetype_id: string
          archetype_overview?: Json | null
          detailed_metrics?: Json | null
          distinctive_metrics?: Json | null
          executive_summary?: string | null
          id?: string
          key_findings?: Json | null
          last_updated?: string | null
          strategic_recommendations?: Json | null
          swot_analysis?: Json | null
        }
        Update: {
          archetype_id?: string
          archetype_overview?: Json | null
          detailed_metrics?: Json | null
          distinctive_metrics?: Json | null
          executive_summary?: string | null
          id?: string
          key_findings?: Json | null
          last_updated?: string | null
          strategic_recommendations?: Json | null
          swot_analysis?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "Analysis_Archetype_Full_Reports_Archetype_id_fkey"
            columns: ["archetype_id"]
            isOneToOne: true
            referencedRelation: "Core_Archetype_Overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Analysis_Archetype_Full_Reports_Archetype_id_fkey"
            columns: ["archetype_id"]
            isOneToOne: true
            referencedRelation: "level3_report_data"
            referencedColumns: ["archetype_id"]
          },
        ]
      }
      Analysis_Archetype_Strategic_Recommendations: {
        Row: {
          archetype_id: string | null
          description: string | null
          id: string
          last_updated: string | null
          metrics_references: Json | null
          recommendation_number: number | null
          title: string | null
        }
        Insert: {
          archetype_id?: string | null
          description?: string | null
          id?: string
          last_updated?: string | null
          metrics_references?: Json | null
          recommendation_number?: number | null
          title?: string | null
        }
        Update: {
          archetype_id?: string | null
          description?: string | null
          id?: string
          last_updated?: string | null
          metrics_references?: Json | null
          recommendation_number?: number | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Analysis_Archetype_Strategic_Recommendations_archetype_id_fkey"
            columns: ["archetype_id"]
            isOneToOne: false
            referencedRelation: "Core_Archetype_Overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Analysis_Archetype_Strategic_Recommendations_archetype_id_fkey"
            columns: ["archetype_id"]
            isOneToOne: false
            referencedRelation: "level3_report_data"
            referencedColumns: ["archetype_id"]
          },
        ]
      }
      Analysis_Archetype_SWOT: {
        Row: {
          archetype_id: string
          id: string
          last_updated: string | null
          opportunities: Json | null
          strengths: Json | null
          threats: Json | null
          weaknesses: Json | null
        }
        Insert: {
          archetype_id: string
          id?: string
          last_updated?: string | null
          opportunities?: Json | null
          strengths?: Json | null
          threats?: Json | null
          weaknesses?: Json | null
        }
        Update: {
          archetype_id?: string
          id?: string
          last_updated?: string | null
          opportunities?: Json | null
          strengths?: Json | null
          threats?: Json | null
          weaknesses?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "Analysis_Archetype_SWOT_archetype_id_fkey"
            columns: ["archetype_id"]
            isOneToOne: true
            referencedRelation: "Core_Archetype_Overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Analysis_Archetype_SWOT_archetype_id_fkey"
            columns: ["archetype_id"]
            isOneToOne: true
            referencedRelation: "level3_report_data"
            referencedColumns: ["archetype_id"]
          },
        ]
      }
      Core_Archetype_Families: {
        Row: {
          common_traits: Json | null
          hex_color: string | null
          id: string
          industries: string | null
          long_description: string | null
          name: string | null
          short_description: string | null
        }
        Insert: {
          common_traits?: Json | null
          hex_color?: string | null
          id: string
          industries?: string | null
          long_description?: string | null
          name?: string | null
          short_description?: string | null
        }
        Update: {
          common_traits?: Json | null
          hex_color?: string | null
          id?: string
          industries?: string | null
          long_description?: string | null
          name?: string | null
          short_description?: string | null
        }
        Relationships: []
      }
      Core_Archetype_Overview: {
        Row: {
          family_id: string | null
          hex_color: string | null
          id: string
          industries: string | null
          key_characteristics: string | null
          long_description: string | null
          name: string | null
          short_description: string | null
        }
        Insert: {
          family_id?: string | null
          hex_color?: string | null
          id: string
          industries?: string | null
          key_characteristics?: string | null
          long_description?: string | null
          name?: string | null
          short_description?: string | null
        }
        Update: {
          family_id?: string | null
          hex_color?: string | null
          id?: string
          industries?: string | null
          key_characteristics?: string | null
          long_description?: string | null
          name?: string | null
          short_description?: string | null
        }
        Relationships: []
      }
      Core_Archetypes_Metrics: {
        Row: {
          Archetype: string | null
          "Bene_Access to Benefits Composite": number | null
          "Bene_Access to Disability Plans": number | null
          "Bene_Access to Financial Planning": number | null
          "Bene_Access to Flexible Workplace or Schedule": number | null
          "Bene_Access to Health Insurance": number | null
          "Bene_Access to Retirement": number | null
          "Bene_Access to Wellness Programs": number | null
          "Bene_Paid Personal Leave": number | null
          "Cost_Avoidable ER Potential Savings PMPM": number | null
          "Cost_Avoidable ER Potential Savings PMPY": number | null
          "Cost_Medical & RX Allowed Amount PEPM": number | null
          "Cost_Medical & RX Allowed Amount PEPY": number | null
          "Cost_Medical & RX Allowed Amount PMPM": number | null
          "Cost_Medical & RX Allowed Amount PMPY": number | null
          "Cost_Medical & RX Paid Amount PEPM": number | null
          "Cost_Medical & RX Paid Amount PEPY": number | null
          "Cost_Medical & RX Paid Amount PMPM": number | null
          "Cost_Medical & RX Paid Amount PMPY": number | null
          "Cost_Medical Allowed Amount PEPM": number | null
          "Cost_Medical Allowed Amount PEPY": number | null
          "Cost_Medical Allowed Amount PMPM": number | null
          "Cost_Medical Allowed Amount PMPY": number | null
          "Cost_Medical Paid Amount PEPM": number | null
          "Cost_Medical Paid Amount PEPY": number | null
          "Cost_Medical Paid Amount PMPM": number | null
          "Cost_Medical Paid Amount PMPY": number | null
          "Cost_RX Allowed Amount PEPM": number | null
          "Cost_RX Allowed Amount PEPY": number | null
          "Cost_RX Allowed Amount PMPM": number | null
          "Cost_RX Allowed Amount PMPY": number | null
          "Cost_RX Paid Amount PEPM": number | null
          "Cost_RX Paid Amount PEPY": number | null
          "Cost_RX Paid Amount PMPM": number | null
          "Cost_RX Paid Amount PMPY": number | null
          "Cost_Specialty RX Allowed Amount PMPM": number | null
          "Data Date": string | null
          "Demo_Average Age": number | null
          "Demo_Average Employees": number | null
          "Demo_Average Family Size": number | null
          "Demo_Average Members": number | null
          "Demo_Average Percent Female": number | null
          "Demo_Average Salary": number | null
          "Demo_Average States": number | null
          "Demo_Median Employees": number | null
          "Demo_Median Members": number | null
          "Dise_Allergies Prevalence": number | null
          "Dise_Anxiety Prevalence": number | null
          "Dise_Asthma Prevalence": number | null
          "Dise_Autism Prevalence": number | null
          "Dise_Back Pain Prevalence": number | null
          "Dise_Cancer Prevalence": number | null
          "Dise_Chemotherapy Prevalence": number | null
          "Dise_Chronic Kidney Disease Prevalence": number | null
          "Dise_COPD Prevalence": number | null
          "Dise_Heart Disease Prevalence": number | null
          "Dise_Hyperlipidemia Prevalence": number | null
          "Dise_Hypertension Prevalence": number | null
          "Dise_Infertility Prevalence": number | null
          "Dise_Major Recurrent Depression Prevalence": number | null
          "Dise_Mental Health Disorder Prevalence": number | null
          "Dise_MSK Prevalence": number | null
          "Dise_Multiple Sclerosis Prevalence": number | null
          "Dise_Obesity Prevalence": number | null
          "Dise_Osteoarthritis Prevalence": number | null
          "Dise_PTSD Prevalence": number | null
          "Dise_Sleep Apnea Prevalence": number | null
          "Dise_Substance Use Disorder Prevalence": number | null
          "Dise_Type 1 Diabetes Prevalence": number | null
          "Dise_Type 2 Diabetes Prevalence": number | null
          "Dise_Vitamin D Deficiency Prevalence": number | null
          "Gaps_Behavioral Health FU Antidepressant Med Man": number | null
          "Gaps_Behavioral Health FU Care Children ADHDMeds": number | null
          "Gaps_Behavioral Health FU ED Visit Alcohol Other Drug Abuse":
            | number
            | null
          "Gaps_Behavioral Health FU ED Visit Mental Illness": number | null
          "Gaps_Behavioral Health FU High Intensity Care SUD": number | null
          "Gaps_Behavioral Health FU Hospitalization Mental Illness":
            | number
            | null
          "Gaps_Cancer Screening Breast": number | null
          "Gaps_Cancer Screening Cervical": number | null
          "Gaps_Cancer Screening Colon": number | null
          "Gaps_Diabetes Annual Exam": number | null
          "Gaps_Diabetes HbA1C Test": number | null
          "Gaps_Diabetes Retinal Screening": number | null
          "Gaps_Diabetes RX Adherence": number | null
          "Gaps_Hyperlipidemia HDL Adherence": number | null
          "Gaps_Hyperlipidemia LDL Adherence": number | null
          "Gaps_Hyperlipidemia RX Adherence": number | null
          "Gaps_Hyperlipidemia Triglyceride Adherence": number | null
          "Gaps_Hypertension ACE Inhibitor RX Adherence": number | null
          "Gaps_Hypertension Annual Exam": number | null
          "Gaps_Hypertension ARB RX Adherence": number | null
          "Gaps_Hypertension Beta Blocker RX Adherence": number | null
          "Gaps_Hypertension Calcium Channel Blocker RX Adherence":
            | number
            | null
          "Gaps_Hypertension Diuretic RX Adherence": number | null
          "Gaps_Hypertension RX Adherence": number | null
          "Gaps_Immunization HPV": number | null
          "Gaps_Immunization Meningitis": number | null
          "Gaps_Immunization TDAP": number | null
          "Gaps_Wellness Visit Adults": number | null
          "Gaps_Wellness Visit Ages 1-2": number | null
          "Gaps_Wellness Visit Ages 1-20": number | null
          "Gaps_Wellness Visit Ages 12-20": number | null
          "Gaps_Wellness Visit Ages 2-7": number | null
          "Gaps_Wellness Visit Ages 7-12": number | null
          id: string
          "Risk_Average Risk Score": number | null
          "SDOH_Average Amenities Access": number | null
          "SDOH_Average Childcare Access": number | null
          "SDOH_Average Digital Access": number | null
          "SDOH_Average Economic Insecurity": number | null
          "SDOH_Average Food Access": number | null
          "SDOH_Average Health Literacy": number | null
          "SDOH_Average Healthcare Access": number | null
          "SDOH_Average Neighborhood": number | null
          "SDOH_Average SDOH": number | null
          "SDOH_Average Transportation": number | null
          "SDOH_Average Womens Health": number | null
          "Util_Cesarean Sections": number | null
          "Util_Dialysis Service per 1k Members": number | null
          "Util_Emergency Visits per 1k Members": number | null
          "Util_Inpatient Admits per 1k Members": number | null
          "Util_Inpatient Days per 1k Members": number | null
          "Util_Lab Services per 1k Members": number | null
          "Util_Live Births": number | null
          "Util_Observational Stays per 1k Members": number | null
          "Util_Outpatient Surgeries per 1k Members": number | null
          "Util_PCP Visits per 1k Members": number | null
          "Util_Percent of Allowed Amount Spent on High Cost Claimants":
            | number
            | null
          "Util_Percent of Members who are High Cost Claimants": number | null
          "Util_Percent of Members who are Non-Utilizers": number | null
          "Util_Preventative Visits per 1k Members": number | null
          "Util_Radiology Services per 1k Members": number | null
          "Util_Specialist Visits per 1k Members": number | null
          "Util_Telehealth Adoption": number | null
          "Util_Urgent Care Visits per 1k Members": number | null
        }
        Insert: {
          Archetype?: string | null
          "Bene_Access to Benefits Composite"?: number | null
          "Bene_Access to Disability Plans"?: number | null
          "Bene_Access to Financial Planning"?: number | null
          "Bene_Access to Flexible Workplace or Schedule"?: number | null
          "Bene_Access to Health Insurance"?: number | null
          "Bene_Access to Retirement"?: number | null
          "Bene_Access to Wellness Programs"?: number | null
          "Bene_Paid Personal Leave"?: number | null
          "Cost_Avoidable ER Potential Savings PMPM"?: number | null
          "Cost_Avoidable ER Potential Savings PMPY"?: number | null
          "Cost_Medical & RX Allowed Amount PEPM"?: number | null
          "Cost_Medical & RX Allowed Amount PEPY"?: number | null
          "Cost_Medical & RX Allowed Amount PMPM"?: number | null
          "Cost_Medical & RX Allowed Amount PMPY"?: number | null
          "Cost_Medical & RX Paid Amount PEPM"?: number | null
          "Cost_Medical & RX Paid Amount PEPY"?: number | null
          "Cost_Medical & RX Paid Amount PMPM"?: number | null
          "Cost_Medical & RX Paid Amount PMPY"?: number | null
          "Cost_Medical Allowed Amount PEPM"?: number | null
          "Cost_Medical Allowed Amount PEPY"?: number | null
          "Cost_Medical Allowed Amount PMPM"?: number | null
          "Cost_Medical Allowed Amount PMPY"?: number | null
          "Cost_Medical Paid Amount PEPM"?: number | null
          "Cost_Medical Paid Amount PEPY"?: number | null
          "Cost_Medical Paid Amount PMPM"?: number | null
          "Cost_Medical Paid Amount PMPY"?: number | null
          "Cost_RX Allowed Amount PEPM"?: number | null
          "Cost_RX Allowed Amount PEPY"?: number | null
          "Cost_RX Allowed Amount PMPM"?: number | null
          "Cost_RX Allowed Amount PMPY"?: number | null
          "Cost_RX Paid Amount PEPM"?: number | null
          "Cost_RX Paid Amount PEPY"?: number | null
          "Cost_RX Paid Amount PMPM"?: number | null
          "Cost_RX Paid Amount PMPY"?: number | null
          "Cost_Specialty RX Allowed Amount PMPM"?: number | null
          "Data Date"?: string | null
          "Demo_Average Age"?: number | null
          "Demo_Average Employees"?: number | null
          "Demo_Average Family Size"?: number | null
          "Demo_Average Members"?: number | null
          "Demo_Average Percent Female"?: number | null
          "Demo_Average Salary"?: number | null
          "Demo_Average States"?: number | null
          "Demo_Median Employees"?: number | null
          "Demo_Median Members"?: number | null
          "Dise_Allergies Prevalence"?: number | null
          "Dise_Anxiety Prevalence"?: number | null
          "Dise_Asthma Prevalence"?: number | null
          "Dise_Autism Prevalence"?: number | null
          "Dise_Back Pain Prevalence"?: number | null
          "Dise_Cancer Prevalence"?: number | null
          "Dise_Chemotherapy Prevalence"?: number | null
          "Dise_Chronic Kidney Disease Prevalence"?: number | null
          "Dise_COPD Prevalence"?: number | null
          "Dise_Heart Disease Prevalence"?: number | null
          "Dise_Hyperlipidemia Prevalence"?: number | null
          "Dise_Hypertension Prevalence"?: number | null
          "Dise_Infertility Prevalence"?: number | null
          "Dise_Major Recurrent Depression Prevalence"?: number | null
          "Dise_Mental Health Disorder Prevalence"?: number | null
          "Dise_MSK Prevalence"?: number | null
          "Dise_Multiple Sclerosis Prevalence"?: number | null
          "Dise_Obesity Prevalence"?: number | null
          "Dise_Osteoarthritis Prevalence"?: number | null
          "Dise_PTSD Prevalence"?: number | null
          "Dise_Sleep Apnea Prevalence"?: number | null
          "Dise_Substance Use Disorder Prevalence"?: number | null
          "Dise_Type 1 Diabetes Prevalence"?: number | null
          "Dise_Type 2 Diabetes Prevalence"?: number | null
          "Dise_Vitamin D Deficiency Prevalence"?: number | null
          "Gaps_Behavioral Health FU Antidepressant Med Man"?: number | null
          "Gaps_Behavioral Health FU Care Children ADHDMeds"?: number | null
          "Gaps_Behavioral Health FU ED Visit Alcohol Other Drug Abuse"?:
            | number
            | null
          "Gaps_Behavioral Health FU ED Visit Mental Illness"?: number | null
          "Gaps_Behavioral Health FU High Intensity Care SUD"?: number | null
          "Gaps_Behavioral Health FU Hospitalization Mental Illness"?:
            | number
            | null
          "Gaps_Cancer Screening Breast"?: number | null
          "Gaps_Cancer Screening Cervical"?: number | null
          "Gaps_Cancer Screening Colon"?: number | null
          "Gaps_Diabetes Annual Exam"?: number | null
          "Gaps_Diabetes HbA1C Test"?: number | null
          "Gaps_Diabetes Retinal Screening"?: number | null
          "Gaps_Diabetes RX Adherence"?: number | null
          "Gaps_Hyperlipidemia HDL Adherence"?: number | null
          "Gaps_Hyperlipidemia LDL Adherence"?: number | null
          "Gaps_Hyperlipidemia RX Adherence"?: number | null
          "Gaps_Hyperlipidemia Triglyceride Adherence"?: number | null
          "Gaps_Hypertension ACE Inhibitor RX Adherence"?: number | null
          "Gaps_Hypertension Annual Exam"?: number | null
          "Gaps_Hypertension ARB RX Adherence"?: number | null
          "Gaps_Hypertension Beta Blocker RX Adherence"?: number | null
          "Gaps_Hypertension Calcium Channel Blocker RX Adherence"?:
            | number
            | null
          "Gaps_Hypertension Diuretic RX Adherence"?: number | null
          "Gaps_Hypertension RX Adherence"?: number | null
          "Gaps_Immunization HPV"?: number | null
          "Gaps_Immunization Meningitis"?: number | null
          "Gaps_Immunization TDAP"?: number | null
          "Gaps_Wellness Visit Adults"?: number | null
          "Gaps_Wellness Visit Ages 1-2"?: number | null
          "Gaps_Wellness Visit Ages 1-20"?: number | null
          "Gaps_Wellness Visit Ages 12-20"?: number | null
          "Gaps_Wellness Visit Ages 2-7"?: number | null
          "Gaps_Wellness Visit Ages 7-12"?: number | null
          id: string
          "Risk_Average Risk Score"?: number | null
          "SDOH_Average Amenities Access"?: number | null
          "SDOH_Average Childcare Access"?: number | null
          "SDOH_Average Digital Access"?: number | null
          "SDOH_Average Economic Insecurity"?: number | null
          "SDOH_Average Food Access"?: number | null
          "SDOH_Average Health Literacy"?: number | null
          "SDOH_Average Healthcare Access"?: number | null
          "SDOH_Average Neighborhood"?: number | null
          "SDOH_Average SDOH"?: number | null
          "SDOH_Average Transportation"?: number | null
          "SDOH_Average Womens Health"?: number | null
          "Util_Cesarean Sections"?: number | null
          "Util_Dialysis Service per 1k Members"?: number | null
          "Util_Emergency Visits per 1k Members"?: number | null
          "Util_Inpatient Admits per 1k Members"?: number | null
          "Util_Inpatient Days per 1k Members"?: number | null
          "Util_Lab Services per 1k Members"?: number | null
          "Util_Live Births"?: number | null
          "Util_Observational Stays per 1k Members"?: number | null
          "Util_Outpatient Surgeries per 1k Members"?: number | null
          "Util_PCP Visits per 1k Members"?: number | null
          "Util_Percent of Allowed Amount Spent on High Cost Claimants"?:
            | number
            | null
          "Util_Percent of Members who are High Cost Claimants"?: number | null
          "Util_Percent of Members who are Non-Utilizers"?: number | null
          "Util_Preventative Visits per 1k Members"?: number | null
          "Util_Radiology Services per 1k Members"?: number | null
          "Util_Specialist Visits per 1k Members"?: number | null
          "Util_Telehealth Adoption"?: number | null
          "Util_Urgent Care Visits per 1k Members"?: number | null
        }
        Update: {
          Archetype?: string | null
          "Bene_Access to Benefits Composite"?: number | null
          "Bene_Access to Disability Plans"?: number | null
          "Bene_Access to Financial Planning"?: number | null
          "Bene_Access to Flexible Workplace or Schedule"?: number | null
          "Bene_Access to Health Insurance"?: number | null
          "Bene_Access to Retirement"?: number | null
          "Bene_Access to Wellness Programs"?: number | null
          "Bene_Paid Personal Leave"?: number | null
          "Cost_Avoidable ER Potential Savings PMPM"?: number | null
          "Cost_Avoidable ER Potential Savings PMPY"?: number | null
          "Cost_Medical & RX Allowed Amount PEPM"?: number | null
          "Cost_Medical & RX Allowed Amount PEPY"?: number | null
          "Cost_Medical & RX Allowed Amount PMPM"?: number | null
          "Cost_Medical & RX Allowed Amount PMPY"?: number | null
          "Cost_Medical & RX Paid Amount PEPM"?: number | null
          "Cost_Medical & RX Paid Amount PEPY"?: number | null
          "Cost_Medical & RX Paid Amount PMPM"?: number | null
          "Cost_Medical & RX Paid Amount PMPY"?: number | null
          "Cost_Medical Allowed Amount PEPM"?: number | null
          "Cost_Medical Allowed Amount PEPY"?: number | null
          "Cost_Medical Allowed Amount PMPM"?: number | null
          "Cost_Medical Allowed Amount PMPY"?: number | null
          "Cost_Medical Paid Amount PEPM"?: number | null
          "Cost_Medical Paid Amount PEPY"?: number | null
          "Cost_Medical Paid Amount PMPM"?: number | null
          "Cost_Medical Paid Amount PMPY"?: number | null
          "Cost_RX Allowed Amount PEPM"?: number | null
          "Cost_RX Allowed Amount PEPY"?: number | null
          "Cost_RX Allowed Amount PMPM"?: number | null
          "Cost_RX Allowed Amount PMPY"?: number | null
          "Cost_RX Paid Amount PEPM"?: number | null
          "Cost_RX Paid Amount PEPY"?: number | null
          "Cost_RX Paid Amount PMPM"?: number | null
          "Cost_RX Paid Amount PMPY"?: number | null
          "Cost_Specialty RX Allowed Amount PMPM"?: number | null
          "Data Date"?: string | null
          "Demo_Average Age"?: number | null
          "Demo_Average Employees"?: number | null
          "Demo_Average Family Size"?: number | null
          "Demo_Average Members"?: number | null
          "Demo_Average Percent Female"?: number | null
          "Demo_Average Salary"?: number | null
          "Demo_Average States"?: number | null
          "Demo_Median Employees"?: number | null
          "Demo_Median Members"?: number | null
          "Dise_Allergies Prevalence"?: number | null
          "Dise_Anxiety Prevalence"?: number | null
          "Dise_Asthma Prevalence"?: number | null
          "Dise_Autism Prevalence"?: number | null
          "Dise_Back Pain Prevalence"?: number | null
          "Dise_Cancer Prevalence"?: number | null
          "Dise_Chemotherapy Prevalence"?: number | null
          "Dise_Chronic Kidney Disease Prevalence"?: number | null
          "Dise_COPD Prevalence"?: number | null
          "Dise_Heart Disease Prevalence"?: number | null
          "Dise_Hyperlipidemia Prevalence"?: number | null
          "Dise_Hypertension Prevalence"?: number | null
          "Dise_Infertility Prevalence"?: number | null
          "Dise_Major Recurrent Depression Prevalence"?: number | null
          "Dise_Mental Health Disorder Prevalence"?: number | null
          "Dise_MSK Prevalence"?: number | null
          "Dise_Multiple Sclerosis Prevalence"?: number | null
          "Dise_Obesity Prevalence"?: number | null
          "Dise_Osteoarthritis Prevalence"?: number | null
          "Dise_PTSD Prevalence"?: number | null
          "Dise_Sleep Apnea Prevalence"?: number | null
          "Dise_Substance Use Disorder Prevalence"?: number | null
          "Dise_Type 1 Diabetes Prevalence"?: number | null
          "Dise_Type 2 Diabetes Prevalence"?: number | null
          "Dise_Vitamin D Deficiency Prevalence"?: number | null
          "Gaps_Behavioral Health FU Antidepressant Med Man"?: number | null
          "Gaps_Behavioral Health FU Care Children ADHDMeds"?: number | null
          "Gaps_Behavioral Health FU ED Visit Alcohol Other Drug Abuse"?:
            | number
            | null
          "Gaps_Behavioral Health FU ED Visit Mental Illness"?: number | null
          "Gaps_Behavioral Health FU High Intensity Care SUD"?: number | null
          "Gaps_Behavioral Health FU Hospitalization Mental Illness"?:
            | number
            | null
          "Gaps_Cancer Screening Breast"?: number | null
          "Gaps_Cancer Screening Cervical"?: number | null
          "Gaps_Cancer Screening Colon"?: number | null
          "Gaps_Diabetes Annual Exam"?: number | null
          "Gaps_Diabetes HbA1C Test"?: number | null
          "Gaps_Diabetes Retinal Screening"?: number | null
          "Gaps_Diabetes RX Adherence"?: number | null
          "Gaps_Hyperlipidemia HDL Adherence"?: number | null
          "Gaps_Hyperlipidemia LDL Adherence"?: number | null
          "Gaps_Hyperlipidemia RX Adherence"?: number | null
          "Gaps_Hyperlipidemia Triglyceride Adherence"?: number | null
          "Gaps_Hypertension ACE Inhibitor RX Adherence"?: number | null
          "Gaps_Hypertension Annual Exam"?: number | null
          "Gaps_Hypertension ARB RX Adherence"?: number | null
          "Gaps_Hypertension Beta Blocker RX Adherence"?: number | null
          "Gaps_Hypertension Calcium Channel Blocker RX Adherence"?:
            | number
            | null
          "Gaps_Hypertension Diuretic RX Adherence"?: number | null
          "Gaps_Hypertension RX Adherence"?: number | null
          "Gaps_Immunization HPV"?: number | null
          "Gaps_Immunization Meningitis"?: number | null
          "Gaps_Immunization TDAP"?: number | null
          "Gaps_Wellness Visit Adults"?: number | null
          "Gaps_Wellness Visit Ages 1-2"?: number | null
          "Gaps_Wellness Visit Ages 1-20"?: number | null
          "Gaps_Wellness Visit Ages 12-20"?: number | null
          "Gaps_Wellness Visit Ages 2-7"?: number | null
          "Gaps_Wellness Visit Ages 7-12"?: number | null
          id?: string
          "Risk_Average Risk Score"?: number | null
          "SDOH_Average Amenities Access"?: number | null
          "SDOH_Average Childcare Access"?: number | null
          "SDOH_Average Digital Access"?: number | null
          "SDOH_Average Economic Insecurity"?: number | null
          "SDOH_Average Food Access"?: number | null
          "SDOH_Average Health Literacy"?: number | null
          "SDOH_Average Healthcare Access"?: number | null
          "SDOH_Average Neighborhood"?: number | null
          "SDOH_Average SDOH"?: number | null
          "SDOH_Average Transportation"?: number | null
          "SDOH_Average Womens Health"?: number | null
          "Util_Cesarean Sections"?: number | null
          "Util_Dialysis Service per 1k Members"?: number | null
          "Util_Emergency Visits per 1k Members"?: number | null
          "Util_Inpatient Admits per 1k Members"?: number | null
          "Util_Inpatient Days per 1k Members"?: number | null
          "Util_Lab Services per 1k Members"?: number | null
          "Util_Live Births"?: number | null
          "Util_Observational Stays per 1k Members"?: number | null
          "Util_Outpatient Surgeries per 1k Members"?: number | null
          "Util_PCP Visits per 1k Members"?: number | null
          "Util_Percent of Allowed Amount Spent on High Cost Claimants"?:
            | number
            | null
          "Util_Percent of Members who are High Cost Claimants"?: number | null
          "Util_Percent of Members who are Non-Utilizers"?: number | null
          "Util_Preventative Visits per 1k Members"?: number | null
          "Util_Radiology Services per 1k Members"?: number | null
          "Util_Specialist Visits per 1k Members"?: number | null
          "Util_Telehealth Adoption"?: number | null
          "Util_Urgent Care Visits per 1k Members"?: number | null
        }
        Relationships: []
      }
      Core_Metric_Dictionary: {
        Row: {
          "Better Direction": string | null
          "Column Name": string
          "Importance Level": number | null
          "Metric Category": string | null
          "Metric Hover Desc": string | null
          "Metric Name": string | null
          "Metric Source": string | null
        }
        Insert: {
          "Better Direction"?: string | null
          "Column Name": string
          "Importance Level"?: number | null
          "Metric Category"?: string | null
          "Metric Hover Desc"?: string | null
          "Metric Name"?: string | null
          "Metric Source"?: string | null
        }
        Update: {
          "Better Direction"?: string | null
          "Column Name"?: string
          "Importance Level"?: number | null
          "Metric Category"?: string | null
          "Metric Hover Desc"?: string | null
          "Metric Name"?: string | null
          "Metric Source"?: string | null
        }
        Relationships: []
      }
      insights_feedback: {
        Row: {
          archetype_id: string | null
          assessment_answers: Json | null
          assessment_result: Json | null
          created_at: string | null
          feedback: string | null
          id: string | null
          session_id: string | null
          user_comments: string | null
        }
        Insert: {
          archetype_id?: string | null
          assessment_answers?: Json | null
          assessment_result?: Json | null
          created_at?: string | null
          feedback?: string | null
          id?: string | null
          session_id?: string | null
          user_comments?: string | null
        }
        Update: {
          archetype_id?: string | null
          assessment_answers?: Json | null
          assessment_result?: Json | null
          created_at?: string | null
          feedback?: string | null
          id?: string | null
          session_id?: string | null
          user_comments?: string | null
        }
        Relationships: []
      }
      report_requests: {
        Row: {
          access_token: string | null
          archetype_id: string | null
          assessment_answers: Json | null
          assessment_result: Json | null
          comments: string | null
          created_at: string | null
          email: string | null
          exact_employee_count: number | null
          expires_at: string | null
          id: string | null
          name: string | null
          organization: string | null
          session_id: string | null
          status: string | null
        }
        Insert: {
          access_token?: string | null
          archetype_id?: string | null
          assessment_answers?: Json | null
          assessment_result?: Json | null
          comments?: string | null
          created_at?: string | null
          email?: string | null
          exact_employee_count?: number | null
          expires_at?: string | null
          id?: string | null
          name?: string | null
          organization?: string | null
          session_id?: string | null
          status?: string | null
        }
        Update: {
          access_token?: string | null
          archetype_id?: string | null
          assessment_answers?: Json | null
          assessment_result?: Json | null
          comments?: string | null
          created_at?: string | null
          email?: string | null
          exact_employee_count?: number | null
          expires_at?: string | null
          id?: string | null
          name?: string | null
          organization?: string | null
          session_id?: string | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      level3_report_data: {
        Row: {
          archetype_id: string | null
          archetype_name: string | null
          common_traits: Json | null
          "Cost_Avoidable ER Potential Savings PMPY": number | null
          "Cost_Medical & RX Paid Amount PEPY": number | null
          "Cost_Medical & RX Paid Amount PMPY": number | null
          "Cost_Medical Paid Amount PEPY": number | null
          "Cost_RX Paid Amount PEPY": number | null
          "Demo_Average Age": number | null
          "Demo_Average Employees": number | null
          "Demo_Average Family Size": number | null
          "Demo_Average Percent Female": number | null
          "Demo_Average States": number | null
          detailed_metrics: Json | null
          "Dise_Heart Disease Prevalence": number | null
          "Dise_Mental Health Disorder Prevalence": number | null
          "Dise_Substance Use Disorder Prevalence": number | null
          "Dise_Type 2 Diabetes Prevalence": number | null
          distinctive_metrics: Json | null
          executive_summary: string | null
          family_id: string | null
          family_industries: string | null
          family_long_description: string | null
          family_name: string | null
          family_short_description: string | null
          "Gaps_Behavioral Health FU ED Visit Mental Illness": number | null
          "Gaps_Cancer Screening Breast": number | null
          "Gaps_Diabetes RX Adherence": number | null
          "Gaps_Wellness Visit Adults": number | null
          hex_color: string | null
          industries: string | null
          key_characteristics: string | null
          key_findings: Json | null
          long_description: string | null
          opportunities: Json | null
          "Risk_Average Risk Score": number | null
          "SDOH_Average SDOH": number | null
          short_description: string | null
          strategic_recommendations: Json | null
          strengths: Json | null
          threats: Json | null
          "Util_Emergency Visits per 1k Members": number | null
          "Util_Inpatient Admits per 1k Members": number | null
          "Util_Percent of Members who are Non-Utilizers": number | null
          "Util_Specialist Visits per 1k Members": number | null
          weaknesses: Json | null
        }
        Relationships: []
      }
      View_Cost_Metrics: {
        Row: {
          Archetype: string | null
          "Cost_Avoidable ER Potential Savings PMPY": number | null
          "Cost_Medical & RX Paid Amount PEPY": number | null
          "Cost_Medical & RX Paid Amount PMPY": number | null
          "Cost_Medical Paid Amount PEPY": number | null
          "Cost_Medical Paid Amount PMPY": number | null
          "Cost_RX Paid Amount PEPY": number | null
          "Cost_RX Paid Amount PMPY": number | null
          "Cost_Specialty RX Allowed Amount PMPM": number | null
          id: string | null
        }
        Insert: {
          Archetype?: string | null
          "Cost_Avoidable ER Potential Savings PMPY"?: number | null
          "Cost_Medical & RX Paid Amount PEPY"?: number | null
          "Cost_Medical & RX Paid Amount PMPY"?: number | null
          "Cost_Medical Paid Amount PEPY"?: number | null
          "Cost_Medical Paid Amount PMPY"?: number | null
          "Cost_RX Paid Amount PEPY"?: number | null
          "Cost_RX Paid Amount PMPY"?: number | null
          "Cost_Specialty RX Allowed Amount PMPM"?: number | null
          id?: string | null
        }
        Update: {
          Archetype?: string | null
          "Cost_Avoidable ER Potential Savings PMPY"?: number | null
          "Cost_Medical & RX Paid Amount PEPY"?: number | null
          "Cost_Medical & RX Paid Amount PMPY"?: number | null
          "Cost_Medical Paid Amount PEPY"?: number | null
          "Cost_Medical Paid Amount PMPY"?: number | null
          "Cost_RX Paid Amount PEPY"?: number | null
          "Cost_RX Paid Amount PMPY"?: number | null
          "Cost_Specialty RX Allowed Amount PMPM"?: number | null
          id?: string | null
        }
        Relationships: []
      }
      View_Demographics_Metrics: {
        Row: {
          Archetype: string | null
          "Demo_Average Age": number | null
          "Demo_Average Employees": number | null
          "Demo_Average Family Size": number | null
          "Demo_Average Members": number | null
          "Demo_Average Percent Female": number | null
          "Demo_Average Salary": number | null
          "Demo_Average States": number | null
          "Demo_Median Employees": number | null
          "Demo_Median Members": number | null
          id: string | null
        }
        Insert: {
          Archetype?: string | null
          "Demo_Average Age"?: number | null
          "Demo_Average Employees"?: number | null
          "Demo_Average Family Size"?: number | null
          "Demo_Average Members"?: number | null
          "Demo_Average Percent Female"?: number | null
          "Demo_Average Salary"?: number | null
          "Demo_Average States"?: number | null
          "Demo_Median Employees"?: number | null
          "Demo_Median Members"?: number | null
          id?: string | null
        }
        Update: {
          Archetype?: string | null
          "Demo_Average Age"?: number | null
          "Demo_Average Employees"?: number | null
          "Demo_Average Family Size"?: number | null
          "Demo_Average Members"?: number | null
          "Demo_Average Percent Female"?: number | null
          "Demo_Average Salary"?: number | null
          "Demo_Average States"?: number | null
          "Demo_Median Employees"?: number | null
          "Demo_Median Members"?: number | null
          id?: string | null
        }
        Relationships: []
      }
      View_Disease_Prevalence: {
        Row: {
          Archetype: string | null
          "Dise_Cancer Prevalence": number | null
          "Dise_COPD Prevalence": number | null
          "Dise_Heart Disease Prevalence": number | null
          "Dise_Hypertension Prevalence": number | null
          "Dise_Infertility Prevalence": number | null
          "Dise_Mental Health Disorder Prevalence": number | null
          "Dise_Multiple Sclerosis Prevalence": number | null
          "Dise_Substance Use Disorder Prevalence": number | null
          "Dise_Type 1 Diabetes Prevalence": number | null
          "Dise_Type 2 Diabetes Prevalence": number | null
          "Dise_Vitamin D Deficiency Prevalence": number | null
          id: string | null
        }
        Insert: {
          Archetype?: string | null
          "Dise_Cancer Prevalence"?: number | null
          "Dise_COPD Prevalence"?: number | null
          "Dise_Heart Disease Prevalence"?: number | null
          "Dise_Hypertension Prevalence"?: number | null
          "Dise_Infertility Prevalence"?: number | null
          "Dise_Mental Health Disorder Prevalence"?: number | null
          "Dise_Multiple Sclerosis Prevalence"?: number | null
          "Dise_Substance Use Disorder Prevalence"?: number | null
          "Dise_Type 1 Diabetes Prevalence"?: number | null
          "Dise_Type 2 Diabetes Prevalence"?: number | null
          "Dise_Vitamin D Deficiency Prevalence"?: number | null
          id?: string | null
        }
        Update: {
          Archetype?: string | null
          "Dise_Cancer Prevalence"?: number | null
          "Dise_COPD Prevalence"?: number | null
          "Dise_Heart Disease Prevalence"?: number | null
          "Dise_Hypertension Prevalence"?: number | null
          "Dise_Infertility Prevalence"?: number | null
          "Dise_Mental Health Disorder Prevalence"?: number | null
          "Dise_Multiple Sclerosis Prevalence"?: number | null
          "Dise_Substance Use Disorder Prevalence"?: number | null
          "Dise_Type 1 Diabetes Prevalence"?: number | null
          "Dise_Type 2 Diabetes Prevalence"?: number | null
          "Dise_Vitamin D Deficiency Prevalence"?: number | null
          id?: string | null
        }
        Relationships: []
      }
      View_Gaps_In_Care: {
        Row: {
          Archetype: string | null
          "Gaps_Behavioral Health FU Antidepressant Med Man": number | null
          "Gaps_Behavioral Health FU Care Children ADHDMeds": number | null
          "Gaps_Behavioral Health FU ED Visit Alcohol Other Drug Abuse":
            | number
            | null
          "Gaps_Behavioral Health FU ED Visit Mental Illness": number | null
          "Gaps_Behavioral Health FU High Intensity Care SUD": number | null
          "Gaps_Behavioral Health FU Hospitalization Mental Illness":
            | number
            | null
          "Gaps_Cancer Screening Breast": number | null
          "Gaps_Cancer Screening Cervical": number | null
          "Gaps_Cancer Screening Colon": number | null
          "Gaps_Diabetes Annual Exam": number | null
          "Gaps_Diabetes HbA1C Test": number | null
          "Gaps_Diabetes Retinal Screening": number | null
          "Gaps_Diabetes RX Adherence": number | null
          "Gaps_Hyperlipidemia HDL Adherence": number | null
          "Gaps_Hyperlipidemia LDL Adherence": number | null
          "Gaps_Hyperlipidemia RX Adherence": number | null
          "Gaps_Hyperlipidemia Triglyceride Adherence": number | null
          "Gaps_Hypertension ACE Inhibitor RX Adherence": number | null
          "Gaps_Hypertension Annual Exam": number | null
          "Gaps_Hypertension ARB RX Adherence": number | null
          "Gaps_Hypertension Beta Blocker RX Adherence": number | null
          "Gaps_Hypertension Calcium Channel Blocker RX Adherence":
            | number
            | null
          "Gaps_Hypertension Diuretic RX Adherence": number | null
          "Gaps_Hypertension RX Adherence": number | null
          "Gaps_Immunization HPV": number | null
          "Gaps_Immunization Meningitis": number | null
          "Gaps_Immunization TDAP": number | null
          "Gaps_Wellness Visit Adults": number | null
          "Gaps_Wellness Visit Ages 1-2": number | null
          "Gaps_Wellness Visit Ages 1-20": number | null
          "Gaps_Wellness Visit Ages 12-20": number | null
          "Gaps_Wellness Visit Ages 2-7": number | null
          "Gaps_Wellness Visit Ages 7-12": number | null
          id: string | null
        }
        Insert: {
          Archetype?: string | null
          "Gaps_Behavioral Health FU Antidepressant Med Man"?: number | null
          "Gaps_Behavioral Health FU Care Children ADHDMeds"?: number | null
          "Gaps_Behavioral Health FU ED Visit Alcohol Other Drug Abuse"?:
            | number
            | null
          "Gaps_Behavioral Health FU ED Visit Mental Illness"?: number | null
          "Gaps_Behavioral Health FU High Intensity Care SUD"?: number | null
          "Gaps_Behavioral Health FU Hospitalization Mental Illness"?:
            | number
            | null
          "Gaps_Cancer Screening Breast"?: number | null
          "Gaps_Cancer Screening Cervical"?: number | null
          "Gaps_Cancer Screening Colon"?: number | null
          "Gaps_Diabetes Annual Exam"?: number | null
          "Gaps_Diabetes HbA1C Test"?: number | null
          "Gaps_Diabetes Retinal Screening"?: number | null
          "Gaps_Diabetes RX Adherence"?: number | null
          "Gaps_Hyperlipidemia HDL Adherence"?: number | null
          "Gaps_Hyperlipidemia LDL Adherence"?: number | null
          "Gaps_Hyperlipidemia RX Adherence"?: number | null
          "Gaps_Hyperlipidemia Triglyceride Adherence"?: number | null
          "Gaps_Hypertension ACE Inhibitor RX Adherence"?: number | null
          "Gaps_Hypertension Annual Exam"?: number | null
          "Gaps_Hypertension ARB RX Adherence"?: number | null
          "Gaps_Hypertension Beta Blocker RX Adherence"?: number | null
          "Gaps_Hypertension Calcium Channel Blocker RX Adherence"?:
            | number
            | null
          "Gaps_Hypertension Diuretic RX Adherence"?: number | null
          "Gaps_Hypertension RX Adherence"?: number | null
          "Gaps_Immunization HPV"?: number | null
          "Gaps_Immunization Meningitis"?: number | null
          "Gaps_Immunization TDAP"?: number | null
          "Gaps_Wellness Visit Adults"?: number | null
          "Gaps_Wellness Visit Ages 1-2"?: number | null
          "Gaps_Wellness Visit Ages 1-20"?: number | null
          "Gaps_Wellness Visit Ages 12-20"?: number | null
          "Gaps_Wellness Visit Ages 2-7"?: number | null
          "Gaps_Wellness Visit Ages 7-12"?: number | null
          id?: string | null
        }
        Update: {
          Archetype?: string | null
          "Gaps_Behavioral Health FU Antidepressant Med Man"?: number | null
          "Gaps_Behavioral Health FU Care Children ADHDMeds"?: number | null
          "Gaps_Behavioral Health FU ED Visit Alcohol Other Drug Abuse"?:
            | number
            | null
          "Gaps_Behavioral Health FU ED Visit Mental Illness"?: number | null
          "Gaps_Behavioral Health FU High Intensity Care SUD"?: number | null
          "Gaps_Behavioral Health FU Hospitalization Mental Illness"?:
            | number
            | null
          "Gaps_Cancer Screening Breast"?: number | null
          "Gaps_Cancer Screening Cervical"?: number | null
          "Gaps_Cancer Screening Colon"?: number | null
          "Gaps_Diabetes Annual Exam"?: number | null
          "Gaps_Diabetes HbA1C Test"?: number | null
          "Gaps_Diabetes Retinal Screening"?: number | null
          "Gaps_Diabetes RX Adherence"?: number | null
          "Gaps_Hyperlipidemia HDL Adherence"?: number | null
          "Gaps_Hyperlipidemia LDL Adherence"?: number | null
          "Gaps_Hyperlipidemia RX Adherence"?: number | null
          "Gaps_Hyperlipidemia Triglyceride Adherence"?: number | null
          "Gaps_Hypertension ACE Inhibitor RX Adherence"?: number | null
          "Gaps_Hypertension Annual Exam"?: number | null
          "Gaps_Hypertension ARB RX Adherence"?: number | null
          "Gaps_Hypertension Beta Blocker RX Adherence"?: number | null
          "Gaps_Hypertension Calcium Channel Blocker RX Adherence"?:
            | number
            | null
          "Gaps_Hypertension Diuretic RX Adherence"?: number | null
          "Gaps_Hypertension RX Adherence"?: number | null
          "Gaps_Immunization HPV"?: number | null
          "Gaps_Immunization Meningitis"?: number | null
          "Gaps_Immunization TDAP"?: number | null
          "Gaps_Wellness Visit Adults"?: number | null
          "Gaps_Wellness Visit Ages 1-2"?: number | null
          "Gaps_Wellness Visit Ages 1-20"?: number | null
          "Gaps_Wellness Visit Ages 12-20"?: number | null
          "Gaps_Wellness Visit Ages 2-7"?: number | null
          "Gaps_Wellness Visit Ages 7-12"?: number | null
          id?: string | null
        }
        Relationships: []
      }
      View_Risk_Factors: {
        Row: {
          Archetype: string | null
          "Dise_COPD Prevalence": number | null
          "Dise_Heart Disease Prevalence": number | null
          "Dise_Hypertension Prevalence": number | null
          "Dise_Mental Health Disorder Prevalence": number | null
          "Dise_Substance Use Disorder Prevalence": number | null
          "Dise_Type 2 Diabetes Prevalence": number | null
          id: string | null
          "Risk_Average Risk Score": number | null
          "SDOH_Average Amenities Access": number | null
          "SDOH_Average Childcare Access": number | null
          "SDOH_Average Digital Access": number | null
          "SDOH_Average Economic Insecurity": number | null
          "SDOH_Average Food Access": number | null
          "SDOH_Average Health Literacy": number | null
          "SDOH_Average Healthcare Access": number | null
          "SDOH_Average Neighborhood": number | null
          "SDOH_Average SDOH": number | null
          "SDOH_Average Transportation": number | null
          "SDOH_Average Womens Health": number | null
        }
        Insert: {
          Archetype?: string | null
          "Dise_COPD Prevalence"?: number | null
          "Dise_Heart Disease Prevalence"?: number | null
          "Dise_Hypertension Prevalence"?: number | null
          "Dise_Mental Health Disorder Prevalence"?: number | null
          "Dise_Substance Use Disorder Prevalence"?: number | null
          "Dise_Type 2 Diabetes Prevalence"?: number | null
          id?: string | null
          "Risk_Average Risk Score"?: number | null
          "SDOH_Average Amenities Access"?: number | null
          "SDOH_Average Childcare Access"?: number | null
          "SDOH_Average Digital Access"?: number | null
          "SDOH_Average Economic Insecurity"?: number | null
          "SDOH_Average Food Access"?: number | null
          "SDOH_Average Health Literacy"?: number | null
          "SDOH_Average Healthcare Access"?: number | null
          "SDOH_Average Neighborhood"?: number | null
          "SDOH_Average SDOH"?: number | null
          "SDOH_Average Transportation"?: number | null
          "SDOH_Average Womens Health"?: number | null
        }
        Update: {
          Archetype?: string | null
          "Dise_COPD Prevalence"?: number | null
          "Dise_Heart Disease Prevalence"?: number | null
          "Dise_Hypertension Prevalence"?: number | null
          "Dise_Mental Health Disorder Prevalence"?: number | null
          "Dise_Substance Use Disorder Prevalence"?: number | null
          "Dise_Type 2 Diabetes Prevalence"?: number | null
          id?: string | null
          "Risk_Average Risk Score"?: number | null
          "SDOH_Average Amenities Access"?: number | null
          "SDOH_Average Childcare Access"?: number | null
          "SDOH_Average Digital Access"?: number | null
          "SDOH_Average Economic Insecurity"?: number | null
          "SDOH_Average Food Access"?: number | null
          "SDOH_Average Health Literacy"?: number | null
          "SDOH_Average Healthcare Access"?: number | null
          "SDOH_Average Neighborhood"?: number | null
          "SDOH_Average SDOH"?: number | null
          "SDOH_Average Transportation"?: number | null
          "SDOH_Average Womens Health"?: number | null
        }
        Relationships: []
      }
      View_Utilization_Metrics: {
        Row: {
          Archetype: string | null
          id: string | null
          "Util_Cesarean Sections": number | null
          "Util_Dialysis Service per 1k Members": number | null
          "Util_Emergency Visits per 1k Members": number | null
          "Util_Inpatient Admits per 1k Members": number | null
          "Util_Inpatient Days per 1k Members": number | null
          "Util_Lab Services per 1k Members": number | null
          "Util_Live Births": number | null
          "Util_Observational Stays per 1k Members": number | null
          "Util_Outpatient Surgeries per 1k Members": number | null
          "Util_PCP Visits per 1k Members": number | null
          "Util_Percent of Allowed Amount Spent on High Cost Claimants":
            | number
            | null
          "Util_Percent of Members who are High Cost Claimants": number | null
          "Util_Percent of Members who are Non-Utilizers": number | null
          "Util_Preventative Visits per 1k Members": number | null
          "Util_Radiology Services per 1k Members": number | null
          "Util_Specialist Visits per 1k Members": number | null
          "Util_Telehealth Adoption": number | null
          "Util_Urgent Care Visits per 1k Members": number | null
        }
        Insert: {
          Archetype?: string | null
          id?: string | null
          "Util_Cesarean Sections"?: number | null
          "Util_Dialysis Service per 1k Members"?: number | null
          "Util_Emergency Visits per 1k Members"?: number | null
          "Util_Inpatient Admits per 1k Members"?: number | null
          "Util_Inpatient Days per 1k Members"?: number | null
          "Util_Lab Services per 1k Members"?: number | null
          "Util_Live Births"?: number | null
          "Util_Observational Stays per 1k Members"?: number | null
          "Util_Outpatient Surgeries per 1k Members"?: number | null
          "Util_PCP Visits per 1k Members"?: number | null
          "Util_Percent of Allowed Amount Spent on High Cost Claimants"?:
            | number
            | null
          "Util_Percent of Members who are High Cost Claimants"?: number | null
          "Util_Percent of Members who are Non-Utilizers"?: number | null
          "Util_Preventative Visits per 1k Members"?: number | null
          "Util_Radiology Services per 1k Members"?: number | null
          "Util_Specialist Visits per 1k Members"?: number | null
          "Util_Telehealth Adoption"?: number | null
          "Util_Urgent Care Visits per 1k Members"?: number | null
        }
        Update: {
          Archetype?: string | null
          id?: string | null
          "Util_Cesarean Sections"?: number | null
          "Util_Dialysis Service per 1k Members"?: number | null
          "Util_Emergency Visits per 1k Members"?: number | null
          "Util_Inpatient Admits per 1k Members"?: number | null
          "Util_Inpatient Days per 1k Members"?: number | null
          "Util_Lab Services per 1k Members"?: number | null
          "Util_Live Births"?: number | null
          "Util_Observational Stays per 1k Members"?: number | null
          "Util_Outpatient Surgeries per 1k Members"?: number | null
          "Util_PCP Visits per 1k Members"?: number | null
          "Util_Percent of Allowed Amount Spent on High Cost Claimants"?:
            | number
            | null
          "Util_Percent of Members who are High Cost Claimants"?: number | null
          "Util_Percent of Members who are Non-Utilizers"?: number | null
          "Util_Preventative Visits per 1k Members"?: number | null
          "Util_Radiology Services per 1k Members"?: number | null
          "Util_Specialist Visits per 1k Members"?: number | null
          "Util_Telehealth Adoption"?: number | null
          "Util_Urgent Care Visits per 1k Members"?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_test_table_if_not_exists: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_archetype_analysis: {
        Args: {
          p_archetype_id: string
          p_executive_summary: string
          p_archetype_overview: string
          p_key_findings: Json
          p_detailed_metrics: string
          p_swot_analysis: Json
          p_strategic_recommendations: Json
          p_distinctive_metrics: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
