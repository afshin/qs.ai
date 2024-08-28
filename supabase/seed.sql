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
    'd8e74a76-a76c-4049-b8cc-48b8d6f4840c',
    '2023-02-25T10:06:34.441Z',
    '2023-02-25T10:06:34.441Z',
    '{"name": "Python Scientific Stack", "latest": "2.0.0", "description": "Default JupyterLite deployment proposed by QS.AI. It contains the popular Python scientific libraries like Numpy, Scipy,... as well as vizualization tools."}'
  );

INSERT INTO
  public.permission (user_uid, resource_uid, resource_type, role)
VALUES
  (
    '662adb80-2949-46fc-8cad-a3cb156ede6e',
    'd8e74a76-a76c-4049-b8cc-48b8d6f4840c',
    'environment',
    'owner'
  );

INSERT INTO
  public.environment_lock (uid, created_at, version, environment_uid, definition, lockfile)
VALUES
  (
    'f7ccd511-8fa8-46fc-af0c-50b77577f900',
    '2023-02-25T10:06:34.441Z',
    '1.0.0',
    'd8e74a76-a76c-4049-b8cc-48b8d6f4840c',
    '{"buildEnv": "name: build-env\n\nchannels:\n  - conda-forge\n  - conda-forge/label/jupyterlite_core_alpha\n\ndependencies:\n  - python=3.11\n  - pip\n  - jupyterlite-core >=0.3.0,<0.4.0\n  - jupyterlite-xeus>=0.1.2,<0.2\n  - jupyterlab >=4.0.5,<5\n  - empack >=3.1.0", "kernelEnv": "name: xeus-python-kernel\nchannels:\n  - https://repo.mamba.pm/emscripten-forge\n  - conda-forge\ndependencies:\n  - xeus-python", "dependencies": []}',
    '{}'
  );

INSERT INTO
  public.environment_lock (uid, created_at, version, environment_uid, definition, lockfile)
VALUES
  (
    '67d0c83e-0d02-4d01-aedd-dbc61b884b10',
    '2024-02-25T10:06:34.441Z',
    '2.0.0',
    'd8e74a76-a76c-4049-b8cc-48b8d6f4840c',
    '{"buildEnv": "name: build-env\n\nchannels:\n  - conda-forge\n  - conda-forge/label/jupyterlite_core_alpha\n\ndependencies:\n  - python=3.11\n  - pip\n  - jupyterlite-core >=0.3.0,<0.4.0\n  - jupyterlite-xeus>=0.1.2,<0.2\n  - jupyterlab >=4.0.5,<5\n  - empack >=3.1.0", "kernelEnv": "name: xeus-python-kernel\nchannels:\n  - https://repo.mamba.pm/emscripten-forge\n  - conda-forge\ndependencies:\n  - xeus-python\n  - bqplot", "dependencies": []}',
    '{}'
  );

UPDATE resources
  SET public = 'True'
WHERE uid = 'd8e74a76-a76c-4049-b8cc-48b8d6f4840c';

INSERT INTO
  public.environments (uid, created_at, updated_at, content)
VALUES
  (
    '441fb991-b39a-4fb6-a5c4-e62d2a0954f8',
    '2023-02-25T10:06:34.441Z',
    '2023-02-25T10:06:34.441Z',
    '{"name": "Jupyter Robotic stack ", "latest": "1.0.0", "description": "Default JupyterLite deployment proposed by QS.AI."}'
  );

INSERT INTO
  public.permission (user_uid, resource_uid, resource_type, role)
VALUES
  (
    '662adb80-2949-46fc-8cad-a3cb156ede6e',
    '441fb991-b39a-4fb6-a5c4-e62d2a0954f8',
    'environment',
    'owner'
  );

INSERT INTO
  public.environment_lock (uid, created_at, version, environment_uid, definition, lockfile)
VALUES
  (
    '5056e4bc-7ca8-4ce3-af3c-ed093b9dc456',
    '2023-02-25T10:06:34.441Z',
    '1.0.0',
    '441fb991-b39a-4fb6-a5c4-e62d2a0954f8',
    '{"buildEnv": "name: build-env\n\nchannels:\n  - conda-forge\n  - conda-forge/label/jupyterlite_core_alpha\n\ndependencies:\n  - python=3.11\n  - pip\n  - jupyterlite-core >=0.3.0,<0.4.0\n  - jupyterlite-xeus>=0.1.2,<0.2\n  - jupyterlab >=4.0.5,<5\n  - empack >=3.1.0", "kernelEnv": "name: xeus-python-kernel\nchannels:\n  - https://repo.mamba.pm/emscripten-forge\n  - conda-forge\ndependencies:\n  - xeus-python", "dependencies": []}',
    '{}'
  );

UPDATE resources
  SET public = 'True'
WHERE uid = '441fb991-b39a-4fb6-a5c4-e62d2a0954f8';