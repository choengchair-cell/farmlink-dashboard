import React, { useMemo, useState } from "react";

type UserRole = "buyer" | "seller" | "admin";

type DemoAccount = {
  username: string;
  password: string;
  role: UserRole;
  displayName: string;
};

type OfferStatus =
  | "draft"
  | "sent"
  | "buyer_requested_change"
  | "seller_accepted_buyer_terms"
  | "seller_countered"
  | "final_offer"
  | "buyer_accepted_final"
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
  sender: "buyer" | "seller";
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
  buyerRequestedPricePerUnit?: string;
  sellerAcceptedPricePerUnit?: string;
  latestAgreedPricePerUnit?: string;
  deliveryDate: string;
  shippingFee: string;
  paymentTerm: string;
  note: string;
  status: OfferStatus;
};

type SellerFulfillment = {
  preparationStatus: string;
  deliveryDate: string;
  shippingMethod: string;
  pickupOrDeliveryLocation: string;
  shippingCoordinator: string;
  shippingContact: string;
  deliveryEvidence: string;
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
  fulfillment: SellerFulfillment;
};

const demoAccounts: DemoAccount[] = [
  {
    username: "buyer_demo01",
    password: "1111",
    role: "buyer",
    displayName: "ผู้ซื้อ Demo 01",
  },
  {
    username: "seller_demo01",
    password: "1111",
    role: "seller",
    displayName: "ผู้ขาย Demo 01",
  },
  {
    username: "admin_demo01",
    password: "1111",
    role: "admin",
    displayName: "ผู้ดูแลระบบ Demo 01",
  },
];

const lockedActionCardMessage =
  "ผู้ขายต้องตอบตกลงตามราคาที่ผู้ซื้อเสนอก่อน จึงจะกรอกข้อมูลการเตรียมสินค้า ขนส่ง เอกสาร และวันส่งมอบได้";

function formatCurrencyTHB(value: number): string {
  return value.toLocaleString("th-TH", {
    maximumFractionDigits: 0,
  });
}

function normalizeNumericText(value: string | number): string {
  return String(value)
    .replace(/,/g, "")
    .replace(/บาท\/กก\.?/g, "")
    .replace(/บาทต่อกก\.?/g, "")
    .trim();
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
    buyer_requested_change: "ผู้ซื้อขอแก้ไขเงื่อนไข",
    seller_accepted_buyer_terms: "ผู้ขายตกลงตามราคาผู้ซื้อแล้ว",
    seller_countered: "ผู้ขายเสนอราคาใหม่",
    final_offer: "ส่งข้อเสนอสุดท้ายแล้ว",
    buyer_accepted_final: "ผู้ซื้อยืนยันข้อเสนอแล้ว",
    rejected: "ปฏิเสธข้อเสนอ",
  };

  return statusMap[status];
}

function getBuyerRequestedPrice(offer: Offer): string {
  return offer.buyerRequestedPricePerUnit || "";
}

function getLatestPriceForDisplay(offer: Offer): string {
  return (
    offer.latestAgreedPricePerUnit ||
    offer.sellerAcceptedPricePerUnit ||
    offer.buyerRequestedPricePerUnit ||
    offer.offeredPricePerUnit
  );
}

function canSellerUseFarmLinkActionCard(offer: Offer): boolean {
  return offer.status === "seller_accepted_buyer_terms";
}

function canBuyerCreatePoSo(offer: Offer): boolean {
  return offer.status === "seller_accepted_buyer_terms";
}

