import api from './api';

/**
 * Certificate service
 */

export const checkEligibility = async (scoreId) => {
    const response = await api.get(`/certificates/check/${scoreId}`);
    return response.data;
};

export const generateCertificate = async (scoreId) => {
    const response = await api.post('/certificates/generate',
        { scoreId },
        { responseType: 'blob' }
    );
    return response.data;
};

export const getUserCertificates = async () => {
    const response = await api.get('/certificates/user');
    return response.data;
};

// Helper to download certificate
export const downloadCertificate = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
};
