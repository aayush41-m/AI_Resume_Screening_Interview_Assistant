const BASE_URL = "http://localhost:8000";

export const screenResume = async (candidateName, jobRole, jobDescription, file) => {
  const formData = new FormData();
  formData.append("candidate_name", candidateName);
  formData.append("job_role", jobRole);
  formData.append("job_description", jobDescription);
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/api/resumes/upload`, {
    method: "POST",
    body: formData,
  });
  return response.json();
};

export const getCandidates = async () => {
  const response = await fetch(`${BASE_URL}/api/candidates`);
  return response.json();
};

export const getDashboardStats = async () => {
  const response = await fetch(`${BASE_URL}/api/dashboard-stats`);
  return response.json();
};

export const uploadResumes = async (files, jobDescription) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  formData.append("job_description", jobDescription);
  const response = await fetch(`${BASE_URL}/api/resumes/upload`, {
    method: "POST",
    body: formData,
  });
  return response.json();
};

export const startInterview = async (candidateName, jobRole) => {
  const response = await fetch(`${BASE_URL}/api/interview/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      candidate_name: candidateName,
      job_role: jobRole,
    }),
  });
  return response.json();
};

export const submitAnswer = async (question, answer, jobRole) => {
  const response = await fetch(`${BASE_URL}/api/interview/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: question,
      answer: answer,
      job_role: jobRole,
    }),
  });
  return response.json();
};
export const deleteCandidate = async (candidateId) => {
  const response = await fetch(`${BASE_URL}/api/resumes/${candidateId}`, {
    method: "DELETE",
  });
  return response.json();
};

export const getResumeViewUrl = (candidateId) => {
  return `${BASE_URL}/api/resumes/view/${candidateId}`;
};
export const getResumeDownloadUrl = (candidateId) => {
  return `${BASE_URL}/api/resumes/download/${candidateId}`;
};
export const signup = async (name, email, password) => {
  const response = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Signup failed");
  }
  return response.json();
};

export const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Login failed");
  }
  return response.json();
};
export const bulkUploadResumes = async (candidateNames, jobRole, jobDescription, files) => {
  const formData = new FormData();
  formData.append("candidate_names", candidateNames);
  formData.append("job_role", jobRole);
  formData.append("job_description", jobDescription);
  files.forEach((file) => formData.append("files", file));

  const response = await fetch(`${BASE_URL}/api/resumes/bulk-upload`, {
    method: "POST",
    body: formData,
  });
  return response.json();
};