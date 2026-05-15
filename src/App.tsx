import React, { useMemo, useState } from "react";

type UserRole = "buyer" | "seller";

type OfferStatus =
  | "draft"
  | "sent"
  | "countered"
  | "final_offer"
  | "accepted"
  | "rejected";

type PurchaseRequest = {
  id: string;
  productName: string;
  quantity: number;
  quantityUnit: string;
  targetPricePerUnit: string;
  deliveryLocation: string;
  requestedDeliveryDate: string;
  paymentTerm: string;
};

type NegotiationMessage = {
  id: string;
  sender: UserRole;
  message: string;
  createdAt: string;
};

type Offer = {
  id: string;
  purchaseRequestId: string;
  sellerName: string;
  quantity: number;
  quantityUnit: string;
  offeredPricePerUnit: string;
  buyerCounterPricePerUnit?: string;
  latestAgreedPricePerUnit?: string;
  deliveryDate: string;
  shippingFee: string;
  paymentTerm: string;
  note: string;
  status: OfferStatus;
};

type Order = {
  id: string;
  purchaseRequestId: string;
  offerId: string;
  productName: string;
  buyerName: string;
  sellerName: string;
  quantity: number;
  quantityUnit: string;
  pricePerUnit: string;
  totalAmountLabel: string;
  deliveryDate: string;
  shippingFee: string;
  paymentTerm: string;
  createdAt: string;
};

function formatCurrencyTHB(value: number): string {
  return value.toLocaleString("th-TH", {
    maximumFractionDigits: 0,
  });
}

function normalizeNumericText(value: string | number): string {
  return String(value).replace(/,/g, "").replace(/บาท\/กก\.?/g, "").trim();
}

function calculateTotalAmountLabel(
  quantity: number,
  pricePerUnit: number | string,
  unitLabel = "บาท"
): string {
  if (!quantity || !pricePerUnit) return "-";

  const rawPrice = normalizeNumericText(pricePerUnit);

  if (rawPrice.includes("-")) {
    const [minRaw, maxRaw] = rawPrice.split("-").map((v) => Number(v.trim()));

    if (!Number.isFinite(minRaw) || !Number.isFinite(maxRaw)) {
      return "-";
    }

    const minTotal = quantity * minRaw;
    const maxTotal = quantity * maxRaw;

    return `ประมาณ ${formatCurrencyTHB(minTotal)}-${formatCurrencyTHB(maxTotal)} ${unitLabel}`;
  }

  const price = Number(rawPrice);

  if (!Number.isFinite(price)) {
    return "-";
  }

  const total = quantity * price;

  return `${formatCurrencyTHB(total)} ${unitLabel}`;
}

function getStatusLabel(status: OfferStatus): string {
  const statusMap: Record<OfferStatus, string> = {
    draft: "แบบร่าง",
    sent: "ส่งข้อเสนอแล้ว",
    countered: "อยู่ระหว่างต่อรอง",
    final_offer: "ส่งข้อเสนอสุดท้ายแล้ว",
    accepted: "ยืนยันข้อเสนอแล้ว",
    rejected: "ปฏิเสธข้อเสนอ",
  };

  return statusMap[status];
}

function getLatestPriceForOrder(offer: Offer): string {
  return (
    offer.latestAgreedPricePerUnit ||
    offer.buyerCounterPricePerUnit ||
    offer.offeredPricePerUnit
  );
}

