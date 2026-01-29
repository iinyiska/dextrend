import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl) {
    console.warn('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for site settings
export interface SiteSettings {
    id: number;
    logo_url: string;
    logo_text: string;
    site_title: string;
    site_description: string;
    primary_color: string;
    secondary_color: string;
    header_bg_color: string;
    created_at: string;
    updated_at: string;
}

export interface Banner {
    id: number;
    title: string;
    description: string;
    image_url: string;
    link_url: string;
    is_active: boolean;
    position: 'hero' | 'sidebar' | 'footer';
    order_index: number;
    created_at: string;
}

export interface Ad {
    id: number;
    name: string;
    ad_code: string; // HTML/Script code for ad
    position: 'header' | 'sidebar' | 'between_content' | 'footer' | 'popup';
    is_active: boolean;
    order_index: number;
    created_at: string;
}

export interface PromotedToken {
    id: number;
    chain_id: string;
    pair_address: string;
    token_name: string;
    token_symbol: string;
    logo_url: string;
    is_active: boolean;
    order_index: number;
    created_at: string;
}

// Fetch site settings
export async function getSiteSettings(): Promise<SiteSettings | null> {
    const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

    if (error) {
        console.error('Error fetching site settings:', error);
        return null;
    }
    return data;
}

// Fetch active banners
export async function getBanners(position?: string): Promise<Banner[]> {
    let query = supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

    if (position) {
        query = query.eq('position', position);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching banners:', error);
        return [];
    }
    return data || [];
}

// Fetch active ads
export async function getAds(position?: string): Promise<Ad[]> {
    let query = supabase
        .from('ads')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

    if (position) {
        query = query.eq('position', position);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching ads:', error);
        return [];
    }
    return data || [];
}

// Fetch promoted tokens
export async function getPromotedTokens(): Promise<PromotedToken[]> {
    const { data, error } = await supabase
        .from('promoted_tokens')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching promoted tokens:', error);
        return [];
    }
    return data || [];
}

// Admin functions (require service role key - use in API routes only)
export async function updateSiteSettings(settings: Partial<SiteSettings>) {
    const { data, error } = await supabase
        .from('site_settings')
        .update({ ...settings, updated_at: new Date().toISOString() })
        .eq('id', 1)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function createBanner(banner: Omit<Banner, 'id' | 'created_at'>) {
    const { data, error } = await supabase
        .from('banners')
        .insert(banner)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateBanner(id: number, banner: Partial<Banner>) {
    const { data, error } = await supabase
        .from('banners')
        .update(banner)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteBanner(id: number) {
    const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

export async function createAd(ad: Omit<Ad, 'id' | 'created_at'>) {
    const { data, error } = await supabase
        .from('ads')
        .insert(ad)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateAd(id: number, ad: Partial<Ad>) {
    const { data, error } = await supabase
        .from('ads')
        .update(ad)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteAd(id: number) {
    const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id);

    if (error) throw error;
}
