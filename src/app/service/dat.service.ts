// Exemplo para dat.service.ts
export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch('http://localhost:8080/reader', {
    method: 'POST',
    body: formData,
  });

  // Retorna o corpo da resposta como JSON
  return response.json();
}