function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>("buyer");

  const [purchaseRequest] = useState<PurchaseRequest>({
    id: "PR-2026-0001",
    productName: "มันสำปะหลังสด",
    quantity: 500,
    quantityUnit: "กก.",
    targetPricePerUnit: "55-70",
    deliveryLocation: "เชียงใหม่",
    requestedDeliveryDate: "2026-05-20",
    paymentTerm: "โอนภายใน 3 วันหลังส่งมอบ",
  });

  const [offer, setOffer] = useState<Offer>({
    id: "OF-2026-0001",
    purchaseRequestId: "PR-2026-0001",
    sellerName: "สวนตัวอย่าง",
    quantity: 500,
    quantityUnit: "กก.",
    offeredPricePerUnit: "70",
    buyerCounterPricePerUnit: "",
    latestAgreedPricePerUnit: "",
    deliveryDate: "2026-05-20",
    shippingFee: "รวมค่าส่ง",
    paymentTerm: "โอนภายใน 3 วันหลังส่งมอบ",
    note: "สินค้าพร้อมส่งตามจำนวน",
    status: "sent",
  });

  const [messages, setMessages] = useState<NegotiationMessage[]>([
    {
      id: "MSG-1",
      sender: "buyer",
      message:
        "ต้องการซื้อ 500 กก. ราคาเป้าหมาย 55-70 บาท/กก. ส่งเชียงใหม่",
      createdAt: "09:30",
    },
    {
      id: "MSG-2",
      sender: "seller",
      message:
        "เสนอขายได้ที่ 70 บาท/กก. จำนวน 500 กก. ส่งได้วันที่ 20 พ.ค.",
      createdAt: "09:34",
    },
  ]);

  const [counterPrice, setCounterPrice] = useState("60");
  const [sellerNewPrice, setSellerNewPrice] = useState("65");
  const [chatInput, setChatInput] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [isPoSoModalOpen, setIsPoSoModalOpen] = useState(false);

  const purchaseRequestTotalLabel = useMemo(() => {
    return calculateTotalAmountLabel(
      purchaseRequest.quantity,
      purchaseRequest.targetPricePerUnit
    );
  }, [purchaseRequest.quantity, purchaseRequest.targetPricePerUnit]);

  const offerTotalLabel = useMemo(() => {
    return calculateTotalAmountLabel(
      offer.quantity,
      getLatestPriceForOrder(offer)
    );
  }, [offer]);

  const canCreateOrder = offer.status === "accepted";

  function appendMessage(sender: UserRole, message: string) {
    const now = new Date();
    const createdAt = now.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((current) => [
      ...current,
      {
        id: `MSG-${current.length + 1}`,
        sender,
        message,
        createdAt,
      },
    ]);
  }

  function handleSendChat() {
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    appendMessage(currentRole, trimmed);
    setChatInput("");
  }

  function handleBuyerCounter() {
    const trimmed = counterPrice.trim();
    if (!trimmed) return;

    setOffer((current) => ({
      ...current,
      buyerCounterPricePerUnit: trimmed,
      latestAgreedPricePerUnit: "",
      status: "countered",
    }));

    appendMessage(
      "buyer",
      `ขอต่อรองราคาเป็น ${trimmed} บาท/${purchaseRequest.quantityUnit}`
    );
  }

  function handleSellerNewOffer() {
    const trimmed = sellerNewPrice.trim();
    if (!trimmed) return;

    setOffer((current) => ({
      ...current,
      offeredPricePerUnit: trimmed,
      latestAgreedPricePerUnit: trimmed,
      status: "final_offer",
    }));

    appendMessage(
      "seller",
      `เสนอราคาใหม่/ข้อเสนอสุดท้ายที่ ${trimmed} บาท/${purchaseRequest.quantityUnit}`
    );
  }

  function handleAcceptOffer() {
    const agreedPrice = getLatestPriceForOrder(offer);

    setOffer((current) => ({
      ...current,
      latestAgreedPricePerUnit: agreedPrice,
      status: "accepted",
    }));

    appendMessage(
      "buyer",
      `ยืนยันข้อเสนอที่ราคา ${agreedPrice} บาท/${purchaseRequest.quantityUnit}`
    );
  }

  function handleRejectOffer() {
    setOffer((current) => ({
      ...current,
      status: "rejected",
    }));

    appendMessage("buyer", "ปฏิเสธข้อเสนอขายนี้");
  }

  function handleCreatePoSo() {
    if (offer.status !== "accepted") return;

    const agreedPrice = getLatestPriceForOrder(offer);
    const newOrder: Order = {
      id: "PO-SO-2026-0001",
      purchaseRequestId: purchaseRequest.id,
      offerId: offer.id,
      productName: purchaseRequest.productName,
      buyerName: "ผู้ซื้อทดสอบ",
      sellerName: offer.sellerName,
      quantity: offer.quantity,
      quantityUnit: offer.quantityUnit,
      pricePerUnit: agreedPrice,
      totalAmountLabel: calculateTotalAmountLabel(offer.quantity, agreedPrice),
      deliveryDate: offer.deliveryDate,
      shippingFee: offer.shippingFee,
      paymentTerm: offer.paymentTerm,
      createdAt: new Date().toLocaleString("th-TH"),
    };

    setOrder(newOrder);
    setIsPoSoModalOpen(true);
  }

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Purchase Negotiation Flow</p>
          <h1 style={styles.title}>เจรจาราคาก่อนสร้าง PO/SO</h1>
          <p style={styles.subtitle}>
            PO/SO จะถูกสร้างได้หลังจากผู้ซื้อกด “ยืนยันข้อเสนอ” เท่านั้น
          </p>
        </div>

        <div style={styles.roleSwitch}>
          <button
            type="button"
            onClick={() => setCurrentRole("buyer")}
            style={{
              ...styles.roleButton,
              ...(currentRole === "buyer" ? styles.roleButtonActive : {}),
            }}
          >
            ผู้ซื้อ
          </button>
          <button
            type="button"
            onClick={() => setCurrentRole("seller")}
            style={{
              ...styles.roleButton,
              ...(currentRole === "seller" ? styles.roleButtonActive : {}),
            }}
          >
            ผู้ขาย
          </button>
        </div>
      </section>

      <section style={styles.grid}>
        <article style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <p style={styles.eyebrow}>คำขอซื้อ</p>
              <h2 style={styles.cardTitle}>{purchaseRequest.productName}</h2>
            </div>
            <span style={styles.badge}>{purchaseRequest.id}</span>
          </div>

          <div style={styles.infoList}>
            <InfoRow
              label="ปริมาณ"
              value={`${formatCurrencyTHB(purchaseRequest.quantity)} ${
                purchaseRequest.quantityUnit
              }`}
            />
            <InfoRow
              label="ราคาเป้าหมาย"
              value={`${purchaseRequest.targetPricePerUnit} บาท/${purchaseRequest.quantityUnit}`}
            />
            <InfoRow label="มูลค่ารวม" value={purchaseRequestTotalLabel} />
            <InfoRow label="สถานที่ส่งมอบ" value={purchaseRequest.deliveryLocation} />
            <InfoRow label="วันที่ต้องการรับ" value={purchaseRequest.requestedDeliveryDate} />
            <InfoRow label="เงื่อนไขชำระเงิน" value={purchaseRequest.paymentTerm} />
          </div>
        </article>

        <article style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <p style={styles.eyebrow}>ข้อเสนอขาย</p>
              <h2 style={styles.cardTitle}>{offer.sellerName}</h2>
            </div>
            <span style={styles.statusBadge}>{getStatusLabel(offer.status)}</span>
          </div>

          <div style={styles.infoList}>
            <InfoRow
              label="ปริมาณที่เสนอ"
              value={`${formatCurrencyTHB(offer.quantity)} ${offer.quantityUnit}`}
            />
            <InfoRow
              label="ราคาที่เสนอ"
              value={`${offer.offeredPricePerUnit || "-"} บาท/${offer.quantityUnit}`}
            />
            <InfoRow
              label="ราคาที่ผู้ซื้อขอต่อ"
              value={
                offer.buyerCounterPricePerUnit
                  ? `${offer.buyerCounterPricePerUnit} บาท/${offer.quantityUnit}`
                  : "-"
              }
            />
            <InfoRow
              label="ราคาที่ตกลงล่าสุด"
              value={
                offer.latestAgreedPricePerUnit
                  ? `${offer.latestAgreedPricePerUnit} บาท/${offer.quantityUnit}`
                  : "-"
              }
            />
            <InfoRow label="มูลค่ารวมล่าสุด" value={offerTotalLabel} />
            <InfoRow label="วันส่งมอบ" value={offer.deliveryDate} />
            <InfoRow label="ค่าขนส่ง" value={offer.shippingFee} />
            <InfoRow label="เงื่อนไขชำระเงิน" value={offer.paymentTerm} />
          </div>
        </article>
      </section>

      <section style={styles.negotiationGrid}>
        <article style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <p style={styles.eyebrow}>แชทการจัดซื้อ</p>
              <h2 style={styles.cardTitle}>เจรจาก่อนสร้าง PO/SO</h2>
            </div>
            <span style={styles.badge}>
              โหมดปัจจุบัน: {currentRole === "buyer" ? "ผู้ซื้อ" : "ผู้ขาย"}
            </span>
          </div>

          <div style={styles.chatBox}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  ...styles.message,
                  ...(message.sender === "buyer"
                    ? styles.messageBuyer
                    : styles.messageSeller),
                }}
              >
                <div style={styles.messageMeta}>
                  <strong>{message.sender === "buyer" ? "ผู้ซื้อ" : "ผู้ขาย"}</strong>
                  <span>{message.createdAt}</span>
                </div>
                <p style={styles.messageText}>{message.message}</p>
              </div>
            ))}
          </div>

          <div style={styles.chatInputRow}>
            <input
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSendChat();
              }}
              placeholder="พิมพ์ข้อความเจรจา เช่น ราคา วันส่งมอบ ค่าขนส่ง เงื่อนไขชำระเงิน"
              style={styles.input}
            />
            <button type="button" onClick={handleSendChat} style={styles.primaryButton}>
              ส่งแชท
            </button>
          </div>
        </article>

        <article style={styles.card}>
          <p style={styles.eyebrow}>Actions</p>
          <h2 style={styles.cardTitle}>ปุ่มเจรจาราคาและยืนยันข้อเสนอ</h2>

          <div style={styles.actionPanel}>
            <div style={styles.actionGroup}>
              <label style={styles.label}>ผู้ซื้อขอต่อรองราคา</label>
              <div style={styles.inlineInput}>
                <input
                  value={counterPrice}
                  onChange={(event) => setCounterPrice(event.target.value)}
                  style={styles.input}
                  placeholder="เช่น 60"
                />
                <button
                  type="button"
                  onClick={handleBuyerCounter}
                  disabled={currentRole !== "buyer" || offer.status === "accepted"}
                  style={styles.secondaryButton}
                >
                  ขอต่อรองราคา
                </button>
              </div>
            </div>

            <div style={styles.actionGroup}>
              <label style={styles.label}>ผู้ขายเสนอราคาใหม่ / ส่งข้อเสนอสุดท้าย</label>
              <div style={styles.inlineInput}>
                <input
                  value={sellerNewPrice}
                  onChange={(event) => setSellerNewPrice(event.target.value)}
                  style={styles.input}
                  placeholder="เช่น 65"
                />
                <button
                  type="button"
                  onClick={handleSellerNewOffer}
                  disabled={currentRole !== "seller" || offer.status === "accepted"}
                  style={styles.secondaryButton}
                >
                  เสนอราคาใหม่
                </button>
              </div>
            </div>

            <div style={styles.buttonRow}>
              <button
                type="button"
                onClick={handleAcceptOffer}
                disabled={currentRole !== "buyer" || offer.status === "accepted"}
                style={styles.primaryButton}
              >
                ยืนยันข้อเสนอ
              </button>

              <button
                type="button"
                onClick={handleRejectOffer}
                disabled={currentRole !== "buyer" || offer.status === "accepted"}
                style={styles.dangerButton}
              >
                ปฏิเสธข้อเสนอ
              </button>
            </div>

            <div style={styles.divider} />

            <div style={styles.poSoBox}>
              <h3 style={styles.sectionTitle}>สร้าง PO/SO</h3>
              <p style={styles.helperText}>
                สร้างได้เฉพาะเมื่อสถานะเป็น “ยืนยันข้อเสนอแล้ว”
              </p>

              <button
                type="button"
                onClick={handleCreatePoSo}
                disabled={!canCreateOrder}
                style={{
                  ...styles.primaryButton,
                  ...(!canCreateOrder ? styles.disabledButton : {}),
                }}
              >
                สร้าง / เปิด PO/SO
              </button>

              {!canCreateOrder && (
                <p style={styles.warningText}>
                  ยังสร้าง PO/SO ไม่ได้ กรุณายืนยันข้อเสนอก่อน
                </p>
              )}
            </div>
          </div>
        </article>
      </section>

      <section style={styles.card}>
        <p style={styles.eyebrow}>สรุปการเจรจาราคา</p>
        <h2 style={styles.cardTitle}>ราคาล่าสุดก่อนสร้างเอกสาร</h2>

        <div style={styles.summaryGrid}>
          <SummaryBox
            title="ราคาที่เสนอ"
            value={`${offer.offeredPricePerUnit || "-"} บาท/${offer.quantityUnit}`}
          />
          <SummaryBox
            title="ราคาที่ผู้ซื้อขอต่อ"
            value={
              offer.buyerCounterPricePerUnit
                ? `${offer.buyerCounterPricePerUnit} บาท/${offer.quantityUnit}`
                : "-"
            }
          />
          <SummaryBox
            title="ราคาที่ตกลงล่าสุด"
            value={
              offer.latestAgreedPricePerUnit
                ? `${offer.latestAgreedPricePerUnit} บาท/${offer.quantityUnit}`
                : "-"
            }
          />
          <SummaryBox title="มูลค่ารวมล่าสุด" value={offerTotalLabel} />
        </div>
      </section>

      {isPoSoModalOpen && order && (
        <div style={styles.modalBackdrop}>
          <article style={styles.modal}>
            <div style={styles.cardHeader}>
              <div>
                <p style={styles.eyebrow}>PO/SO</p>
                <h2 style={styles.cardTitle}>เอกสารยืนยันหลังตกลงราคา</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsPoSoModalOpen(false)}
                style={styles.closeButton}
              >
                ปิด
              </button>
            </div>

            <div style={styles.infoList}>
              <InfoRow label="เลขที่เอกสาร" value={order.id} />
              <InfoRow label="สินค้า" value={order.productName} />
              <InfoRow label="ผู้ซื้อ" value={order.buyerName} />
              <InfoRow label="ผู้ขาย" value={order.sellerName} />
              <InfoRow
                label="ปริมาณ"
                value={`${formatCurrencyTHB(order.quantity)} ${order.quantityUnit}`}
              />
              <InfoRow
                label="ราคาต่อหน่วย"
                value={`${order.pricePerUnit} บาท/${order.quantityUnit}`}
              />
              <InfoRow label="มูลค่ารวม" value={order.totalAmountLabel} />
              <InfoRow label="วันส่งมอบ" value={order.deliveryDate} />
              <InfoRow label="ค่าขนส่ง" value={order.shippingFee} />
              <InfoRow label="เงื่อนไขชำระเงิน" value={order.paymentTerm} />
              <InfoRow label="สร้างเมื่อ" value={order.createdAt} />
            </div>

            <div style={styles.modalFooter}>
              <p style={styles.helperText}>
                PO/SO นี้สร้างจากราคาที่ผู้ซื้อยืนยันแล้ว ไม่ใช่พื้นที่เจรจาราคา
              </p>
            </div>
          </article>
        </div>
      )}
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.infoRow}>
      <span style={styles.infoLabel}>{label}</span>
      <strong style={styles.infoValue}>{value}</strong>
    </div>
  );
}

