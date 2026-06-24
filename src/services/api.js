// API base URL is read from environment variables.
// Create a `.env` file in the resume-screening/ folder with:
//   REACT_APP_API_URL=http://localhost:8000
// Any var starting with REACT_APP_ is exposed to the browser by CRA.
// IMPORTANT: restart `npm start` after editing `.env` — CRA inlines env vars at build time.
const BASE_URL =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_BACKEND_URL ||
  "https://ai-resume-screening-interview-assistant.onrender.com";

// Internal helper: fetch with consistent error handling and DevTools visibility.
async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  // eslint-disable-next-line no-console
  console.debug("[api]", options.method || "GET", url);
  let response;
  try {
    response = await fetch(url, options);
  } catch (networkErr) {
    // Network-level failure (CORS, server down, DNS, etc.)
    throw new Error(
      `Network error — could not reach ${BASE_URL}. ` +
        `Is the backend running? (${networkErr.message})`
    );
  }

  // Try to parse JSON regardless of status
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const detail =
      (data && (data.detail || data.message || data.error)) ||
      `HTTP ${response.status} ${response.statusText}`;
    throw new Error(detail);
  }

  return data;
}

export const screenResume = async (candidateName, candidateEmail, jobRole, jobDescription, file) => {
  const formData = new FormData();
  formData.append("candidate_name", candidateName);
  formData.append("candidate_email", candidateEmail);
  formData.append("job_role", jobRole);
  formData.append("job_description", jobDescription);
  formData.append("file", file);

  return apiFetch("/api/resumes/upload", {
    method: "POST",
    body: formData,
  });
};

export const getCandidates = async () => {
  return apiFetch("/api/candidates");
};

export const getDashboardStats = async () => {
  return apiFetch("/api/dashboard-stats");
};

export const uploadResumes = async (files, jobDescription) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  formData.append("job_description", jobDescription);
  return apiFetch("/api/resumes/upload", {
    method: "POST",
    body: formData,
  });
};

export const startInterview = async (candidateName, jobRole) => {
  return apiFetch("/api/interview/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      candidate_name: candidateName,
      job_role: jobRole,
    }),
  });
};

export const submitAnswer = async (question, answer, jobRole) => {
  return apiFetch("/api/interview/answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: question,
      answer: answer,
      job_role: jobRole,
    }),
  });
};

export const deleteCandidate = async (candidateId) => {
  return apiFetch(`/api/resumes/${candidateId}`, {
    method: "DELETE",
  });
};

export const getResumeViewUrl = (candidateId) => {
  return `${BASE_URL}/api/resumes/view/${candidateId}`;
};

export const getResumeDownloadUrl = (candidateId) => {
  return `${BASE_URL}/api/resumes/download/${candidateId}`;
};

export const signup = async (name, email, password) => {
  return apiFetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
};

export const login = async (email, password) => {
  return apiFetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
};

export const bulkUploadResumes = async (candidateNames, jobRole, jobDescription, files) => {
  const formData = new FormData();
  formData.append("candidate_names", candidateNames);
  formData.append("job_role", jobRole);
  formData.append("job_description", jobDescription);
  files.forEach((file) => formData.append("files", file));

  return apiFetch("/api/resumes/bulk-upload", {
    method: "POST",
    body: formData,
  });
};

export const createJob = async (title, description) => {
  return apiFetch("/api/jobs/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
};

export const getAllJobs = async () => {
  return apiFetch("/api/jobs/all");
};

export const getJob = async (jobId) => {
  return apiFetch(`/api/jobs/${jobId}`);
};

export const submitApplication = async (name, email, phone, jobId, file) => {
  const formData = new FormData();
  formData.append("candidate_name", name);
  formData.append("candidate_email", email);
  formData.append("candidate_phone", phone);
  formData.append("job_id", jobId);
  formData.append("file", file);

  return apiFetch("/api/resumes/apply", {
    method: "POST",
    body: formData,
  });
};

export { BASE_URL };