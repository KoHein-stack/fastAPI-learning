import { FormEvent, useEffect, useState } from "react";
import { createDocument, createUser, DocumentItem, getDocuments, getUsers, User } from "./api";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [error, setError] = useState<string>("");

  const [userForm, setUserForm] = useState({ name: "", age: 18 });
  const [docForm, setDocForm] = useState({ title: "", content: "", user_id: 1 });
  const [filters, setFilters] = useState({ skip: 0, limit: 10, title: "", user_id: "" });

  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  const [expandedDoc, setExpandedDoc] = useState<number | null>(null);
  const [expandedUserDocs, setExpandedUserDocs] = useState<DocumentItem[]>([]);

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

  async function handleViewUser(user: User) {
    if (expandedUser === user.id) {
      setExpandedUser(null);
      setExpandedUserDocs([]);
    } else {
      setExpandedUser(user.id ?? null);
      if (user.id) {
        const docs = await getDocuments({ skip: 0, limit: 100, user_id: user.id });
        setExpandedUserDocs(docs);
      }
    }
  }

  async function handleViewDocument(doc: DocumentItem) {
    setExpandedDoc(expandedDoc === doc.id ? null : (doc.id ?? null));
  }

  return (
    <main className="page">
      <header className="hero">
        <h1>FastAPI Learning Dashboard</h1>
        <p>React + TypeScript frontend for users/documents APIs.</p>
      </header>

      {error && <div className="error">{error}</div>}

      <section className="card">
        <div className="section-head">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
            Create User
          </h2>
        </div>
        <form onSubmit={handleCreateUser} className="form-grid">
          <label className="field">
            <span>Name</span>
            <input
              placeholder="Enter user name"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              required
            />
          </label>
          <label className="field">
            <span>Age</span>
            <input
              type="number"
              min={1}
              value={userForm.age}
              onChange={(e) => setUserForm({ ...userForm, age: Number(e.target.value) })}
              required
            />
          </label>
          <button type="submit" className="action">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            Add User
          </button>
        </form>
      </section>

      <section className="card">
        <div className="section-head">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
            Create Document
          </h2>
        </div>
        <form onSubmit={handleCreateDocument} className="form-grid">
          <label className="field">
            <span>Title</span>
            <input
              placeholder="Document title"
              value={docForm.title}
              onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
              required
            />
          </label>
          <label className="field">
            <span>Content</span>
            <input
              placeholder="Document content"
              value={docForm.content}
              onChange={(e) => setDocForm({ ...docForm, content: e.target.value })}
              required
            />
          </label>
          <label className="field">
            <span>Owner</span>
            <select
              value={docForm.user_id}
              onChange={(e) => setDocForm({ ...docForm, user_id: Number(e.target.value) })}
            >
              {users.length === 0 && <option value={1}>No users available</option>}
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.id} - {u.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="action">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            Add Document
          </button>
        </form>
      </section>

      <section className="card">
        <div className="section-head">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            Filter Documents
          </h2>
        </div>
        <form onSubmit={handleApplyFilters} className="form-grid">
          <label className="field">
            <span>Skip</span>
            <input
              type="number"
              min={0}
              value={filters.skip}
              onChange={(e) => setFilters({ ...filters, skip: Number(e.target.value) })}
            />
          </label>
          <label className="field">
            <span>Limit</span>
            <input
              type="number"
              min={1}
              max={100}
              value={filters.limit}
              onChange={(e) => setFilters({ ...filters, limit: Number(e.target.value) })}
            />
          </label>
          <label className="field">
            <span>Title Contains</span>
            <input
              value={filters.title}
              onChange={(e) => setFilters({ ...filters, title: e.target.value })}
              placeholder="e.g. API"
            />
          </label>
          <label className="field">
            <span>User ID</span>
            <input
              type="number"
              min={1}
              value={filters.user_id}
              onChange={(e) => setFilters({ ...filters, user_id: e.target.value })}
              placeholder="Optional"
            />
          </label>
          <button type="submit" className="action">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            Apply Filters
          </button>
        </form>
      </section>


      <div className="stats">
        <div className="stat-card">
          <span>Total Users</span>
          <strong>{users.length}</strong>
        </div>
        <div className="stat-card">
          <span>Total Documents</span>
          <strong>{documents.length}</strong>
        </div>
      </div>

      <section className="card">
        <div className="section-head">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Users
          </h2>
        </div>
        <ul className="data-list">
          {users.length === 0 && <li className="empty">No users found.</li>}
          {users.map((u) => (
            <li key={u.id} className={expandedUser === u.id ? "expanded" : ""}>
              <div className="row-main">
                <span className="row-id">#{u.id}</span>
                <span style={{ fontWeight: 600 }}>{u.name}</span>
                <span className="row-meta">Age {u.age}</span>
                <button className="view-btn" onClick={() => handleViewUser(u)}>
                  {expandedUser === u.id ? "Hide" : "View"}
                </button>
              </div>
              {expandedUser === u.id && (
                <div className="row-details">
                  <h4>Documents ({expandedUserDocs.length})</h4>
                  <ul className="data-list compact">
                    {expandedUserDocs.length === 0 && <li className="empty">No documents found.</li>}
                    {expandedUserDocs.map(d => (
                      <li key={d.id} onClick={() => handleViewDocument(d)} style={{ cursor: 'pointer' }}>
                        <span className="row-id">#{d.id}</span>
                        <span>{d.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <div className="section-head">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Documents
          </h2>
        </div>
        <ul className="data-list">
          {documents.length === 0 && <li className="empty">No documents found.</li>}
          {documents.map((d) => (
            <li key={d.id} className={expandedDoc === d.id ? "expanded" : ""}>
              <div className="row-main">
                <span className="row-id">#{d.id}</span>
                <span>
                  <strong style={{ display: 'block' }}>{d.title}</strong>
                </span>
                <span className="row-meta">Owner {d.user_id}</span>
                <button className="view-btn" onClick={() => handleViewDocument(d)}>
                  {expandedDoc === d.id ? "Hide" : "View"}
                </button>
              </div>
              {expandedDoc === d.id && (
                <div className="row-details">
                  <div className="doc-body">
                    <p>{d.content}</p>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
