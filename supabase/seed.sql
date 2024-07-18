INSERT INTO
  auth.users (
    id,
    instance_id,
    email,
    email_confirmed_at,
    encrypted_password,
    aud,
    "role",
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    last_sign_in_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
VALUES
  (
    'd9c444f1-4e91-4abb-b4c7-1d18318990e9',
    '00000000-0000-0000-0000-000000000000',
    'user@example.com',
    '2023-02-24T19:57:41.849Z',
    '$2a$10$uFKPCIwHTZMrYF2lmfR1TOsJrNxm5rhJ1PQ/NrBwu7YkC2eXBpMZy',
    'authenticated',
    'authenticated',
    '{"provider":"email","providers":["email"]}',
    '{}',
    '2023-02-24T19:57:41.849Z',
    '2023-02-24T19:57:41.849Z',
    '2023-02-24T19:57:41.849Z',
    '',
    '',
    '',
    ''
  ),
  (
    '662adb80-2949-46fc-8cad-a3cb156ede6e',
    '00000000-0000-0000-0000-000000000000',
    'admin@example.com',
    '2023-02-25T10:06:34.441Z',
    '$2a$10$uFKPCIwHTZMrYF2lmfR1TOsJrNxm5rhJ1PQ/NrBwu7YkC2eXBpMZy',
    'authenticated',
    'authenticated',
    '{"provider":"email","providers":["email"]}',
    '{}',
    '2023-02-25T10:06:34.441Z',
    '2023-02-25T10:06:34.441Z',
    '2023-02-25T10:06:34.441Z',
    '',
    '',
    '',
    ''
  );

INSERT INTO
  auth.identities (
    id,
    user_id,
    provider_id,
    "provider",
    identity_data,
    created_at,
    updated_at,
    last_sign_in_at
  )
VALUES
  (
    'd9c444f1-4e91-4abb-b4c7-1d18318990e9',
    'd9c444f1-4e91-4abb-b4c7-1d18318990e9',
    'd9c444f1-4e91-4abb-b4c7-1d18318990e9',
    'email',
    '{"sub":"d9c444f1-4e91-4abb-b4c7-1d18318990e9","email":"user@example.com"}',
    '2023-02-24T19:57:41.849Z',
    '2023-02-24T19:57:41.849Z',
    '2023-02-24T19:57:41.849Z'
  ),
  (
    '662adb80-2949-46fc-8cad-a3cb156ede6e',
    '662adb80-2949-46fc-8cad-a3cb156ede6e',
    '662adb80-2949-46fc-8cad-a3cb156ede6e',
    'email',
    '{"sub":"662adb80-2949-46fc-8cad-a3cb156ede6e","email":"admin@example.com"}',
    '2023-02-25T10:06:34.441Z',
    '2023-02-25T10:06:34.441Z',
    '2023-02-25T10:06:34.441Z'
  );

INSERT INTO
  public.environments (uid, created_at, updated_at, content)
VALUES
  (
    'd9c444f1-4e91-4abb-b4c7-1d18318990e9',
    '2023-02-25T10:06:34.441Z',
    '2023-02-25T10:06:34.441Z',
    '{"name":"Default project", "description": "Default JupyterLite deployment proposed by QS.AI. It contains the popular Python scientific libraries like Numpy, Scipy,... as well as vizualization tools.", "shortDesc":"Default JupyterLite deployment", "dependencies": ["numpy"], "lockfile":""}'
  );

INSERT INTO
  public.permission (user_uid, resource_uid, resource_type, role)
VALUES
  (
    '662adb80-2949-46fc-8cad-a3cb156ede6e',
    'd9c444f1-4e91-4abb-b4c7-1d18318990e9',
    'environment',
    'owner'
  );