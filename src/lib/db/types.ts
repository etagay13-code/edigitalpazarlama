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
        Relationships: [];
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
        Relationships: [];
      };

      services: {
        Row: {
          locale: "tr" | "en" | "de";
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
        Relationships: [];
      };

      service_process_steps: {
        Row: {
          locale: "tr" | "en" | "de";
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
        Relationships: [];
      };

      service_faqs: {
        Row: {
          locale: "tr" | "en" | "de";
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
        Relationships: [];
      };

      portfolio_projects: {
        Row: {
          locale: "tr" | "en" | "de";
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
          /** Detay sayfası içeriği (bkz. lib/blog/case-study.ts CaseStudy) */
          case_study: Json | null;
          meta_title: string | null;
          meta_desc: string | null;
          cover_url: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["portfolio_projects"]["Row"],
          "id" | "created_at" | "case_study" | "meta_title" | "meta_desc" | "cover_url"
        > & {
          id?: string;
          case_study?: Json | null;
          meta_title?: string | null;
          meta_desc?: string | null;
          cover_url?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["portfolio_projects"]["Insert"]
        >;
        Relationships: [];
      };

      testimonials: {
        Row: {
          locale: "tr" | "en" | "de";
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
        Relationships: [];
      };

      team_members: {
        Row: {
          locale: "tr" | "en" | "de";
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
        Relationships: [];
      };

      timeline_events: {
        Row: {
          locale: "tr" | "en" | "de";
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
        Relationships: [];
      };

      industries: {
        Row: {
          locale: "tr" | "en" | "de";
          id: string;
          name: string;
          description: string | null;
          highlights: string[];
          sort_order: number;
          active: boolean;
          /** Kendi sayfası olan sektörlerde dolu */
          slug: string | null;
          /** portfolio_projects.category ile eşleşir */
          category: string | null;
          meta_title: string | null;
          meta_desc: string | null;
          body: Json | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["industries"]["Row"],
          "id" | "slug" | "category" | "meta_title" | "meta_desc" | "body"
        > & {
          id?: string;
          slug?: string | null;
          category?: string | null;
          meta_title?: string | null;
          meta_desc?: string | null;
          body?: Json | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["industries"]["Insert"]
        >;
        Relationships: [];
      };

      tech_items: {
        Row: {
          locale: "tr" | "en" | "de";
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
        Relationships: [];
      };

      faqs: {
        Row: {
          locale: "tr" | "en" | "de";
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
        Relationships: [];
      };

      page_sections: {
        Row: {
          locale: "tr" | "en" | "de";
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
        Relationships: [];
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
        Relationships: [];
      };

      site_settings_i18n: {
        Row: {
          locale: "tr" | "en" | "de";
          tagline: string | null;
          description: string | null;
          address: string | null;
          updated_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["site_settings_i18n"]["Row"]
        > & { locale: "tr" | "en" | "de" };
        Update: Partial<
          Database["public"]["Tables"]["site_settings_i18n"]["Row"]
        >;
        Relationships: [];
      };

      chat_rules: {
        Row: {
          id: string;
          locale: "tr" | "en" | "de";
          question: string;
          keywords: string[];
          answer: string;
          sort_order: number;
          active: boolean;
        };
        Insert: Omit<
          Database["public"]["Tables"]["chat_rules"]["Row"],
          "id"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["chat_rules"]["Insert"]>;
        Relationships: [];
      };

      blog_posts: {
        Row: {
          id: string;
          /** Aynı yazının üç dildeki sürümünü bağlar (hreflang grubu) */
          group_id: string;
          locale: "tr" | "en" | "de";
          slug: string;
          title: string;
          excerpt: string;
          content_html: string;
          cover_url: string | null;
          cover_alt: string | null;
          meta_title: string | null;
          meta_desc: string | null;
          tags: string[];
          reading_min: number;
          status: "draft" | "published" | "archived";
          source: "deepseek" | "manual" | "translation";
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["blog_posts"]["Row"],
          "id" | "group_id" | "created_at" | "updated_at" | "excerpt" | "tags" | "reading_min" | "status" | "source" | "published_at" | "cover_url" | "cover_alt" | "meta_title" | "meta_desc"
        > & {
          id?: string;
          group_id?: string;
          /** Yayınlama/güncelleme sırasında elle set edilir */
          updated_at?: string;
          excerpt?: string;
          tags?: string[];
          reading_min?: number;
          status?: "draft" | "published" | "archived";
          source?: "deepseek" | "manual" | "translation";
          published_at?: string | null;
          cover_url?: string | null;
          cover_alt?: string | null;
          meta_title?: string | null;
          meta_desc?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
        Relationships: [];
      };

      blog_topics: {
        Row: {
          id: string;
          topic: string;
          keyword: string | null;
          priority: number;
          used_at: string | null;
          post_id: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["blog_topics"]["Row"],
          "id" | "created_at" | "keyword" | "priority" | "used_at" | "post_id"
        > & {
          id?: string;
          keyword?: string | null;
          priority?: number;
          used_at?: string | null;
          post_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["blog_topics"]["Insert"]>;
        Relationships: [];
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
          form_type: "contact" | "audit";
          payload: Json | null;
          locale: string | null;
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
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
  };
};
