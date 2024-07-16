create type role_type as enum ('viewer', 'owner');

create type resource_type as enum ('environment');

create table
    "public"."environments" (
        "uid" uuid not null default gen_random_uuid (),
        "created_at" timestamp
        with
            time zone not null default now (),
            "updated_at" timestamp
        with
            time zone not null default now (),
            "content" jsonb
    );

alter table "public"."environments" enable row level security;

create table
    "public"."permission" (
        "user_uid" uuid not null default gen_random_uuid (),
        "resource_uid" uuid not null default gen_random_uuid (),
        "resource_type" resource_type not null,
        "role" role_type not null
    );

alter table "public"."permission" enable row level security;

create table
    "public"."resources" ("uid" uuid not null default gen_random_uuid ());

alter table "public"."resources" enable row level security;

CREATE UNIQUE INDEX environments_pkey ON public.environments USING btree (uid);

CREATE UNIQUE INDEX permission_pkey ON public.permission USING btree (user_uid, resource_uid);

CREATE UNIQUE INDEX resources_pkey ON public.resources USING btree (uid);

alter table "public"."environments" add constraint "environments_pkey" PRIMARY KEY using index "environments_pkey";

alter table "public"."permission" add constraint "permission_pkey" PRIMARY KEY using index "permission_pkey";

alter table "public"."resources" add constraint "resources_pkey" PRIMARY KEY using index "resources_pkey";

alter table "public"."environments" add constraint "environments_uid_fkey" FOREIGN KEY (uid) REFERENCES resources (uid) ON DELETE CASCADE not valid;

alter table "public"."environments" validate constraint "environments_uid_fkey";

alter table "public"."permission" add constraint "permission_resource_uid_fkey" FOREIGN KEY (resource_uid) REFERENCES resources (uid) ON DELETE CASCADE not valid;

alter table "public"."permission" validate constraint "permission_resource_uid_fkey";

alter table "public"."permission" add constraint "permission_user_uid_fkey" FOREIGN KEY (user_uid) REFERENCES users (id) ON DELETE CASCADE not valid;

alter table "public"."permission" validate constraint "permission_user_uid_fkey";

grant delete on table "public"."environments" to "service_role";

grant insert on table "public"."environments" to "service_role";

grant references on table "public"."environments" to "service_role";

grant
select
    on table "public"."environments" to "service_role";

grant trigger on table "public"."environments" to "service_role";

grant truncate on table "public"."environments" to "service_role";

grant
update on table "public"."environments" to "service_role";

grant delete on table "public"."permission" to "service_role";

grant insert on table "public"."permission" to "service_role";

grant references on table "public"."permission" to "service_role";

grant
select
    on table "public"."permission" to "service_role";

grant trigger on table "public"."permission" to "service_role";

grant truncate on table "public"."permission" to "service_role";

grant
update on table "public"."permission" to "service_role";

grant delete on table "public"."resources" to "service_role";

grant insert on table "public"."resources" to "service_role";

grant references on table "public"."resources" to "service_role";

grant
select
    on table "public"."resources" to "service_role";

grant trigger on table "public"."resources" to "service_role";

grant truncate on table "public"."resources" to "service_role";

grant
update on table "public"."resources" to "service_role";