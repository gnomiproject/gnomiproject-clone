
-- Function to increment the access count for a report request and update the last_accessed timestamp
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
