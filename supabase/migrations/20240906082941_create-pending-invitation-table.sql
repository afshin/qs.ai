create table "public"."pending_invitation" (
    "uid" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "resource_type" resource_type not null,
    "role" role_type not null,
    "resource_uid" uuid,
    "email" text not null
);


alter table "public"."pending_invitation" enable row level security;

alter table "public"."users" add column "email" text;

CREATE UNIQUE INDEX pending_invitation_pkey ON public.pending_invitation USING btree (uid);

alter table "public"."pending_invitation" add constraint "pending_invitation_email_resource_pkey" PRIMARY KEY ("email", "resource_uid");

alter table "public"."pending_invitation" add constraint "pending_invitation_resource_uid_fkey" FOREIGN KEY (resource_uid) REFERENCES resources(uid) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."pending_invitation" validate constraint "pending_invitation_resource_uid_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  insert into public.users (id, full_name, avatar_url, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);
  return new;
end;$function$
;

grant delete on table "public"."pending_invitation" to "service_role";

grant insert on table "public"."pending_invitation" to "service_role";

grant references on table "public"."pending_invitation" to "service_role";

grant select on table "public"."pending_invitation" to "service_role";

grant trigger on table "public"."pending_invitation" to "service_role";

grant truncate on table "public"."pending_invitation" to "service_role";

grant update on table "public"."pending_invitation" to "service_role";

create policy "admin-access"
on "public"."pending_invitation"
as permissive
for all
to service_role
using (true);




