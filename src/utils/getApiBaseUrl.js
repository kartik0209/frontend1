export const getApiBaseUrl = () => {
  // FULL DOMAIN → example: company1.afftrex.org
  const host = window.location.hostname;

  // Extract subdomain
  const parts = host.split(".");

  let sub = "afftrex"; // default

  if (parts.length > 2) {
    sub = parts[0]; // company1
  }

  // Build dynamic API URL
//   return `https://${sub}.afftrex.org/api`;

  return `https://api.afftrex.org/api`;
};
