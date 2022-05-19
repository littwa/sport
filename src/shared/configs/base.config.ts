export default () => ({
  nodemailerTransporterConfig: {
    transport: {
      host: 'smtp.gmail.com',
      secure: false,
      // port: 465,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    },
    defaults: {
      from: '"No Reply" <noreply@example.com>',
    },
  },
  jwtExpires: {
    _30days: {
      exp: '30d',
      expIncrement: 2592000000,
    },
    _60Seconds: {
      exp: '60s',
      expIncrement: 60000,
    },
    _300Seconds: {
      exp: '300s',
      expIncrement: 300000,
    },
  },
});
