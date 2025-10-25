import { unstable_createFileUploadHandler } from '@remix-run/node';
import dns from 'dns';

export const uploadHandler = unstable_createFileUploadHandler({
  directory: './images/',
  file: ({ filename }) => filename,
});

async function getIPsOfApps() {
  return dns.promises.resolve6(`${process.env.FLY_APP_NAME}.internal`);
}

async function getIPsOfAppsWithoutCurrentApp() {
  const ips = await getIPsOfApps();
  return ips.filter((ip) => ip !== process.env.FLY_PRIVATE_IP);
}
