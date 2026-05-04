import { supabase } from './supabaseClient';

export const trackEvent = async (eventName, properties = {}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.warn('Analytics: No authenticated user, skipping event tracking');
      return;
    }

    const { error } = await supabase.from('events').insert({
      user_id: user.id,
      event_name: eventName,
      properties,
    });

    if (error) {
      console.error('Analytics tracking error:', error);
    }
  } catch (err) {
    console.error('Analytics service error:', err);
    // 静默失败，不影响主流程
  }
};
