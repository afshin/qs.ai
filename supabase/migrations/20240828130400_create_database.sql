create type "public"."resource_type" as enum ('environment', 'project', 'datasource');

create type "public"."role_type" as enum ('viewer', 'owner');

create table "public"."environment_lock" (
    "uid" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "version" text not null default '1.0.0'::text,
    "environment_uid" uuid,
    "definition" jsonb,
    "lockfile" jsonb
);


alter table "public"."environment_lock" enable row level security;

create table "public"."environments" (
    "uid" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "content" jsonb
);


alter table "public"."environments" enable row level security;

create table "public"."permission" (
    "user_uid" uuid not null default gen_random_uuid(),
    "resource_uid" uuid not null default gen_random_uuid(),
    "resource_type" resource_type not null,
    "role" role_type not null
);


alter table "public"."permission" enable row level security;

create table "public"."projects" (
    "uid" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "env_version" uuid,
    "content" jsonb,
    "name" text default 'Untitled project'::text,
    "description" text
);


alter table "public"."projects" enable row level security;

create table "public"."resources" (
    "uid" uuid not null default gen_random_uuid(),
    "public" boolean not null default false,
    "resource_type" resource_type
);


alter table "public"."resources" enable row level security;

CREATE UNIQUE INDEX environment_lock_pkey ON public.environment_lock USING btree (uid);

CREATE UNIQUE INDEX environments_pkey ON public.environments USING btree (uid);

CREATE UNIQUE INDEX permission_pkey ON public.permission USING btree (user_uid, resource_uid);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (uid);

CREATE UNIQUE INDEX resources_pkey ON public.resources USING btree (uid);

alter table "public"."environment_lock" add constraint "environment_lock_pkey" PRIMARY KEY using index "environment_lock_pkey";

alter table "public"."environments" add constraint "environments_pkey" PRIMARY KEY using index "environments_pkey";

alter table "public"."permission" add constraint "permission_pkey" PRIMARY KEY using index "permission_pkey";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."resources" add constraint "resources_pkey" PRIMARY KEY using index "resources_pkey";

alter table "public"."environment_lock" add constraint "environment_lock_environment_uid_fkey" FOREIGN KEY (environment_uid) REFERENCES environments(uid) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."environment_lock" validate constraint "environment_lock_environment_uid_fkey";

alter table "public"."environments" add constraint "environments_uid_fkey" FOREIGN KEY (uid) REFERENCES resources(uid) ON DELETE CASCADE not valid;

alter table "public"."environments" validate constraint "environments_uid_fkey";

alter table "public"."permission" add constraint "permission_resource_uid_fkey" FOREIGN KEY (resource_uid) REFERENCES resources(uid) ON DELETE CASCADE not valid;

alter table "public"."permission" validate constraint "permission_resource_uid_fkey";

alter table "public"."permission" add constraint "permission_user_uid_fkey" FOREIGN KEY (user_uid) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."permission" validate constraint "permission_user_uid_fkey";

alter table "public"."projects" add constraint "projects_env_version_fkey" FOREIGN KEY (env_version) REFERENCES environment_lock(uid) ON UPDATE CASCADE not valid;

alter table "public"."projects" validate constraint "projects_env_version_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_env_in_resource()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    INSERT INTO resources (uid, public, resource_type) VALUES (NEW.uid, false, 'environment');
    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.add_project_in_resource()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    INSERT INTO resources (uid, public, resource_type) VALUES (NEW.uid, false, 'project');
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

CREATE OR REPLACE FUNCTION public.delete_project_in_resource()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    DELETE FROM resources WHERE uid = OLD.uid;
    RETURN OLD;
END;$function$
;


grant delete on table "public"."environment_lock" to "service_role";

grant insert on table "public"."environment_lock" to "service_role";

grant references on table "public"."environment_lock" to "service_role";

grant select on table "public"."environment_lock" to "service_role";

grant trigger on table "public"."environment_lock" to "service_role";

grant truncate on table "public"."environment_lock" to "service_role";

grant update on table "public"."environment_lock" to "service_role";

grant delete on table "public"."environments" to "service_role";

grant insert on table "public"."environments" to "service_role";

grant references on table "public"."environments" to "service_role";

grant select on table "public"."environments" to "service_role";

grant trigger on table "public"."environments" to "service_role";

grant truncate on table "public"."environments" to "service_role";

grant update on table "public"."environments" to "service_role";

grant delete on table "public"."permission" to "service_role";

grant insert on table "public"."permission" to "service_role";

grant references on table "public"."permission" to "service_role";

grant select on table "public"."permission" to "service_role";

grant trigger on table "public"."permission" to "service_role";

grant truncate on table "public"."permission" to "service_role";

grant update on table "public"."permission" to "service_role";


grant delete on table "public"."projects" to "service_role";

grant insert on table "public"."projects" to "service_role";

grant references on table "public"."projects" to "service_role";

grant select on table "public"."projects" to "service_role";

grant trigger on table "public"."projects" to "service_role";

grant truncate on table "public"."projects" to "service_role";

grant update on table "public"."projects" to "service_role";

grant delete on table "public"."resources" to "service_role";

grant insert on table "public"."resources" to "service_role";

grant references on table "public"."resources" to "service_role";

grant select on table "public"."resources" to "service_role";

grant trigger on table "public"."resources" to "service_role";

grant truncate on table "public"."resources" to "service_role";

grant update on table "public"."resources" to "service_role";

create policy "admin-access"
on "public"."environment_lock"
as restrictive
for all
to service_role
using (true);


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
on "public"."projects"
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

CREATE TRIGGER add_project_in_resource_before_insert BEFORE INSERT ON public.projects FOR EACH ROW EXECUTE FUNCTION add_project_in_resource();

CREATE TRIGGER delete_resource_after_project AFTER DELETE ON public.projects FOR EACH ROW EXECUTE FUNCTION delete_project_in_resource();



