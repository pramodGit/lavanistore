import React, { useEffect, useState, useMemo, useCallback } from "react";
import { getOrderHistory, OrderHistoryItem } from "../../api/userApi";
import { useAppSelector } from "../../store/hooks";
import Header from "../../layout/header";
import Footer from "../../layout/footer";
import "../../assets/team-dashboard.css";

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const user = useAppSelector((state) => state.auth.user);
    const username = user?.name;

    useEffect(() => {
        if (!username) return; // wait until user is loaded

        let mounted = true;

        (async () => {
            try {
                const result = await getOrderHistory(username);
                if (mounted) setOrders(result);
            } catch (err: any) {
                if (mounted) setError(err.message || "Failed to load data");
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [username]);

    // Filter orders based on search term
    const filteredOrders = useMemo(() => {
        if (!search.trim()) return orders;

        const term = search.toLowerCase();
        return orders.filter(o =>
            [
                o.ORDER_ID?.toString(),
                o.USER_ID,
                o.ORDER_DATE?.toString(),
                o.TOTAL?.toString()
            ]
                .filter(Boolean)
                .some(field => field!.toLowerCase().includes(term))
        );
    }, [orders, search]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredOrders.length / pageSize);
    const currentPageData = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

    const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    }, []);

    const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
    const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <>
            <Header />

            <div className="dashboard">
                <header className="dashboard-header">
                    <div className="dashboard-header-top">
                        <h2>Order Details</h2>
                        <p className="dashboard-email">
                            <strong>{user?.name || "User"}</strong>
                        </p>
                    </div>
                </header>

                <div className="dashboard-topbar">
                    <h3>All Orders</h3>
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={search}
                        onChange={handleSearch}
                    />
                </div>

                <div className="dashboard-table-container">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>SL NO</th>
                                <th>ORDER ID</th>
                                <th>ORDER DATE</th>
                                <th>TOTAL</th>
                                <th>DOWNLOAD</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPageData.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: "center" }}>No orders found.</td>
                                </tr>
                            ) : (
                                currentPageData.map((o, index) => (
                                    <tr key={o.ORDER_ID}>
                                        <td>{(page - 1) * pageSize + index + 1}</td>
                                        <td>{`invoice-${o.ORDER_ID}`}</td>
                                        <td>{new Date(o.ORDER_DATE).toLocaleDateString()}</td>
                                        <td>₹ {o.TOTAL.toFixed(2)}</td>
                                        <td>
                                            {o.DOWNLOAD ? (
                                                <a href={`/files/${o.DOWNLOAD}`} target="_blank" rel="noreferrer">
                                                    Download PDF
                                                </a>
                                            ) : "—"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button onClick={handlePrev} disabled={page === 1}>← Prev</button>
                        <span>Page {page} of {totalPages}</span>
                        <button onClick={handleNext} disabled={page === totalPages}>Next →</button>
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default React.memo(OrderHistoryPage);
