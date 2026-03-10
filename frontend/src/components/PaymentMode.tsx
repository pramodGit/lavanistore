import React, { useEffect, useState, useRef } from "react";
import { useAppSelector } from "../store/hooks";
import { selectCartTotals } from "../store/selectors/cartSelectors"; // ✅ import selector
import QRCode from "qrcode";

const PaymentMode: React.FC = () => {
  // ✅ get totals from memoized selector
  const { totalPayable } = useAppSelector(selectCartTotals);

  // const { totalPrice } = useAppSelector(selectCartTotals);
  // const totalPayable = Number(totalPrice) || 0;

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const latestAmountRef = useRef<number>(0);
  const generatingRef = useRef<boolean>(false);

  const generateQR = async (amount: number) => {
    generatingRef.current = true;
    setLoading(true);

  const upiString =
      `upi://pay?pa=9217291776@pthdfc&pn=MR%20VIJAY%20SINGH&am=${amount.toFixed(2)}` +
      `&cu=INR&tn=Lavani%20Wellness%20Order%20Payment`;


    try {
      const dataUrl = await QRCode.toDataURL(upiString, { width: 240 });

      if (latestAmountRef.current !== amount) return;
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error("QR Error:", err);
      setQrDataUrl(null);
    }

    generatingRef.current = false;
    setLoading(false);
  };

  useEffect(() => {
    if (totalPayable <= 0) {
      setQrDataUrl(null);
      return;
    }

    latestAmountRef.current = totalPayable;
    setLoading(true);

    if (!generatingRef.current) {
      generateQR(totalPayable);
    }
  }, [totalPayable]);

  return (
    <div className="payment-mode-box">
      <h3 className="payment-title">Payment Method</h3>

      <div className="payment-option-row">
        <input type="radio" checked readOnly />
        <span>Pay via UPI (Scan & Pay)</span>
      </div>

      <div className="qr-section" style={{ textAlign: "center" }}>
        {loading && (
          <div style={{ marginBottom: 10 }}>Generating latest QR…</div>
        )}

        {!loading && qrDataUrl && (
          <img src={qrDataUrl} alt="UPI QR" style={{ width: 240, height: 240 }} />
        )}

        <p>
          <strong>UPI:</strong> 9217291776@pthdfc<br />
          <strong>Amount:</strong> ₹{totalPayable.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default PaymentMode;
