
-- Create or replace the function to check if a user has access to a level4 report
CREATE OR REPLACE FUNCTION public.has_level4_report_access(archetype_id text)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  valid_request BOOLEAN;
BEGIN
  -- Check if there's a valid report request for this archetype
  SELECT EXISTS (
    SELECT 1 FROM public.report_requests 
    WHERE report_requests.archetype_id = has_level4_report_access.archetype_id
    AND report_requests.status = 'active'
  ) INTO valid_request;
  
  -- Return true if there's a valid request or if the special 'All_Average' data is requested
  RETURN valid_request OR has_level4_report_access.archetype_id = 'All_Average';
END;
$function$;