function SummaryBox({ title, value }: { title: string; value: string }) {
  return (
    <div style={styles.summaryBox}>
      <span style={styles.infoLabel}>{title}</span>
      <strong style={styles.summaryValue}>{value}</strong>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f6f7fb",
    color: "#172033",
    padding: 24,
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    maxWidth: 1180,
    margin: "0 auto 20px",
  },
  eyebrow: {
    margin: 0,
    color: "#64748b",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    margin: "6px 0",
    fontSize: 34,
    lineHeight: 1.15,
  },
  subtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: 16,
  },
  roleSwitch: {
    display: "flex",
    background: "#ffffff",
    padding: 6,
    borderRadius: 14,
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
    gap: 6,
  },
  roleButton: {
    border: 0,
    borderRadius: 10,
    padding: "10px 16px",
    background: "transparent",
    cursor: "pointer",
    fontWeight: 700,
    color: "#475569",
  },
  roleButtonActive: {
    background: "#172033",
    color: "#ffffff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 18,
    maxWidth: 1180,
    margin: "0 auto 18px",
  },
  negotiationGrid: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: 18,
    maxWidth: 1180,
    margin: "0 auto 18px",
  },
  card: {
    background: "#ffffff",
    borderRadius: 20,
    padding: 20,
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
    border: "1px solid rgba(148, 163, 184, 0.24)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 16,
  },
  cardTitle: {
    margin: "6px 0 0",
    fontSize: 22,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    background: "#eef2ff",
    color: "#3730a3",
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 700,
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    background: "#ecfdf5",
    color: "#047857",
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 700,
  },
  infoList: {
    display: "grid",
    gap: 10,
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    padding: "10px 0",
    borderBottom: "1px solid #edf2f7",
  },
  infoLabel: {
    color: "#64748b",
    fontSize: 14,
  },
  infoValue: {
    color: "#172033",
    textAlign: "right",
    fontSize: 14,
  },
  chatBox: {
    height: 360,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 12,
    borderRadius: 16,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  message: {
    maxWidth: "82%",
    borderRadius: 16,
    padding: 12,
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
  },
  messageBuyer: {
    alignSelf: "flex-start",
    background: "#ffffff",
  },
  messageSeller: {
    alignSelf: "flex-end",
    background: "#eef2ff",
  },
  messageMeta: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    color: "#64748b",
    fontSize: 12,
    marginBottom: 4,
  },
  messageText: {
    margin: 0,
    lineHeight: 1.55,
  },
  chatInputRow: {
    display: "flex",
    gap: 10,
    marginTop: 12,
  },
  input: {
    width: "100%",
    border: "1px solid #cbd5e1",
    borderRadius: 12,
    padding: "11px 12px",
    outline: "none",
    fontSize: 14,
    background: "#ffffff",
  },
  primaryButton: {
    border: 0,
    borderRadius: 12,
    padding: "11px 16px",
    background: "#172033",
    color: "#ffffff",
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  secondaryButton: {
    border: 0,
    borderRadius: 12,
    padding: "11px 16px",
    background: "#e2e8f0",
    color: "#172033",
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  dangerButton: {
    border: 0,
    borderRadius: 12,
    padding: "11px 16px",
    background: "#fee2e2",
    color: "#991b1b",
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  disabledButton: {
    opacity: 0.45,
    cursor: "not-allowed",
  },
  actionPanel: {
    display: "grid",
    gap: 16,
    marginTop: 16,
  },
  actionGroup: {
    display: "grid",
    gap: 8,
  },
  label: {
    fontWeight: 800,
    fontSize: 14,
    color: "#334155",
  },
  inlineInput: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 10,
  },
  buttonRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  divider: {
    height: 1,
    background: "#e2e8f0",
  },
  poSoBox: {
    display: "grid",
    gap: 10,
    padding: 14,
    borderRadius: 16,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  sectionTitle: {
    margin: 0,
    fontSize: 18,
  },
  helperText: {
    margin: 0,
    color: "#64748b",
    fontSize: 14,
    lineHeight: 1.5,
  },
  warningText: {
    margin: 0,
    color: "#b45309",
    fontSize: 14,
    fontWeight: 700,
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 12,
    marginTop: 16,
  },
  summaryBox: {
    display: "grid",
    gap: 6,
    borderRadius: 16,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: 14,
  },
  summaryValue: {
    fontSize: 18,
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    display: "grid",
    placeItems: "center",
    background: "rgba(15, 23, 42, 0.54)",
    padding: 18,
    zIndex: 50,
  },
  modal: {
    width: "min(720px, 100%)",
    maxHeight: "88vh",
    overflowY: "auto",
    background: "#ffffff",
    borderRadius: 24,
    padding: 22,
    boxShadow: "0 25px 80px rgba(15, 23, 42, 0.3)",
  },
  closeButton: {
    border: 0,
    borderRadius: 10,
    padding: "8px 12px",
    background: "#e2e8f0",
    color: "#172033",
    fontWeight: 800,
    cursor: "pointer",
  },
  modalFooter: {
    marginTop: 16,
    padding: 14,
    borderRadius: 16,
    background: "#ecfdf5",
    border: "1px solid #bbf7d0",
  },
};

export default App;
