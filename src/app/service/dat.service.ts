

export const uploadFile = async (file: File): Promise<number> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('http://localhost:8080/reader', {
        method: 'POST',
        body: formData,
    });

    const apiResponse: any  = await response.json();

    return apiResponse.code;
}