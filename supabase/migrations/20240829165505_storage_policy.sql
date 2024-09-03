create policy "Project access 22l6y_0"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'qsai'::text) AND (EXISTS ( SELECT 1
   FROM permission
  WHERE ((permission.user_uid = auth.uid()) AND ((permission.resource_uid)::text = (storage.foldername(objects.name))[2]) AND (((permission.role)::text = 'owner'::text) OR ((permission.role)::text = 'viewer'::text)))))));


create policy "Project access 22l6y_1"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'qsai'::text) AND (EXISTS ( SELECT 1
   FROM permission
  WHERE ((permission.user_uid = auth.uid()) AND ((permission.resource_uid)::text = (storage.foldername(objects.name))[2]) AND (((permission.role)::text = 'owner'::text) OR ((permission.role)::text = 'viewer'::text)))))));


create policy "Project access 22l6y_2"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'qsai'::text) AND (EXISTS ( SELECT 1
   FROM permission
  WHERE ((permission.user_uid = auth.uid()) AND ((permission.resource_uid)::text = (storage.foldername(objects.name))[2]) AND (((permission.role)::text = 'owner'::text) OR ((permission.role)::text = 'viewer'::text)))))));


create policy "Project access 22l6y_3"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'qsai'::text) AND (EXISTS ( SELECT 1
   FROM permission
  WHERE ((permission.user_uid = auth.uid()) AND ((permission.resource_uid)::text = (storage.foldername(objects.name))[2]) AND (((permission.role)::text = 'owner'::text) OR ((permission.role)::text = 'viewer'::text)))))));




