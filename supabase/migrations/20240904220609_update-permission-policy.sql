create policy "allow-authenticated-read"
on "public"."permission"
as permissive
for select
to authenticated
using (true);




