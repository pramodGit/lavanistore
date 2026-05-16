// utils/generateInvoicePDF.js
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const OUTPUT_DIR = "/var/www/lavanistore/storage/files";

export async function generateInvoicePDF(customerName, sale, items, isGreen = false, pdfName) {
  return new Promise((resolve, reject) => {
    try {
      // Ensure output directory exists
      if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      }

      const outputPath = path.join(OUTPUT_DIR, pdfName);
      const doc = new PDFDocument({ margin: 40, size: "A4" });
      const stream = fs.createWriteStream(outputPath);

      doc.pipe(stream);

      // -------------------------------------------------------
      // Helper: format number Indian style
      // -------------------------------------------------------
      const format = (n) =>
        (Number(n) || 0).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

      // -------------------------------------------------------
      // HEADER
      // -------------------------------------------------------
      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("Lavani Wellness", { align: "center" });

      doc
        .fontSize(10)
        .font("Helvetica")
        .text("Tax Invoice / Order Summary", { align: "center" });

      doc.moveDown(0.5);
      doc
        .moveTo(40, doc.y)
        .lineTo(555, doc.y)
        .strokeColor("#cccccc")
        .stroke();
      doc.moveDown(0.5);

      // -------------------------------------------------------
      // ORDER INFO
      // -------------------------------------------------------
      const saleId = sale?.id || sale?.SaleID || "";
      const saleDate = sale?.date
        ? new Date(sale.date).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          })
        : "";

      doc.fontSize(10).font("Helvetica");
      doc.text(`Order ID : ${saleId}`,  { continued: true });
      doc.text(`    Date : ${saleDate}`, { align: "right" });
      doc.moveDown(0.3);
      doc.text(`Customer : ${customerName}`);

      if (isGreen) {
        doc.moveDown(0.3);
        doc
          .fontSize(10)
          .font("Helvetica-Bold")
          .fillColor("#2e7d32")
          .text("✔ Green Member Pricing Applied");
        doc.fillColor("#000000").font("Helvetica");
      }

      doc.moveDown(0.8);

      // -------------------------------------------------------
      // TABLE HEADER
      // -------------------------------------------------------
      const colX = {
        sno:    40,
        name:   70,
        qty:   340,
        price: 390,
        amount:480,
      };
      const tableTop = doc.y;
      const rowHeight = 20;

      // Header background
      doc
        .rect(40, tableTop, 515, rowHeight)
        .fillColor("#f5f5f5")
        .fill();

      doc.fillColor("#000000").font("Helvetica-Bold").fontSize(10);
      doc.text("S.No", colX.sno,   tableTop + 5, { width: 25,  align: "center" });
      doc.text("Product",colX.name, tableTop + 5, { width: 265, align: "left" });
      doc.text("Qty",    colX.qty,  tableTop + 5, { width: 45,  align: "center" });
      doc.text("Price",  colX.price,tableTop + 5, { width: 85,  align: "right" });
      doc.text("Amount", colX.amount,tableTop+5,  { width: 75,  align: "right" });

      // Header bottom border
      doc
        .moveTo(40, tableTop + rowHeight)
        .lineTo(555, tableTop + rowHeight)
        .strokeColor("#cccccc")
        .stroke();

      // -------------------------------------------------------
      // TABLE ROWS
      // -------------------------------------------------------
      doc.font("Helvetica").fontSize(10);
      let grandTotal = 0;
      let y = tableTop + rowHeight;

      items.forEach((item, index) => {
        const qty       = Number(item.SaleQty) || 0;
        const mrp       = Number(item.MRP) || 0;
        const salePrice = Number(item.Sale_Price) || 0;
        const showPrice = isGreen ? salePrice : mrp;
        const amount    = showPrice * qty;
        grandTotal     += amount;

        const productName = item.Product_name || item.PROD_Name || item.Product_Name || "-";

        // Alternate row shading
        if (index % 2 === 0) {
          doc.rect(40, y, 515, rowHeight).fillColor("#fafafa").fill();
        }
        doc.fillColor("#000000");

        doc.text(String(index + 1), colX.sno,    y + 5, { width: 25,  align: "center" });
        doc.text(productName,        colX.name,   y + 5, { width: 265, align: "left" });
        doc.text(String(qty),        colX.qty,    y + 5, { width: 45,  align: "center" });
        doc.text(`₹${format(showPrice)}`, colX.price,  y + 5, { width: 85,  align: "right" });
        doc.text(`₹${format(amount)}`,    colX.amount, y + 5, { width: 75,  align: "right" });

        // Row bottom border
        doc
          .moveTo(40, y + rowHeight)
          .lineTo(555, y + rowHeight)
          .strokeColor("#eeeeee")
          .stroke();

        y += rowHeight;
      });

      // -------------------------------------------------------
      // GRAND TOTAL ROW
      // -------------------------------------------------------
      doc
        .rect(40, y, 515, rowHeight)
        .fillColor("#f0f0f0")
        .fill();

      doc.fillColor("#000000").font("Helvetica-Bold").fontSize(10);
      doc.text("Grand Total", colX.sno, y + 5, { width: 435, align: "right" });
      doc.text(`₹${format(grandTotal)}`, colX.amount, y + 5, { width: 75, align: "right" });

      // Table outer border
      doc
        .rect(40, tableTop, 515, y + rowHeight - tableTop)
        .strokeColor("#cccccc")
        .stroke();

      y += rowHeight + 20;

      // -------------------------------------------------------
      // FOOTER
      // -------------------------------------------------------
      doc.moveTo(40, y).lineTo(555, y).strokeColor("#cccccc").stroke();
      doc.moveDown(0.8);
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#555555")
        .text("Thank you for shopping with Lavani Wellness!", { align: "center" });

      doc.end();

      stream.on("finish", () => {
        console.log("📄 PDF generated:", outputPath);
        resolve(outputPath);
      });

      stream.on("error", reject);

    } catch (err) {
      reject(err);
    }
  });
}