function App() {
  const [loggedInAccount, setLoggedInAccount] = useState<DemoAccount | null>(demoAccounts[0]);
  const [loginUsername, setLoginUsername] = useState("buyer_demo01");
  const [loginPassword, setLoginPassword] = useState("1111");
  const [loginError, setLoginError] = useState("");

  const currentRole: UserRole = loggedInAccount?.role || "buyer";

  const [purchaseRequest] = useState<PurchaseRequest>({
    id: "PR-2026-0001",
    productName: "ผักสลัดกรีนโอ๊ค",
    quantity: 500,
    quantityUnit: "กก.",
    targetPricePerUnit: "40",
    deliveryLocation: "โรงแรมล้านนาเฮอริเทจ, เมืองเชียงใหม่",
    requestedDeliveryDate: "2026-06-10",
    paymentTerm: "โอนภายใน 3 วันหลังส่งมอบ",
  });

  const [offer, setOffer] = useState<Offer>({
    id: "OF-2026-0001",
    purchaseRequestId: "PR-2026-0001",
    sellerName: "FarmLink Seller",
    quantity: 500,
    quantityUnit: "กก.",
    offeredPricePerUnit: "45",
    buyerRequestedPricePerUnit: "40",
    sellerAcceptedPricePerUnit: "",
    latestAgreedPricePerUnit: "",
    deliveryDate: "2026-06-10",
    shippingFee: "รวมค่าส่ง",
    paymentTerm: "โอนภายใน 3 วันหลังส่งมอบ",
    note: "ผู้ซื้อขอแก้ไขเงื่อนไขเรื่องราคาเป็น 40 บาทต่อ กก.",
    status: "buyer_requested_change",
  });

  const [fulfillment, setFulfillment] = useState<SellerFulfillment>({
    preparationStatus: "เตรียมสินค้า / คัดเกรดตามคำสั่งซื้อแล้ว",
    deliveryDate: "2026-06-10",
    shippingMethod: "ผู้ขายจัดส่งเองตามเงื่อนไขที่ตกลงในระบบ",
    pickupOrDeliveryLocation: "โรงแรมล้านนาเฮอริเทจ, เมืองเชียงใหม่",
    shippingCoordinator: "ผู้ประสานงานขนส่งของผู้ขาย",
    shippingContact: "ระบุเบอร์ติดต่อสำหรับขนส่งหลังสร้าง PO/SO",
    deliveryEvidence: "รูปสินค้าก่อนส่ง, รูปขณะโหลด, ใบน้ำหนัก, ใบส่งของ",
  });

  const [messages, setMessages] = useState<NegotiationMessage[]>([
    {
      id: "MSG-1",
      sender: "seller",
      message:
        "เสนอขายผักสลัดกรีนโอ๊ค 500 กก. ราคา 45 บาท/กก. พร้อมส่งวันที่ 10 มิ.ย. 2026",
      createdAt: "09:30",
    },
    {
      id: "MSG-2",
      sender: "buyer",
      message:
        "ผู้ซื้อขอแก้ไขเงื่อนไขสำหรับ ผักสลัดกรีนโอ๊ค เรื่องที่ต้องการแก้ไข: ราคา เงื่อนไขที่ต้องการ: ราคา 40 บาทต่อ กก. กรุณาให้ผู้ขายตรวจสอบและส่งเงื่อนไขใหม่กลับมาในแชท",
      createdAt: "09:57",
    },
  ]);

  const [sellerCounterPrice, setSellerCounterPrice] = useState("42");
  const [chatInput, setChatInput] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [isPoSoModalOpen, setIsPoSoModalOpen] = useState(false);

  const requestedPrice = getBuyerRequestedPrice(offer);
  const sellerCanUseActionCard = canSellerUseFarmLinkActionCard(offer);
  const buyerCanCreatePoSo = canBuyerCreatePoSo(offer);

  const targetTotalLabel = useMemo(() => {
    return calculateTotalAmountLabel(
      purchaseRequest.quantity,
      purchaseRequest.targetPricePerUnit
    );
  }, [purchaseRequest.quantity, purchaseRequest.targetPricePerUnit]);

  const latestTotalLabel = useMemo(() => {
    return calculateTotalAmountLabel(offer.quantity, getLatestPriceForDisplay(offer));
  }, [offer]);

  const buyerRequestedTotalLabel = useMemo(() => {
    if (!requestedPrice) return "-";
    return calculateTotalAmountLabel(offer.quantity, requestedPrice);
  }, [offer.quantity, requestedPrice]);

  function handleLogin(event?: React.FormEvent) {
    event?.preventDefault();

    const username = loginUsername.trim();
    const password = loginPassword.trim();

    const foundAccount = demoAccounts.find(
      (account) => account.username === username && account.password === password
    );

    if (!foundAccount) {
      setLoginError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      return;
    }

    setLoggedInAccount(foundAccount);
    setLoginError("");
  }

  function handleLogout() {
    setLoggedInAccount(demoAccounts[0]);
    setLoginUsername("buyer_demo01");
    setLoginPassword("1111");
    setLoginError("");
  }

  function appendMessage(sender: "buyer" | "seller", message: string) {
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

    if (currentRole === "admin") {
      appendMessage("buyer", `[ผู้ดูแลระบบ] ${trimmed}`);
    } else {
      appendMessage(currentRole, trimmed);
    }

    setChatInput("");
  }

  function handleSellerAcceptBuyerPrice() {
    if (!requestedPrice) return;

    setOffer((current) => ({
      ...current,
      sellerAcceptedPricePerUnit: requestedPrice,
      latestAgreedPricePerUnit: requestedPrice,
      status: "seller_accepted_buyer_terms",
    }));

    appendMessage(
      "seller",
      `ผู้ขายตอบตกลงตามราคาที่ผู้ซื้อเสนอ: ${requestedPrice} บาท/${offer.quantityUnit} และพร้อมดำเนินการเตรียมสินค้า/ขนส่ง`
    );
  }

  function handleSellerCounterOffer() {
    const trimmed = sellerCounterPrice.trim();
    if (!trimmed) return;

    setOffer((current) => ({
      ...current,
      offeredPricePerUnit: trimmed,
      sellerAcceptedPricePerUnit: "",
      latestAgreedPricePerUnit: trimmed,
      status: "seller_countered",
    }));

    appendMessage(
      "seller",
      `ผู้ขายยังไม่ตกลงราคา ${requestedPrice || "-"} บาท/${offer.quantityUnit} และขอเสนอราคาใหม่เป็น ${trimmed} บาท/${offer.quantityUnit}`
    );
  }

  function handleBuyerAcceptFinalOffer() {
    setOffer((current) => ({
      ...current,
      status: "buyer_accepted_final",
      latestAgreedPricePerUnit: getLatestPriceForDisplay(current),
    }));

    appendMessage("buyer", "ผู้ซื้อยืนยันข้อเสนอสุดท้ายของผู้ขายแล้ว");
  }

  function handleRejectOffer() {
    setOffer((current) => ({
      ...current,
      status: "rejected",
    }));

    if (currentRole === "seller") {
      appendMessage("seller", "ปฏิเสธข้อเสนอนี้");
    } else {
      appendMessage("buyer", "ปฏิเสธข้อเสนอนี้");
    }
  }

  function handleFulfillmentChange(field: keyof SellerFulfillment, value: string) {
    setFulfillment((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleCreatePoSo() {
    if (!buyerCanCreatePoSo) return;

    const agreedPrice = getLatestPriceForDisplay(offer);
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
      deliveryDate: fulfillment.deliveryDate,
      shippingFee: offer.shippingFee,
      paymentTerm: offer.paymentTerm,
      createdAt: new Date().toLocaleString("th-TH"),
      fulfillment,
    };

    setOrder(newOrder);
    setIsPoSoModalOpen(true);
  }

  if (!loggedInAccount) {
    return (
      <main style={styles.loginPage}>
        <form onSubmit={handleLogin} style={styles.loginCard}>
          <div style={styles.loginHeader}>
            <div>
              <h1 style={styles.loginTitle}>เข้าสู่ระบบสมาชิก</h1>
              <p style={styles.loginSubtitle}>
                กรอกชื่อผู้ใช้และรหัสผ่าน ระบบจะตรวจสอบบทบาทของบัญชีและพาไปยังหน้าผู้ซื้อ ผู้ขาย หรือผู้ดูแลระบบโดยอัตโนมัติ
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setLoggedInAccount(demoAccounts[0]);
                setLoginUsername("buyer_demo01");
                setLoginPassword("1111");
                setLoginError("");
              }}
              style={styles.closeLoginButton}
            >
              ปิด
            </button>
          </div>

          <label style={styles.loginField}>
            <span style={styles.label}>ชื่อผู้ใช้</span>
            <input
              value={loginUsername}
              onChange={(event) => setLoginUsername(event.target.value)}
              style={styles.input}
              placeholder="buyer_demo01"
              autoComplete="username"
            />
          </label>

          <label style={styles.loginField}>
            <span style={styles.label}>รหัสผ่าน</span>
            <input
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              style={styles.input}
              placeholder="1111"
              type="password"
              autoComplete="current-password"
            />
          </label>

          {loginError && <div style={styles.loginError}>{loginError}</div>}

          <button type="submit" style={styles.loginButton}>
            เข้าสู่ระบบ
          </button>

          <button
            type="button"
            onClick={() => {
              setLoginUsername("buyer_demo01");
              setLoginPassword("1111");
              setLoginError("");
            }}
            style={styles.outlineButton}
          >
            ใส่รหัส buyer_demo01 / 1111
          </button>

          <div style={styles.demoAccountBox}>
            <strong>บัญชีทดสอบ</strong>
            <p>buyer_demo01 / 1111</p>
            <p>seller_demo01 / 1111</p>
            <p>admin_demo01 / 1111</p>
          </div>
        </form>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <div>
          <p style={styles.eyebrow}>FarmLink Negotiation Gate</p>
          <h1 style={styles.title}>ผู้ขายต้องตอบตกลงราคาผู้ซื้อก่อนดำเนินการขั้นถัดไป</h1>
          <p style={styles.subtitle}>
            FarmLink Action Card สำหรับผู้ขายจะถูกล็อกไว้ จนกว่าผู้ขายจะกด “ตกลงตามราคาที่ผู้ซื้อเสนอ”
          </p>
        </div>

        <div style={styles.accountBox}>
          <strong>{loggedInAccount.displayName}</strong>
          <span>
            บทบาท:{" "}
            {loggedInAccount.role === "buyer"
              ? "ผู้ซื้อ"
              : loggedInAccount.role === "seller"
                ? "ผู้ขาย"
                : "ผู้ดูแลระบบ"}
          </span>
          <button type="button" onClick={handleLogout} style={styles.logoutButton}>
            ออกจากระบบ
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
              label="ราคาเป้าหมายผู้ซื้อ"
              value={`${purchaseRequest.targetPricePerUnit} บาท/${purchaseRequest.quantityUnit}`}
            />
            <InfoRow label="มูลค่ารวมตามราคาเป้าหมาย" value={targetTotalLabel} />
            <InfoRow label="สถานที่รับ/ส่งสินค้า" value={purchaseRequest.deliveryLocation} />
            <InfoRow label="รอบส่ง / กำหนดส่ง" value={purchaseRequest.requestedDeliveryDate} />
            <InfoRow label="เงื่อนไขชำระเงิน" value={purchaseRequest.paymentTerm} />
          </div>
        </article>

        <article style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <p style={styles.eyebrow}>สถานะข้อเสนอ</p>
              <h2 style={styles.cardTitle}>{offer.sellerName}</h2>
            </div>
            <span style={styles.statusBadge}>{getStatusLabel(offer.status)}</span>
          </div>

          <div style={styles.infoList}>
            <InfoRow
              label="ราคาที่ผู้ขายเสนอเดิม"
              value={`${offer.offeredPricePerUnit || "-"} บาท/${offer.quantityUnit}`}
            />
            <InfoRow
              label="ราคาที่ผู้ซื้อขอแก้ไข"
              value={
                requestedPrice ? `${requestedPrice} บาท/${offer.quantityUnit}` : "-"
              }
            />
            <InfoRow label="มูลค่ารวมตามราคาผู้ซื้อ" value={buyerRequestedTotalLabel} />
            <InfoRow
              label="ราคาที่ผู้ขายตอบตกลง"
              value={
                offer.sellerAcceptedPricePerUnit
                  ? `${offer.sellerAcceptedPricePerUnit} บาท/${offer.quantityUnit}`
                  : "-"
              }
            />
            <InfoRow label="มูลค่ารวมล่าสุด" value={latestTotalLabel} />
            <InfoRow label="หมายเหตุ" value={offer.note} />
          </div>
        </article>
      </section>

      <section style={styles.negotiationGrid}>
        <article style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <p style={styles.eyebrow}>แชทการจัดซื้อ</p>
              <h2 style={styles.cardTitle}>ราคาและเงื่อนไขต้องตกลงกันในแชทก่อน</h2>
            </div>
            <span style={styles.badge}>
              โหมด:{" "}
              {currentRole === "buyer"
                ? "ผู้ซื้อ"
                : currentRole === "seller"
                  ? "ผู้ขาย"
                  : "ผู้ดูแลระบบ"}
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
              placeholder="พิมพ์ข้อความเกี่ยวกับราคา ปริมาณ ขนส่ง เอกสาร หรือวันส่งมอบ"
              style={styles.input}
            />
            <button type="button" onClick={handleSendChat} style={styles.primaryButton}>
              ส่งข้อความ
            </button>
          </div>
        </article>

        <article style={styles.card}>
          <p style={styles.eyebrow}>Seller Price Confirmation</p>
          <h2 style={styles.cardTitle}>ผู้ขายต้องตอบตกลงตามราคาที่ผู้ซื้อเสนอ</h2>

          <div style={styles.buyerRequestBox}>
            <p style={styles.helperText}>ราคาที่ผู้ซื้อขอแก้ไข</p>
            <strong style={styles.requestedPrice}>
              {requestedPrice ? `${requestedPrice} บาท/${offer.quantityUnit}` : "-"}
            </strong>
            <p style={styles.helperText}>มูลค่ารวม: {buyerRequestedTotalLabel}</p>
          </div>

          <div style={styles.buttonColumn}>
            <button
              type="button"
              onClick={handleSellerAcceptBuyerPrice}
              disabled={currentRole !== "seller" || !requestedPrice}
              style={{
                ...styles.primaryButton,
                ...((currentRole !== "seller" || !requestedPrice) ? styles.disabledButton : {}),
              }}
            >
              ตกลงตามราคาที่ผู้ซื้อเสนอ
            </button>

            <div style={styles.actionGroup}>
              <label style={styles.label}>ถ้าไม่ตกลง ให้เสนอราคาใหม่</label>
              <div style={styles.inlineInput}>
                <input
                  value={sellerCounterPrice}
                  onChange={(event) => setSellerCounterPrice(event.target.value)}
                  style={styles.input}
                  placeholder="เช่น 42"
                />
                <button
                  type="button"
                  onClick={handleSellerCounterOffer}
                  disabled={currentRole !== "seller"}
                  style={{
                    ...styles.secondaryButton,
                    ...(currentRole !== "seller" ? styles.disabledButton : {}),
                  }}
                >
                  เสนอราคาใหม่
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBuyerAcceptFinalOffer}
              disabled={currentRole !== "buyer" || offer.status !== "seller_countered"}
              style={{
                ...styles.secondaryButton,
                ...((currentRole !== "buyer" || offer.status !== "seller_countered")
                  ? styles.disabledButton
                  : {}),
              }}
            >
              ผู้ซื้อยืนยันข้อเสนอใหม่ของผู้ขาย
            </button>

            <button type="button" onClick={handleRejectOffer} style={styles.dangerButton}>
              ปฏิเสธข้อเสนอ
            </button>
          </div>
        </article>
      </section>

      <section style={styles.card}>
        <div style={styles.actionCardHeader}>
          <div>
            <p style={styles.eyebrow}>FarmLink Action Card สำหรับผู้ขาย</p>
            <h2 style={styles.cardTitle}>ขั้นตอนที่ 8: ดำเนินการส่งสินค้า</h2>
            <p style={styles.subtitleSmall}>
              ผู้ขายกรอกข้อมูลการเตรียมสินค้า รอบส่ง ผู้ประสานงาน และเอกสารส่งมอบ
            </p>
          </div>
          <span
            style={{
              ...styles.pill,
              ...(sellerCanUseActionCard ? styles.pillReady : styles.pillLocked),
            }}
          >
            {sellerCanUseActionCard ? "เปิดให้ดำเนินการแล้ว" : "ล็อกไว้ก่อน"}
          </span>
        </div>

        {!sellerCanUseActionCard && (
          <div style={styles.lockedNotice}>
            <strong>ยังดำเนินการขั้นตอนนี้ไม่ได้</strong>
            <p>{lockedActionCardMessage}</p>
            <p>
              ให้ผู้ขายกดปุ่ม “ตกลงตามราคาที่ผู้ซื้อเสนอ” ที่ราคา{" "}
              <strong>{requestedPrice || "-"} บาท/{offer.quantityUnit}</strong> ก่อน
            </p>
          </div>
        )}

        <fieldset disabled={!sellerCanUseActionCard} style={styles.fieldset}>
          <div style={styles.formGrid}>
            <FormField label="สถานะการเตรียมสินค้า">
              <select
                value={fulfillment.preparationStatus}
                onChange={(event) =>
                  handleFulfillmentChange("preparationStatus", event.target.value)
                }
                style={styles.input}
              >
                <option>เตรียมสินค้า / คัดเกรดตามคำสั่งซื้อแล้ว</option>
                <option>กำลังเตรียมสินค้า</option>
                <option>รอคัดเกรดสินค้า</option>
              </select>
            </FormField>

            <FormField label="รอบส่ง / กำหนดส่ง">
              <input
                value={fulfillment.deliveryDate}
                onChange={(event) =>
                  handleFulfillmentChange("deliveryDate", event.target.value)
                }
                style={styles.input}
              />
            </FormField>

            <FormField label="รูปแบบขนส่ง">
              <select
                value={fulfillment.shippingMethod}
                onChange={(event) =>
                  handleFulfillmentChange("shippingMethod", event.target.value)
                }
                style={styles.input}
              >
                <option>ผู้ขายจัดส่งเองตามเงื่อนไขที่ตกลงในระบบ</option>
                <option>ผู้ซื้อเข้ารับสินค้าเอง</option>
                <option>ขนส่งบุคคลที่สาม</option>
              </select>
            </FormField>

            <FormField label="สถานที่รับ/ส่งสินค้า">
              <input
                value={fulfillment.pickupOrDeliveryLocation}
                onChange={(event) =>
                  handleFulfillmentChange("pickupOrDeliveryLocation", event.target.value)
                }
                style={styles.input}
              />
            </FormField>

            <FormField label="ผู้ประสานงานขนส่ง">
              <input
                value={fulfillment.shippingCoordinator}
                onChange={(event) =>
                  handleFulfillmentChange("shippingCoordinator", event.target.value)
                }
                style={styles.input}
              />
            </FormField>

            <FormField label="เบอร์ติดต่อสำหรับขนส่ง">
              <input
                value={fulfillment.shippingContact}
                onChange={(event) =>
                  handleFulfillmentChange("shippingContact", event.target.value)
                }
                style={styles.input}
              />
            </FormField>
          </div>

          <FormField label="เอกสาร / หลักฐานที่จะใช้ส่งมอบ">
            <input
              value={fulfillment.deliveryEvidence}
              onChange={(event) =>
                handleFulfillmentChange("deliveryEvidence", event.target.value)
              }
              style={styles.input}
            />
          </FormField>
        </fieldset>

        <div style={styles.poSoRow}>
          <div>
            <h3 style={styles.sectionTitle}>สร้าง PO/SO</h3>
            <p style={styles.helperText}>
              สร้างได้หลังจากผู้ขายตกลงราคาผู้ซื้อแล้วเท่านั้น เพื่อให้ PO/SO เป็นเอกสารยืนยัน ไม่ใช่พื้นที่ต่อรอง
            </p>
          </div>
          <button
            type="button"
            onClick={handleCreatePoSo}
            disabled={!buyerCanCreatePoSo}
            style={{
              ...styles.primaryButton,
              ...(!buyerCanCreatePoSo ? styles.disabledButton : {}),
            }}
          >
            สร้าง / เปิด PO/SO
          </button>
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
                label="ราคาต่อหน่วยที่ตกลง"
                value={`${order.pricePerUnit} บาท/${order.quantityUnit}`}
              />
              <InfoRow label="มูลค่ารวม" value={order.totalAmountLabel} />
              <InfoRow label="วันส่งมอบ" value={order.deliveryDate} />
              <InfoRow label="ค่าขนส่ง" value={order.shippingFee} />
              <InfoRow label="เงื่อนไขชำระเงิน" value={order.paymentTerm} />
              <InfoRow label="สถานะการเตรียมสินค้า" value={order.fulfillment.preparationStatus} />
              <InfoRow label="รูปแบบขนส่ง" value={order.fulfillment.shippingMethod} />
              <InfoRow label="สถานที่รับ/ส่งสินค้า" value={order.fulfillment.pickupOrDeliveryLocation} />
              <InfoRow label="ผู้ประสานงานขนส่ง" value={order.fulfillment.shippingCoordinator} />
              <InfoRow label="เบอร์ติดต่อสำหรับขนส่ง" value={order.fulfillment.shippingContact} />
              <InfoRow label="เอกสารส่งมอบ" value={order.fulfillment.deliveryEvidence} />
              <InfoRow label="สร้างเมื่อ" value={order.createdAt} />
            </div>

            <div style={styles.modalFooter}>
              <p style={styles.helperText}>
                PO/SO นี้สร้างจากราคาที่ผู้ขายตอบตกลงตามราคาผู้ซื้อแล้ว
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

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label style={styles.formField}>
      <span style={styles.label}>{label}</span>
      {children}
    </label>
  );
}

