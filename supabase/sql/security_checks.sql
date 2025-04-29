
-- This file contains SQL to verify and fix any remaining security issues

-- 1. Create or replace increment_report_access again with explicit search_path
CREATE OR REPLACE FUNCTION public.increment_report_access(
  p_access_token TEXT,
  p_archetype_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count INTEGER;
  updated_at TIMESTAMPTZ;
BEGIN
  -- Update the access count and last_accessed timestamp
  UPDATE public.report_requests
  SET 
    access_count = COALESCE(access_count, 0) + 1,
    last_accessed = NOW()
  WHERE 
    access_token = p_access_token 
    AND archetype_id = p_archetype_id
    AND status = 'active'
  RETURNING access_count, last_accessed INTO updated_count, updated_at;
  
  -- Return the updated values
  RETURN jsonb_build_object(
    'access_count', updated_count,
    'last_accessed', updated_at
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'error', SQLERRM,
      'error_code', SQLSTATE
    );
END;
$$;

-- 2. Ensure get_level3_report_data and get_level4_deepdive_report_data are properly secured
CREATE OR REPLACE FUNCTION public.get_level3_report_data(p_archetype_id text)
 RETURNS SETOF level3_report_data
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT * FROM public.level3_report_data 
  WHERE archetype_id = p_archetype_id OR p_archetype_id IS NULL;
$function$;

CREATE OR REPLACE FUNCTION public.get_level4_deepdive_report_data(p_archetype_id text)
 RETURNS SETOF level4_deepdive_report_data
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT * FROM public.level4_deepdive_report_data
  WHERE archetype_id = p_archetype_id OR p_archetype_id IS NULL;
$function$;

-- 3. Re-create all secure views to ensure they're defined correctly
CREATE OR REPLACE VIEW public.level3_report_data_secure AS
  SELECT * FROM public.level3_report_data 
  WHERE has_level3_report_access(archetype_id);

CREATE OR REPLACE VIEW public.level4_deepdive_report_data_secure AS
  SELECT * FROM public.level4_deepdive_report_data 
  WHERE has_level4_report_access(archetype_id);

CREATE OR REPLACE VIEW public.level3_report_secure AS
  SELECT * FROM public.level3_report_data 
  WHERE has_level3_report_access(archetype_id);

CREATE OR REPLACE VIEW public.level4_report_secure AS
  SELECT * FROM public.level4_deepdive_report_data 
  WHERE has_level4_report_access(archetype_id);
