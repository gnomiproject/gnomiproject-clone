
-- Create or replace the function to check if a user has access to a level3 report
CREATE OR REPLACE FUNCTION public.has_level3_report_access(archetype_id text)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- By default, allow access to level3 reports (insights level)
  RETURN TRUE;
END;
$function$;
