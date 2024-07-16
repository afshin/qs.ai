set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_env_in_resource()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    INSERT INTO resources(uid) VALUES (NEW.uid);
    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.delete_env_in_resources()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    DELETE FROM resources WHERE uid = OLD.uid;
    RETURN OLD;
END;$function$
;

create policy "admin-access"
on "public"."environments"
as restrictive
for all
to service_role
using (true);


create policy "admin-access"
on "public"."permission"
as restrictive
for all
to service_role
using (true);


create policy "admin-access"
on "public"."resources"
as restrictive
for all
to service_role
using (true);


CREATE TRIGGER add_env_in_resource_before_insert BEFORE INSERT ON public.environments FOR EACH ROW EXECUTE FUNCTION add_env_in_resource();

CREATE TRIGGER delete_resource_after_env AFTER DELETE ON public.environments FOR EACH ROW EXECUTE FUNCTION delete_env_in_resources();



