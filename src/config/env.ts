export const getEnv = (key: string) => {
  const Config = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT || 3000),
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_HOST: process.env.DB_HOST,
    DB_PORT: Number(process.env.DB_PORT || 5432),
    DB_NAME: process.env.DB_NAME,
    DB_SSL: process.env.DB_SSL === 'true',
  };

  return Config[key];
};
