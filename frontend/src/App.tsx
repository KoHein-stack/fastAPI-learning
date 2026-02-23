import { FormEvent, useEffect, useState } from "react";
import { createDocument, createUser, DocumentItem, getDocuments, getUsers, User } from "./api";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [error, setError] = useState<string>("");

  const [userForm, setUserForm] = useState({ name: "", age: 18 });
  const [docForm, setDocForm] = useState({ title: "", content: "", user_id: 1 });
  const [filters, setFilters] = useState({ skip: 0, limit: 10, title: "", user_id: "" });

  async function loadUsers() {
    try {
      setError("");
      const data = await getUsers();
      setUsers(data);
      if (data.length > 0 && !docForm.user_id) {
        setDocForm((prev) => ({ ...prev, user_id: data[0].id ?? 1 }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    }
  }

  async function loadDocuments() {
    try {
      setError("");
      const data = await getDocuments({
        skip: filters.skip,
        limit: filters.limit,
        title: filters.title || undefined,
        user_id: filters.user_id ? Number(filters.user_id) : undefined
      });
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents");
    }
  }

  useEffect(() => {
    loadUsers();
    loadDocuments();
  }, []);

  async function handleCreateUser(e: FormEvent) {
    e.preventDefault();
    await createUser({ name: userForm.name, age: userForm.age });
    setUserForm({ name: "", age: 18 });
    await loadUsers();
  }

  async function handleCreateDocument(e: FormEvent) {
    e.preventDefault();
    await createDocument({
      title: docForm.title,
      content: docForm.content,
      user_id: Number(docForm.user_id)
    });
    setDocForm((prev) => ({ ...prev, title: "", content: "" }));
    await loadDocuments();
  }

  async function handleApplyFilters(e: FormEvent) {
    e.preventDefault();
    await loadDocuments();
  }

  return (
    <main className="page">
      <header>
        <h1>FastAPI Learning Dashboard</h1>
        <p>React + TypeScript frontend for users/documents APIs.</p>
      </header>

      {error && <div className="error">{error}</div>}

      <section className="card">
        <h2>Create User</h2>
        <form onSubmit={handleCreateUser} className="grid">
          <input
            placeholder="Name"
            value={userForm.name}
            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
            required
          />
          <input
            type="number"
            min={1}
            value={userForm.age}
            onChange={(e) => setUserForm({ ...userForm, age: Number(e.target.value) })}
            required
          />
          <button type="submit">Add User</button>
        </form>
      </section>

      <section className="card">
        <h2>Create Document</h2>
        <form onSubmit={handleCreateDocument} className="grid">
          <input
            placeholder="Title"
            value={docForm.title}
            onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
            required
          />
          <input
            placeholder="Content"
            value={docForm.content}
            onChange={(e) => setDocForm({ ...docForm, content: e.target.value })}
            required
          />
          <select
            value={docForm.user_id}
            onChange={(e) => setDocForm({ ...docForm, user_id: Number(e.target.value) })}
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.id} - {u.name}
              </option>
            ))}
          </select>
          <button type="submit">Add Document</button>
        </form>
      </section>

      <section className="card">
        <h2>Filter & Pagination</h2>
        <form onSubmit={handleApplyFilters} className="grid">
          <input
            type="number"
            min={0}
            value={filters.skip}
            onChange={(e) => setFilters({ ...filters, skip: Number(e.target.value) })}
            placeholder="skip"
          />
          <input
            type="number"
            min={1}
            max={100}
            value={filters.limit}
            onChange={(e) => setFilters({ ...filters, limit: Number(e.target.value) })}
            placeholder="limit"
          />
          <input
            value={filters.title}
            onChange={(e) => setFilters({ ...filters, title: e.target.value })}
            placeholder="title contains"
          />
          <input
            type="number"
            min={1}
            value={filters.user_id}
            onChange={(e) => setFilters({ ...filters, user_id: e.target.value })}
            placeholder="user id"
          />
          <button type="submit">Apply</button>
        </form>
      </section>

      <section className="card">
        <h2>Users</h2>
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              #{u.id} {u.name} ({u.age})
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Documents</h2>
        <ul>
          {documents.map((d) => (
            <li key={d.id}>
              #{d.id} [{d.user_id}] <strong>{d.title}</strong> - {d.content}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
