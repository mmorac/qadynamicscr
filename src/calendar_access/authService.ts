import axios from 'axios';

export async function getAccessToken(): Promise<string> {
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