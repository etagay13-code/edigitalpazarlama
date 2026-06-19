// Supabase'deki tabloların TypeScript karşılıkları.
// İleride supabase gen types typescript --linked > types.gen.ts ile otomatik
// üretebilirsin. Şimdilik elle tutuyoruz.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "admin";
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: "admin";
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };

      site_settings: {
        Row: {
          id: 1;
          brand_name: string;
          brand_short_name: string | null;
          founder: string | null;
          tagline: string | null;
          description: string | null;
          url: string | null;
          email: string;
          phone: string | null;
          address: string | null;
          instagram_url: string | null;
          linkedin_url: string | null;
          twitter_url: string | null;
          youtube_url: string | null;
          logo_url: string | null;
          favicon_url: string | null;
          og_image_url: string | null;
          color_bg: string | null;
          color_accent: string | null;
          color_accent_secondary: string | null;
          ga4_measurement_id: string | null;
          gtm_container_id: string | null;
          search_console_verification: string | null;
          hotjar_site_id: string | null;
          microsoft_clarity_id: string | null;
          contact_form_to_email: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["site_settings"]["Row"]> & {
          id?: 1;
        };
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
      };

      services: {
        Row: {
          id: string;
          slug: string;
          title: string;
          short: string;
          description: string;
          long_description: string | null;
          hero: string | null;
          approach: string | null;
          bullets: string[];
          deliverables: string[];
          tools: string[];
          outcomes: string[];
          ideal_for: string[];
          related_slugs: string[];
          icon: string;
          accent: string;
          sort_order: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["services"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>;
      };

      service_process_steps: {
        Row: {
          id: string;
          service_id: string;
          step_number: number;
          title: string;
          description: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["service_process_steps"]["Row"],
          "id"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["service_process_steps"]["Insert"]
        >;
      };

      service_faqs: {
        Row: {
          id: string;
          service_id: string;
          question: string;
          answer: string;
          sort_order: number;
        };
        Insert: Omit<
          Database["public"]["Tables"]["service_faqs"]["Row"],
          "id"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["service_faqs"]["Insert"]
        >;
      };

      portfolio_projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          client: string;
          category: string;
          description: string;
          metric: string | null;
          gradient: string | null;
          tags: string[];
          image_url: string | null;
          sort_order: number;
          active: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["portfolio_projects"]["Row"],
          "id" | "created_at"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["portfolio_projects"]["Insert"]
        >;
      };

      testimonials: {
        Row: {
          id: string;
          name: string;
          role: string | null;
          company: string | null;
          quote: string;
          initials: string | null;
          avatar_url: string | null;
          sort_order: number;
          active: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["testimonials"]["Row"],
          "id" | "created_at"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["testimonials"]["Insert"]
        >;
      };

      team_members: {
        Row: {
          id: string;
          name: string;
          role: string | null;
          bio: string | null;
          initials: string | null;
          accent: string | null;
          avatar_url: string | null;
          sort_order: number;
          active: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["team_members"]["Row"],
          "id" | "created_at"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["team_members"]["Insert"]
        >;
      };

      timeline_events: {
        Row: {
          id: string;
          year: string;
          title: string;
          description: string;
          sort_order: number;
          active: boolean;
        };
        Insert: Omit<
          Database["public"]["Tables"]["timeline_events"]["Row"],
          "id"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["timeline_events"]["Insert"]
        >;
      };

      industries: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          highlights: string[];
          sort_order: number;
          active: boolean;
        };
        Insert: Omit<
          Database["public"]["Tables"]["industries"]["Row"],
          "id"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["industries"]["Insert"]
        >;
      };

      tech_items: {
        Row: {
          id: string;
          name: string;
          category: string | null;
          sort_order: number;
        };
        Insert: Omit<
          Database["public"]["Tables"]["tech_items"]["Row"],
          "id"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["tech_items"]["Insert"]
        >;
      };

      faqs: {
        Row: {
          id: string;
          scope: "home" | "services" | "contact" | "about" | "portfolio";
          question: string;
          answer: string;
          sort_order: number;
          active: boolean;
        };
        Insert: Omit<
          Database["public"]["Tables"]["faqs"]["Row"],
          "id"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["faqs"]["Insert"]>;
      };

      page_sections: {
        Row: {
          id: string;
          page_slug: string;
          section_key: string;
          eyebrow: string | null;
          title: string | null;
          description: string | null;
          body: Json | null;
          sort_order: number;
        };
        Insert: Omit<
          Database["public"]["Tables"]["page_sections"]["Row"],
          "id"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["page_sections"]["Insert"]
        >;
      };

      site_secrets: {
        Row: {
          id: 1;
          resend_api_key: string | null;
          resend_from_email: string | null;
          contact_form_to_email: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["site_secrets"]["Row"]> & {
          id?: 1;
        };
        Update: Partial<Database["public"]["Tables"]["site_secrets"]["Row"]>;
      };

      messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          service: string | null;
          message: string;
          ip_address: string | null;
          user_agent: string | null;
          is_read: boolean;
          is_archived: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["messages"]["Row"],
          "id" | "created_at" | "is_read" | "is_archived"
        > & {
          id?: string;
          is_read?: boolean;
          is_archived?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Row"]>;
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
  };
};
