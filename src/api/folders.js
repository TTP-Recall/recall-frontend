// api/folders.js — same pattern as api/tasks.js, swapped for the folders resource.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// READ ALL — GET /api/folders. Returns an array of the logged-in user's folders.
export async function getFolders() {
  const res = await fetch(`${BASE_URL}/api/folders`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Could not load folders (${res.status})`);
  }

  return res.json();
}

// READ ONE — GET /api/folders/:id. Returns a folder with its notes included.
export async function getFolder(id) {
  const res = await fetch(`${BASE_URL}/api/folders/${id}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Could not load folder ${id} (${res.status})`);
  }

  return res.json();
}

// DELETE — DELETE /api/folders/:id.
export async function deleteFolder(id) {
  const res = await fetch(`${BASE_URL}/api/folders/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Could not delete folder ${id} (${res.status})`);
  }

  return null;
}