const styles: Record<string, React.CSSProperties> = {
  loginPage: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#f6f7fb",
    color: "#172033",
    padding: 20,
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  loginCard: {
    width: "min(540px, 100%)",
    background: "#ffffff",
    borderRadius: 20,
    padding: 28,
    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.12)",
    border: "1px solid rgba(148, 163, 184, 0.24)",
  },
  loginHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 20,
  },
  loginTitle: {
    margin: "0 0 8px",
    fontSize: 30,
    lineHeight: 1.2,
  },
  loginSubtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: 15,
    lineHeight: 1.6,
  },
  closeLoginButton: {
    border: 0,
    background: "transparent",
    color: "#94a3b8",
    fontWeight: 800,
    cursor: "pointer",
    fontSize: 16,
  },
  loginField: {
    display: "grid",
    gap: 8,
    marginBottom: 16,
  },
  loginButton: {
    width: "100%",
    border: 0,
    borderRadius: 10,
    padding: "14px 16px",
    background: "#07855f",
    color: "#ffffff",
    fontWeight: 900,
    cursor: "pointer",
    fontSize: 16,
    marginTop: 10,
  },
  outlineButton: {
    width: "100%",
    border: "1px solid #cbd5e1",
    borderRadius: 10,
    padding: "12px 16px",
    background: "#ffffff",
    color: "#334155",
    fontWeight: 800,
    cursor: "pointer",
    fontSize: 15,
    marginTop: 10,
  },
  loginError: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    borderRadius: 12,
    padding: "10px 12px",
    fontWeight: 800,
    marginTop: 4,
  },
  demoAccountBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#475569",
    fontSize: 14,
    lineHeight: 1.4,
  },
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
  subtitleSmall: {
    margin: "6px 0 0",
    color: "#2563eb",
    fontSize: 14,
    lineHeight: 1.5,
  },
  accountBox: {
    display: "grid",
    gap: 6,
    background: "#ffffff",
    borderRadius: 16,
    padding: 14,
    minWidth: 210,
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
    color: "#334155",
    fontSize: 14,
  },
  logoutButton: {
    border: 0,
    borderRadius: 10,
    padding: "8px 12px",
    background: "#fee2e2",
    color: "#991b1b",
    fontWeight: 800,
    cursor: "pointer",
    marginTop: 4,
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
    gridTemplateColumns: "1.35fr 1fr",
    gap: 18,
    maxWidth: 1180,
    margin: "0 auto 18px",
  },
  card: {
    maxWidth: 1180,
    margin: "0 auto 18px",
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
    height: 340,
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
    maxWidth: "84%",
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
    boxSizing: "border-box",
  },
  primaryButton: {
    border: 0,
    borderRadius: 12,
    padding: "11px 16px",
    background: "#07855f",
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
  buyerRequestBox: {
    display: "grid",
    gap: 6,
    padding: 16,
    borderRadius: 16,
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    marginTop: 16,
    marginBottom: 16,
  },
  requestedPrice: {
    fontSize: 30,
    color: "#1d4ed8",
  },
  buttonColumn: {
    display: "grid",
    gap: 12,
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
  actionCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 16,
  },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    padding: "10px 16px",
    fontSize: 13,
    fontWeight: 900,
    whiteSpace: "nowrap",
  },
  pillReady: {
    background: "#dcfce7",
    color: "#166534",
  },
  pillLocked: {
    background: "#e0f2fe",
    color: "#075985",
  },
  lockedNotice: {
    padding: 16,
    borderRadius: 16,
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    color: "#9a3412",
    marginBottom: 16,
  },
  fieldset: {
    border: 0,
    padding: 0,
    margin: 0,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 14,
    marginBottom: 14,
  },
  formField: {
    display: "grid",
    gap: 8,
  },
  poSoRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "center",
    marginTop: 18,
    padding: 16,
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
    width: "min(760px, 100%)",
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
