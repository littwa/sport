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
  jwtExpires30days: {
    exp: '30d',
    expIncrement: 2592000000,
  },
  jwtExpires60Seconds: {
    exp: '60s',
    expIncrement: 60000,
  },
  jwtExpires300Seconds: {
    exp: '300s',
    expIncrement: 300000,
  },
});
