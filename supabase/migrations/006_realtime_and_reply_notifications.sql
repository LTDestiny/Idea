-- ============================================
-- Enable realtime, add 'reply' type, update RPC
-- ============================================

-- Enable realtime for ideas and comments tables
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE ideas;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE comments;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Drop existing CHECK constraint on notifications.type and recreate with 'reply'
DO $$ DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_attribute att ON att.attrelid = con.conrelid AND att.attnum = ANY(con.conkey)
    WHERE con.conrelid = 'notifications'::regclass
      AND con.contype = 'c'
      AND att.attname = 'type'
  LOOP
    EXECUTE format('ALTER TABLE notifications DROP CONSTRAINT %I', r.conname);
  END LOOP;
END $$;

ALTER TABLE notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN ('comment', 'reply', 'join_request', 'approved', 'rejected'));

-- Update RPC to accept optional p_also_notify_user_id for reply targets
CREATE OR REPLACE FUNCTION create_idea_notification(
  p_idea_id uuid,
  p_actor_id uuid,
  p_type text,
  p_message text,
  p_target_user_id uuid DEFAULT NULL,
  p_also_notify_user_id uuid DEFAULT NULL
) RETURNS void AS $$
BEGIN
  IF p_target_user_id IS NOT NULL THEN
    -- Targeted notification (e.g., for approve/reject)
    IF p_target_user_id != p_actor_id THEN
      INSERT INTO notifications (user_id, idea_id, type, actor_id, message)
      VALUES (p_target_user_id, p_idea_id, p_type, p_actor_id, p_message);
    END IF;
  ELSE
    -- Notify all idea members + optional reply target, excluding actor
    INSERT INTO notifications (user_id, idea_id, type, actor_id, message)
    SELECT member_id, p_idea_id, p_type, p_actor_id, p_message
    FROM (
      SELECT creator_id AS member_id FROM ideas WHERE id = p_idea_id
      UNION
      SELECT requester_id AS member_id FROM join_requests
        WHERE idea_id = p_idea_id AND status = 'approved'
      UNION
      SELECT p_also_notify_user_id AS member_id
        WHERE p_also_notify_user_id IS NOT NULL
    ) members
    WHERE member_id != p_actor_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
