import { INTERVIEW_API_END_POINT } from "../../../utils/constant";

const BASE = INTERVIEW_API_END_POINT;

async function handleResponse(res) {
  const contentType = res.headers.get("content-type");
  if (!res.ok) {
    let err = res.statusText;
    try {
      if (contentType && contentType.includes("application/json")) {
        const body = await res.json();
        err = body.error || JSON.stringify(body);
      } else {
        err = await res.text();
      }
    } catch (e) {
      /* ignore */
    }
    throw new Error(err || `HTTP error ${res.status}`);
  }

  if (contentType && contentType.includes("application/json"))
    return res.json();
  return res.text();
}

export async function startInterview(data) {
  const res = await fetch(`${BASE}/start-interview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function sendAnswer(data) {
  const res = await fetch(`${BASE}/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function getNextQuestion(data) {
  const res = await fetch(`${BASE}/next`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function getSummary(interviewId) {
  const res = await fetch(`${BASE}/summary/${interviewId}`);
  return handleResponse(res);
}

export async function finishInterview(data) {
  const res = await fetch(`${BASE}/finish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}
