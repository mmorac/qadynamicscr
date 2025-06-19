import axios from 'axios';

export async function getAccessToken(): Promise<string> {
  const clientId: string = process.env.REACT_APP_CLIENT_ID || '';
  const clientSecret: string = process.env.REACT_APP_CLIENT_SECRET || '';
  const tenantId: string = process.env.REACT_APP_TENANT_ID || '';
  try {
    const url = `https://qadynamicscrapi-g3degpcrf8ffbbas.canadacentral-01.azurewebsites.net/api/v1/azure/token`;
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Axios error al obtener el token:',
        error.response?.data || error.message,
      );
      throw new Error(error.response?.data?.error_description || error.message);
    } else {
      console.error('Error al obtener el token:', error);
      throw error;
    }
  }
}