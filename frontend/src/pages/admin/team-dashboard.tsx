import React, { useEffect, useState, useMemo, useCallback } from "react";
import { getUserByUsername, UserResponse } from "../../api/userApi";
import { useAppSelector } from "../../store/hooks";
import Header from "../../layout/header";
import Footer from "../../layout/footer";
import "../../assets/team-dashboard.css";

const TeamDashboard: React.FC = () => {
  const [data, setData] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const user = useAppSelector((state) => state.auth.user);
  const username = user?.name;

  useEffect(() => {
    if (!username) return;
    let mounted = true;

    (async () => {
      try {
        const result = await getUserByUsername(username);
        if (mounted) setData(result);
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to load user data");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [username]);

  // ✅ updated to use teamMembers instead of sponsoredUsers
  const filteredUsers = useMemo(() => {
    if (!data?.teamMembers) return [];
    const term = search.trim().toLowerCase();
    if (!term) return data.teamMembers;

    return data.teamMembers.filter((u) =>
      [
        u.userName,
        u.FirstName,
        u.LastName,
        u.email,
        u.mobile,
        u.status
      ]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(term))
    );
  }, [data?.teamMembers, search]);


  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const currentPageData = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setPage(1);
    },
    []
  );

  const handlePrev = useCallback(() => {
    setPage((p) => Math.max(p - 1, 1));
  }, []);

  const handleNext = useCallback(() => {
    setPage((p) => Math.min(p + 1, totalPages));
  }, [totalPages]);

  if (loading) return <p>Loading user info...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!data) return null;

  const { user: sponsor } = data;
  const firstName =
    sponsor.FirstName || (sponsor as any)["First Name"] || "—";
  const lastName =
    sponsor.LastName || (sponsor as any)["Last Name"] || "";



  return (
    <>
      <Header />
      <div className="dashboard">
        <header className="dashboard-header">
          <div className="dashboard-header-top">
            <h2>
              Welcome {firstName || "—"} {lastName || ""}
            </h2>
            <p className="dashboard-email">
              <strong>{sponsor.EmailID || "N/A"}</strong>
            </p>
          </div>
        </header>

        <div className="dashboard-topbar">
          <h3>Team Members</h3>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="dashboard-table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Reg. Date</th>
                <th>Activation Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {currentPageData.map((u) => (
                <tr key={u.RegistrationID}>
                  <td data-label="#">{u.userName}</td>
                  <td data-label="Name">{u.FirstName} {u.LastName}</td>
                  <td data-label="Mobile">{u.mobile}</td>
                  <td data-label="Email">{u.email}</td>
                  <td data-label="Reg. Date">
                    {u.registrationDate ? new Date(u.registrationDate).toLocaleDateString() : "—"}
                  </td>
                  <td data-label="Activation Date">
                    {u.activationDate ? new Date(u.activationDate).toLocaleDateString() : "—"}
                  </td>
                  <td data-label="Status">{u.status}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={handlePrev} disabled={page === 1}>
              ← Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button onClick={handleNext} disabled={page === totalPages}>
              Next →
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default React.memo(TeamDashboard);
