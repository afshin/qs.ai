module.exports = {
  rewrites() {
    return [
      {
        source: '/project/:id([^/]+)/:path([^/]+(?:/[^/]+)*)',
        destination: `${process.env.NEXT_PUBLIC_JUPYTERLITE_URL || '{@{NEXT_PUBLIC_JUPYTERLITE_URL}@}'}/:path`
      }
    ];
  },
  redirects() {
    return [
      {
        source: '/project/:id/',
        destination: '/project/:id/lab/index.html',
        permanent: true
      },
      {
        source: '/project/:id',
        destination: '/project/:id/lab/index.html',
        permanent: true
      }
    ];
  }
};
