export type User = {
  id?: number;
  name: string;
  age: number;
};

export type DocumentItem = {
  id?: number;
  title: string;
  content: string;
  user_id: number;
};

const BASE_URL = "http://127.0.0.1:8000";


async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getUsers(): Promise<User[]> {
  return request<User[]>("/users");
}

export function getUser(userId: number): Promise<User> {
  return request<User>(`/users/${userId}`);
}

export function createUser(payload: User): Promise<User> {
  return request<User>("/users", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getDocuments(params: {
  skip: number;
  limit: number;
  title?: string;
  user_id?: number;
}): Promise<DocumentItem[]> {
  const query = new URLSearchParams();
  query.set("skip", String(params.skip));
  query.set("limit", String(params.limit));
  if (params.title) query.set("title", params.title);
  if (params.user_id) query.set("user_id", String(params.user_id));
  return request<DocumentItem[]>(`/documents?${query.toString()}`);
}

export function createDocument(payload: DocumentItem): Promise<DocumentItem> {
  return request<DocumentItem>("/documents", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getDocument(docId: number): Promise<DocumentItem> {
  return request<DocumentItem>(`/documents/${docId}`);
}
