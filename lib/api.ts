const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function analysePaper(file: File) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail || "Failed to analyse the PDF."
    );
  }

  return response.json();
}

export async function askPaper(
  file: File,
  question: string
) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("question", question);

  const response = await fetch(`${API_URL}/api/ask`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail || "Failed to answer the question."
    );
  }

  return response.json();
}