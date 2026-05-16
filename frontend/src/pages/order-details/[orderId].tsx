import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import Header from "../../layout/header";
import Footer from "../../layout/footer";
import api from "../../utils/api";
import { OrderDetails, OrderItemType } from "../../types/types";
import "../../assets/orderDetails.css";
import { useAppSelector } from "../../store/hooks";

const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const isGreen = useAppSelector((state) => state.auth.user?.isGreen === 1);

  useEffect(() => {
    console.log('orderId from params:', orderId);
    if (!orderId) return setLoading(false);

    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}`, {
          params: { isGreen },
        });


        console.log('API response data:', data);

        const mappedItems: OrderItemType[] = (data.items || []).map((item: any) => {
          console.log('Mapping item:', item);

          const qty = Number(item.SaleQty) || 0;
          const mrp = Number(item.MRP) || 0;
          const salePrice = Number(item.Sale_Price) || 0;
          const gstPercent = Number(item.GST_Percent) || 0;

          const basePrice = isGreen ? salePrice : mrp;
          const gstAmount = (basePrice * qty * gstPercent) / 100;

          return {
            id: item.Item_order_ID?.toString() ?? String(Math.random()),
            PROD_Name: item.Product_name || item.Product_Name,
            SaleQty: qty,
            MRP: mrp,
            Sale_Price: salePrice,
            Actual_Sale_Price: salePrice * qty,
            GST_Percent: gstPercent,
            GST_Amount: gstAmount,
          };
        });

        console.log('Mapped items:', mappedItems);

        const mappedCustomer = {
          ...data.customer,
          Customer_Mobile: data.customer?.Custome_Mobile ?? data.customer?.Customer_Mobile,
        };

        const mappedSale = {
          ...data.sale,
          TotalPayable: Number(data.sale?.TotalPayable || 0),
          Amount_Received: Number(data.sale?.Amount_Received || 0),
          Balance_IfAany: Number(data.sale?.Balance_IfAany || 0),
        };

        console.log('Mapped sale:', mappedSale);

        setOrder({ sale: mappedSale, items: mappedItems, customer: mappedCustomer });

      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, isGreen]);

  const sale = order?.sale;
  const customer = order?.customer;
  const items = order?.items || [];

  const format = (n?: number) =>
    (n ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Calculate amounts & GST
  const itemAmount = (item: OrderItemType) => (isGreen ? item.Sale_Price : item.MRP) * item.SaleQty;
  const totalAmount = items.reduce((sum, i) => sum + itemAmount(i), 0);
  const totalGST = items.reduce((sum, i) => sum + (i.GST_Amount || 0), 0);
  const grandTotal = totalAmount + totalGST;

  // Generate QR code
  useEffect(() => {
    if (!sale?.SaleID) return;
    const qrAmount = grandTotal.toFixed(2);
    const upi = `upi://pay?pa=9217291776@pthdfc&pn=MR%20VIJAY%20SINGH&am=${qrAmount}&cu=INR&tn=Invoice-${sale.SaleID}`;

    const canvas = document.getElementById("upiQr") as HTMLCanvasElement;
    if (canvas) QRCode.toCanvas(canvas, upi, { width: 128 });
  }, [sale?.SaleID, grandTotal]);

  if (loading)
    return (
      <>
        <Header />
        <div className="invoice-loading">Loading invoice…</div>
        <Footer />
      </>
    );

  if (!sale?.SaleID)
    return (
      <>
        <Header />
        <div className="invoice-empty">
          <h2>Order Not Found</h2>
          <button onClick={() => navigate("/product-list")} className="btn-primary">
            Continue Shopping
          </button>
        </div>
        <Footer />
      </>
    );

  // PDF Export
  const exportPdf = () => {
    const el = document.getElementById("invoiceRoot");
    if (!el) return;

    const opts = {
      margin: [10, 8, 10, 8],
      filename: `invoice-${sale?.SaleID}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    const w = window as any;
    if (!w.html2pdf) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js";
      script.onload = () => w.html2pdf().set(opts).from(el).save();
      document.body.appendChild(script);
      return;
    }

    w.html2pdf().set(opts).from(el).save();
  };

  return (
    <>
      <Header />

      <div className="invoice-page">
        <div className="invoice-container">
          <div className="invoice-actions">
            <button className="btn-export" onClick={exportPdf}>Export PDF</button>
            <button className="btn-print" onClick={() => window.print()}>Print</button>
            <button className="btn-continue" onClick={() => navigate("/product-list")}>
              Continue Shopping
            </button>
          </div>

          <article id="invoiceRoot" className="invoice-box">
            <div className="inv-header">
              <div>
                <h1 style={{ margin: 0 }}>LAVANI WELLNESS</h1>
                <div className="inv-sub">
                  5719, G-116, Sant Nagar, Burari, Delhi - 84<br />
                  FSSAI Lic. 10021051000000
                </div>
              </div>

              <div className="inv-meta">
                <div>Original for Recipient</div>
                <div>Invoice No: <strong>{sale.SaleID}</strong></div>
                <div>Date: <strong>{sale.Sale_DateTime ? new Date(sale.Sale_DateTime).toLocaleDateString() : "-"}</strong></div>
              </div>
            </div>

            <div className="inv-two-col">
              <div className="inv-box">
                <h4>Bill To</h4>
                <strong>{customer?.Customer_Name}</strong>
                <div className="inv-text">
                  {[customer?.Customer_Address].filter(Boolean).join(", ")}
                </div>
              </div>
              <div className="inv-box">
                <h4>Ship To</h4>
                <strong>{customer?.Customer_Name}</strong>
                <div className="inv-text">
                  {[customer?.Customer_Address].filter(Boolean).join(", ")}
                </div>
              </div>
            </div>

            <table className="inv-table">
              <thead>
                <tr>
                  <th>S No.</th>
                  <th>Product</th>
                  <th>Qty</th>
                  {/* <th>MRP</th> */}
                  <th>Sale Price</th>
                  {/* <th>GST%</th> */}
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, i) => {
                  const base = isGreen ? item.Sale_Price : item.MRP;
                  const amount = itemAmount(item);
                  return (
                    <tr key={item.id}>
                      <td>{i + 1}</td>
                      <td>{item.PROD_Name}</td>
                      <td>{item.SaleQty}</td>
                      {/* <td>{format(item.MRP)}</td> */}
                      <td>{format(base)}</td>
                      {/* <td>{item.GST_Percent}%</td> */}
                      <td className="text-right">{format(amount)}</td>
                    </tr>
                  );
                })}

                {/* <tr>
                  <td colSpan={6}><strong>GST</strong></td>
                  <td className="text-right"><strong>{format(totalGST)}</strong></td>
                </tr> */}

                <tr className="inv-total-row">
                  <td colSpan={4}><strong>Grand Total</strong></td>
                  <td className="text-right"><strong>{format(grandTotal)}</strong></td>
                </tr>
              </tbody>
            </table>

            <div className="inv-qr">
              <h4>Scan to Pay</h4>
              <canvas id="upiQr"></canvas>
              <div className="inv-text">
                <strong>UPI:</strong> 9217291776@pthdfc - MR VIJAY SINGH<br />
                <strong>Amount:</strong> ₹{format(grandTotal)}
              </div>
            </div>
          </article>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default OrderDetailsPage;
