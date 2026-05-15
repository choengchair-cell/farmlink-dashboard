import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";

type Role = "buyer" | "seller" | "admin";
type LoginMode = "buyer" | "seller" | "admin" | "buyerGate";

type User = {
  id: string;
  username: string;
  displayName: string;
  role: Role;
  province?: string;
  organizationType?: string;
  verificationStatus?: string;
};

type RegistrationInput = {
  role: "buyer" | "seller";
  username: string;
  password: string;
  displayName: string;
  province: string;
  organizationType: string;
};

type ProductStatus = "draft" | "pending_review" | "active" | "rejected" | "suspended";
type StockStatus = "available" | "limited" | "reserved" | "out_of_stock" | "harvesting_soon";
type DeliveryAreaType = "same_district" | "same_province" | "nearby_province" | "nationwide" | "custom";
type ShippingFeePolicy = "included" | "buyer_pays" | "seller_pays" | "shared" | "quoted_later";
type ParcelCarrierRecommendation = "thailand_post" | "other" | "not_recommended";


type ReviewFormState = {
  qualityRating: number;
  deliveryRating: number;
  documentRating: number;
  comment: string;
};

type PurchaseRequestFormState = {
  requestedQuantity: string;
  deliveryLocation: string;
  deliveryDate: string;
  targetPrice: string;
  qualitySpec: string;
  deliveryPreference: string;
  logisticsNote: string;
};

type PublicProduct = {
  id: string;
  sellerId: string;
  productName: string;
  category: string;
  area: string;
  quantityText: string;
  quality: string;
  priceRange: string;
  availableDate: string;
  season: string;
  status: ProductStatus;
  availableQuantity: number;
  reservedQuantity: number;
  soldQuantity: number;
  unit: string;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  stockStatus: StockStatus;
  sellerCanDeliver?: boolean;
  deliveryAreaType?: DeliveryAreaType;
  deliveryAreaText?: string;
  minimumSellerDeliveryQuantity?: number;
  minimumSellerDeliveryUnit?: string;
  shippingFeePolicy?: ShippingFeePolicy;
  shippingFeeAmount?: number;
  shippingFeeNote?: string;
  buyerPickupAvailable?: boolean;
  pickupLocationText?: string;
  thirdPartyLogisticsAvailable?: boolean;
  coldChainAvailable?: boolean;
  vehicleTypes?: string[];
  deliveryNote?: string;
  parcelShippingAllowed?: boolean;
  parcelCarrierRecommendation?: ParcelCarrierRecommendation;
  parcelCarrierName?: string;
  parcelMaxWeightKg?: number;
  parcelClaimSupported?: boolean;
  parcelClaimNote?: string;
  bulkTransportRecommendedAboveKg?: number;
  bulkShippingMinKg?: number;
  sellerOwnVehicleAvailable?: boolean;
  localHiredVehicleAvailable?: boolean;
  interProvinceLogisticsAvailable?: boolean;
  imageUrl?: string;
  isDemo?: boolean;
};

type ProductFormState = {
  productName: string;
  category: string;
  area: string;
  quantityText: string;
  quality: string;
  priceRange: string;
  availableDate: string;
  season: string;
  availableQuantity: string;
  reservedQuantity: string;
  soldQuantity: string;
  unit: string;
  minOrderQuantity: string;
  maxOrderQuantity: string;
  stockStatus: string;
  sellerCanDeliver: string;
  deliveryAreaType: string;
  deliveryAreaText: string;
  minimumSellerDeliveryQuantity: string;
  minimumSellerDeliveryUnit: string;
  shippingFeePolicy: string;
  shippingFeeAmount: string;
  shippingFeeNote: string;
  buyerPickupAvailable: string;
  pickupLocationText: string;
  thirdPartyLogisticsAvailable: string;
  coldChainAvailable: string;
  vehicleTypes: string;
  deliveryNote: string;
  parcelShippingAllowed: string;
  parcelCarrierName: string;
  parcelMaxWeightKg: string;
  parcelClaimSupported: string;
  parcelClaimNote: string;
  bulkTransportRecommendedAboveKg: string;
  bulkShippingMinKg: string;
  sellerOwnVehicleAvailable: string;
  localHiredVehicleAvailable: string;
  interProvinceLogisticsAvailable: string;
  imageUrl?: string;
};

type PurchaseRequest = {
  id: string;
  buyerId: string;
  sellerId?: string;
  productId?: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  qualitySpec: string;
  deliveryLocation: string;
  deliveryDate: string;
  targetPrice: string;
  status: string;
  riskLevel: "ต่ำ" | "ปานกลาง" | "สูง";
  offers: number;
};

type Offer = {
  id: string;
  requestId: string;
  buyerId: string;
  sellerId: string;
  sellerName: string;
  area: string;
  quantity: number;
  price: number;
  deliveryDate: string;
  trustScore: number;
  verificationStatus: string;
  status: string;
  risk: string;
};

type Order = {
  id: string;
  requestId: string;
  salesOfferId?: string;
  salesOrderId?: string;
  buyerId: string;
  sellerId: string;
  productName: string;
  buyerName: string;
  sellerName: string;
  quantity: number;
  price: number;
  deliveryDate: string;
  status: string;
  proofStatus: string;
};

type TradeDocumentSelection = {
  kind: "po" | "so";
  documentId: string;
  linkedPoId?: string;
  linkedSoId?: string;
};

type RiskAlert = {
  id: string;
  type: string;
  relatedItem: string;
  severity: "ต่ำ" | "ปานกลาง" | "สูง";
  score: number;
  reason: string;
  status: string;
};

type AuditLog = {
  id: string;
  actor: string;
  role: string;
  action: string;
  item: string;
  timestamp: string;
};

type SellerPerformance = {
  sellerId: string;
  completedOrders: number;
  onTimeDeliveries: number;
  lateDeliveries: number;
  cancelledOrders: number;
  disputeCount: number;
  averageQualityRating: number;
  averageDeliveryRating: number;
  averageDocumentRating: number;
};

type BuyerReview = {
  id: string;
  productName: string;
  sellerId: string;
  buyerId: string;
  orderId: string;
  qualityRating: number;
  deliveryRating: number;
  documentRating: number;
  comment: string;
  status: "pending_review" | "published" | "hidden";
  createdAt: string;
};

type ChatThread = {
  id: string;
  threadType: "rfq" | "order" | "dispute";
  rfqId?: string;
  orderId?: string;
  productId?: string;
  buyerId: string;
  sellerId: string;
  status: "open" | "closed" | "flagged";
  createdAt: string;
  updatedAt: string;
};

type ChatMessage = {
  id: string;
  threadId: string;
  senderId: string;
  senderRole: "buyer" | "seller" | "admin" | "system";
  message: string;
  messageType: "user_message" | "system_warning" | "admin_warning";
  riskLevel?: "low" | "medium" | "high";
  riskReasons?: string[];
  readBy?: string[];
  createdAt: string;
};

type ChatSendOptions = {
  skipRisk?: boolean;
};


type ChatRiskResult = {
  riskLevel: "low" | "medium" | "high";
  riskReasons: string[];
  warning?: string;
};

type WorkflowStepKey =
  | "rfq_created"
  | "chat_opened"
  | "seller_replied"
  | "offer_sent"
  | "buyer_accepted"
  | "order_created"
  | "delivery_contact_revealed"
  | "delivery_in_progress"
  | "delivery_proof_uploaded"
  | "buyer_confirmed_delivery"
  | "payment_proof_uploaded"
  | "seller_confirmed_payment"
  | "review_completed"
  | "closed";

type WorkflowStepStatus = "pending" | "current" | "completed" | "blocked";

type WorkflowStep = {
  id: string;
  key: WorkflowStepKey;
  label: string;
  description: string;
  actor: "buyer" | "seller" | "admin" | "system";
  status: WorkflowStepStatus;
};

type WorkflowTemplate = {
  id: string;
  name: string;
  description: string;
  steps: Omit<WorkflowStep, "status">[];
  isDefault: boolean;
};

const adminWorkflowTemplate: WorkflowTemplate = {
  id: "WF-FRESH-PRODUCE-DEFAULT",
  name: "ขั้นตอนมาตรฐานการจัดซื้อสินค้าเกษตร",
  description:
    "Workflow ที่ผู้ดูแลระบบกำหนดสำหรับกำกับแชทตั้งแต่คำขอซื้อ การส่งมอบ ไปจนถึงรับเงิน",
  isDefault: true,
  steps: [
    {
      id: "STEP-01",
      key: "rfq_created",
      label: "ส่งคำขอซื้อ",
      description: "ผู้ซื้อสร้างคำขอซื้อพร้อมปริมาณ วันรับสินค้า และเงื่อนไขขนส่ง",
      actor: "buyer",
    },
    {
      id: "STEP-02",
      key: "chat_opened",
      label: "เปิดแชทการจัดซื้อ",
      description: "ระบบเปิดห้องแชทที่ผูกกับคำขอซื้อเพื่อเก็บข้อตกลงไว้ใน FarmLink",
      actor: "system",
    },
    {
      id: "STEP-03",
      key: "seller_replied",
      label: "ผู้ขายตอบกลับ",
      description: "ผู้ขายตรวจคำขอซื้อและตอบคำถามเรื่องปริมาณ ราคา ขนส่ง หรือเอกสาร",
      actor: "seller",
    },
    {
      id: "STEP-04",
      key: "offer_sent",
      label: "ผู้ขายส่งข้อเสนอขาย",
      description: "ผู้ขายยืนยันราคา ปริมาณ วันส่งมอบ ค่าขนส่ง และเงื่อนไขชำระเงิน",
      actor: "seller",
    },
    {
      id: "STEP-05",
      key: "buyer_accepted",
      label: "ผู้ซื้อยืนยันข้อเสนอ",
      description: "ผู้ซื้อยอมรับข้อเสนอและระบบเตรียมสร้างคำสั่งซื้อ",
      actor: "buyer",
    },
    {
      id: "STEP-06",
      key: "order_created",
      label: "สร้าง PO / SO",
      description: "ระบบสร้าง PO ฝั่งผู้ซื้อ และ SO ฝั่งผู้ขาย เพื่อบันทึกข้อตกลงหลักเรื่องราคา ปริมาณ ขนส่ง วันส่งมอบ และเงื่อนไขชำระเงิน",
      actor: "system",
    },
    {
      id: "STEP-07",
      key: "delivery_contact_revealed",
      label: "เปิดข้อมูลติดต่อขนส่ง",
      description: "ระบบเปิดข้อมูลติดต่อที่จำเป็นสำหรับการส่งมอบเท่านั้น หลังมีคำสั่งซื้อแล้ว",
      actor: "system",
    },
    {
      id: "STEP-08",
      key: "delivery_in_progress",
      label: "ดำเนินการส่งสินค้า",
      description: "ผู้ขายจัดส่งสินค้าและประสานงานตามเงื่อนไขขนส่งที่ตกลงในระบบ",
      actor: "seller",
    },
    {
      id: "STEP-09",
      key: "delivery_proof_uploaded",
      label: "อัปโหลดหลักฐานส่งมอบ",
      description: "ผู้ขายอัปโหลดรูปสินค้า ใบน้ำหนัก ใบส่งของ หรือหลักฐานส่งมอบอื่น ๆ",
      actor: "seller",
    },
    {
      id: "STEP-10",
      key: "buyer_confirmed_delivery",
      label: "ผู้ซื้อยืนยันรับสินค้า",
      description: "ผู้ซื้อตรวจสินค้าและกดยืนยันรับสินค้า หรือเปิดข้อพิพาทหากมีปัญหา",
      actor: "buyer",
    },
    {
      id: "STEP-11",
      key: "payment_proof_uploaded",
      label: "ข้อมูลชำระเงิน / หลักฐานชำระเงิน",
      description: "หลังผู้ซื้อยืนยันรับสินค้า ผู้ขายส่งข้อมูลบัญชีสำหรับชำระเงิน จากนั้นผู้ซื้อส่งหลักฐานชำระเงินตามเงื่อนไขที่ตกลงไว้",
      actor: "seller",
    },
    {
      id: "STEP-12",
      key: "seller_confirmed_payment",
      label: "ผู้ขายยืนยันรับเงิน",
      description: "ผู้ขายยืนยันว่าได้รับเงินครบถ้วนแล้ว",
      actor: "seller",
    },
    {
      id: "STEP-13",
      key: "review_completed",
      label: "รีวิวหลังธุรกรรม",
      description: "ผู้ซื้อรีวิวคุณภาพสินค้า การส่งมอบ และเอกสารหลังธุรกรรมเสร็จสมบูรณ์",
      actor: "buyer",
    },
    {
      id: "STEP-14",
      key: "closed",
      label: "ปิดธุรกรรม",
      description: "ระบบปิดรายการพร้อม audit trail สำหรับตรวจสอบย้อนหลัง",
      actor: "system",
    },
  ],
};

const demoUsers: User[] = [
  {
    id: "seller_demo_01",
    username: "seller_demo_01",
    displayName: "ไร่สุขใจ แม่ริม",
    role: "seller",
    province: "เชียงใหม่",
    organizationType: "เกษตรกรรายย่อย",
    verificationStatus: "verified",
  },
  {
    id: "seller_demo_02",
    username: "seller_demo_02",
    displayName: "สหกรณ์ผักปลอดภัยเชียงใหม่",
    role: "seller",
    province: "เชียงใหม่",
    organizationType: "สหกรณ์ / ผู้รวบรวมสินค้าเกษตร",
    verificationStatus: "verified",
  },
  {
    id: "seller_demo_03",
    username: "seller_demo_03",
    displayName: "กลุ่มเกษตรอินทรีย์สันทราย",
    role: "seller",
    province: "เชียงใหม่",
    organizationType: "กลุ่มเกษตรกร",
    verificationStatus: "verified",
  },
  {
    id: "seller_demo_04",
    username: "seller_demo_04",
    displayName: "วิสาหกิจชุมชนเกษตรแม่แตง",
    role: "seller",
    province: "เชียงใหม่",
    organizationType: "วิสาหกิจชุมชน",
    verificationStatus: "pending",
  },
  {
    id: "buyer_demo_01",
    username: "buyer_demo_01",
    displayName: "โรงแรมล้านนาเฮอริเทจ",
    role: "buyer",
    province: "เชียงใหม่",
    organizationType: "โรงแรม / ร้านอาหาร / ผู้ซื้อ B2B",
    verificationStatus: "verified",
  },
  {
    id: "admin_demo_01",
    username: "useradmin",
    displayName: "ผู้ดูแลระบบ",
    role: "admin",
    organizationType: "FarmLink Operations",
    verificationStatus: "verified",
  },
];

const initialRequests: PurchaseRequest[] = [
  {
    id: "REQ-001",
    buyerId: "buyer_demo_01",
    sellerId: "seller_demo_01",
    productId: "PUB-001",
    productName: "ผักสลัดกรีนโอ๊ค",
    category: "ผัก",
    quantity: 500,
    unit: "กก.",
    qualitySpec: "GAP, สด, คัดเกรด",
    deliveryLocation: "โรงแรมล้านนาเฮอริเทจ, เมืองเชียงใหม่",
    deliveryDate: "10 มิ.ย. 2026",
    targetPrice: "55-70 บาท/กก.",
    status: "เปิดรับข้อเสนอ",
    riskLevel: "ต่ำ",
    offers: 3,
  },
  {
    id: "REQ-002",
    buyerId: "buyer_demo_01",
    sellerId: "seller_demo_03",
    productId: "PUB-002",
    productName: "มะเขือเทศราชินี",
    category: "ผัก/ผลไม้",
    quantity: 300,
    unit: "กก.",
    qualitySpec: "สุกพอดี, ขนาดสม่ำเสมอ",
    deliveryLocation: "ครัวกลางโรงเรียนเชียงใหม่",
    deliveryDate: "12 มิ.ย. 2026",
    targetPrice: "38-48 บาท/กก.",
    status: "กำลังคัดเลือกผู้ขาย",
    riskLevel: "ต่ำ",
    offers: 2,
  },
  {
    id: "REQ-003",
    buyerId: "buyer_demo_01",
    sellerId: "seller_demo_02",
    productId: "PUB-003",
    productName: "ข้าวหอมมะลิ",
    category: "ธัญพืช",
    quantity: 2,
    unit: "ตัน",
    qualitySpec: "หอมมะลิใหม่, ความชื้นไม่เกิน 14%",
    deliveryLocation: "บริษัท FreshHub Distribution",
    deliveryDate: "20 มิ.ย. 2026",
    targetPrice: "ตามราคากลางพื้นที่",
    status: "รออนุมัติ",
    riskLevel: "ปานกลาง",
    offers: 1,
  },
];

const initialOffers: Offer[] = [
  {
    id: "OFF-001",
    requestId: "REQ-001",
    buyerId: "buyer_demo_01",
    sellerId: "seller_demo_02",
    sellerName: "สหกรณ์ผักปลอดภัยเชียงใหม่",
    area: "สันทราย, เชียงใหม่",
    quantity: 500,
    price: 62,
    deliveryDate: "10 มิ.ย. 2026",
    trustScore: 91,
    verificationStatus: "ตรวจสอบแล้ว",
    status: "รอผู้ซื้อพิจารณา",
    risk: "ไม่มี",
  },
  {
    id: "OFF-002",
    requestId: "REQ-001",
    buyerId: "buyer_demo_01",
    sellerId: "seller_demo_01",
    sellerName: "ไร่สุขใจ แม่ริม",
    area: "แม่ริม, เชียงใหม่",
    quantity: 450,
    price: 60,
    deliveryDate: "10 มิ.ย. 2026",
    trustScore: 86,
    verificationStatus: "ตรวจสอบแล้ว",
    status: "รอผู้ซื้อพิจารณา",
    risk: "ใบรับรองหมดอายุใน 30 วัน",
  },
  {
    id: "OFF-003",
    requestId: "REQ-002",
    buyerId: "buyer_demo_01",
    sellerId: "seller_demo_03",
    sellerName: "กลุ่มเกษตรอินทรีย์สันทราย",
    area: "สันทราย, เชียงใหม่",
    quantity: 300,
    price: 43,
    deliveryDate: "12 มิ.ย. 2026",
    trustScore: 82,
    verificationStatus: "ตรวจสอบแล้ว",
    status: "รอผู้ซื้อพิจารณา",
    risk: "ไม่มี",
  },
];

const initialOrders: Order[] = [
  {
    id: "PO-2026-0001",
    salesOrderId: "SO-2026-0001",
    requestId: "REQ-002",
    salesOfferId: "OFF-003",
    buyerId: "buyer_demo_01",
    sellerId: "seller_demo_03",
    productName: "มะเขือเทศราชินี",
    buyerName: "โรงแรมล้านนาเฮอริเทจ",
    sellerName: "กลุ่มเกษตรอินทรีย์สันทราย",
    quantity: 300,
    price: 43,
    deliveryDate: "12 มิ.ย. 2026",
    status: "อยู่ระหว่างส่งมอบ",
    proofStatus: "รอหลักฐานการส่งมอบ",
  },
  {
    id: "PO-2026-0002",
    salesOrderId: "SO-2026-0002",
    requestId: "REQ-004",
    buyerId: "buyer_demo_01",
    sellerId: "seller_demo_04",
    productName: "ลำไย",
    buyerName: "บริษัท FreshHub Distribution",
    sellerName: "วิสาหกิจชุมชนเกษตรแม่แตง",
    quantity: 1000,
    price: 28,
    deliveryDate: "18 มิ.ย. 2026",
    status: "ส่งมอบแล้ว",
    proofStatus: "รอผู้ซื้อยืนยัน",
  },
];

const initialChatThreads: ChatThread[] = [
  {
    id: "CHAT-REQ-001",
    threadType: "rfq",
    rfqId: "REQ-001",
    productId: "PUB-001",
    buyerId: "buyer_demo_01",
    sellerId: "seller_demo_01",
    status: "open",
    createdAt: "2026-05-13T09:15:00.000Z",
    updatedAt: "2026-05-13T09:15:00.000Z",
  },
];

const initialChatMessages: ChatMessage[] = [
  {
    id: "MSG-001",
    threadId: "CHAT-REQ-001",
    senderId: "buyer_demo_01",
    senderRole: "buyer",
    messageType: "user_message",
    message: "สวัสดีครับ สนใจผักสลัดกรีนโอ๊ค 500 กก. อยากสอบถามรอบจัดส่งและเงื่อนไขขนส่งครับ",
    riskLevel: "low",
    riskReasons: [],
    readBy: ["buyer_demo_01"],
    createdAt: "2026-05-13T09:16:00.000Z",
  },
];


const CHAT_THREADS_STORAGE_KEY = "farmlink_chat_threads";
const CHAT_MESSAGES_STORAGE_KEY = "farmlink_chat_messages";
const PRODUCTS_STORAGE_KEY = "farmlink_products";
const REQUESTS_STORAGE_KEY = "farmlink_purchase_requests";
const OFFERS_STORAGE_KEY = "farmlink_offers";
const ORDERS_STORAGE_KEY = "farmlink_orders";
const REVIEWS_STORAGE_KEY = "farmlink_reviews";
const REGISTERED_USERS_STORAGE_KEY = "farmlink_registered_users";

function loadStoredArray<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;

  try {
    const storedValue = window.localStorage.getItem(key);
    if (!storedValue) return fallback;

    const parsedValue = JSON.parse(storedValue);
    return Array.isArray(parsedValue) ? (parsedValue as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function saveStoredArray<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures in demo mode.
  }
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function imageFileToStoredDataUrl(file: File) {
  const originalDataUrl = await fileToDataUrl(file);

  return new Promise<string>((resolve) => {
    const image = new Image();

    image.onload = () => {
      const maxSize = 1200;
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        resolve(originalDataUrl);
        return;
      }

      canvas.width = width;
      canvas.height = height;
      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.82) || originalDataUrl);
    };

    image.onerror = () => resolve(originalDataUrl);
    image.src = originalDataUrl;
  });
}

const initialRisks: RiskAlert[] = [
  {
    id: "RISK-001",
    type: "ปริมาณผิดปกติ",
    relatedItem: "REQ-003 ข้าวหอมมะลิ 2 ตัน",
    severity: "ปานกลาง",
    score: 58,
    reason: "คำขอซื้อมีปริมาณสูงกว่าธุรกรรมเดิมของผู้ซื้อรายนี้",
    status: "ติดตามต่อ",
  },
  {
    id: "RISK-002",
    type: "หลักฐานส่งมอบไม่ครบ",
    relatedItem: "PO-2026-0001 มะเขือเทศราชินี",
    severity: "สูง",
    score: 76,
    reason: "ยังไม่มีใบน้ำหนักและรูปสินค้าก่อนส่งมอบ",
    status: "รอตรวจสอบ",
  },
];

const initialAuditLogs: AuditLog[] = [
  {
    id: "LOG-001",
    actor: "โรงแรมล้านนาเฮอริเทจ",
    role: "ผู้ซื้อ",
    action: "สร้างคำขอซื้อ",
    item: "REQ-001 ผักสลัดกรีนโอ๊ค",
    timestamp: "13 พ.ค. 2026 09:10",
  },
  {
    id: "LOG-002",
    actor: "สหกรณ์ผักปลอดภัยเชียงใหม่",
    role: "ผู้ขาย/เกษตรกร",
    action: "ส่งข้อเสนอขาย",
    item: "OFF-001 สำหรับ REQ-001",
    timestamp: "13 พ.ค. 2026 10:25",
  },
  {
    id: "LOG-003",
    actor: "ผู้ดูแลระบบ",
    role: "ผู้ดูแลระบบ",
    action: "ตรวจพบความเสี่ยง",
    item: "RISK-002 หลักฐานส่งมอบไม่ครบ",
    timestamp: "13 พ.ค. 2026 11:00",
  },
];

const initialProducts: PublicProduct[] = [
  {
    id: "PUB-001",
    sellerId: "seller_demo_01",
    productName: "ผักสลัดกรีนโอ๊ค",
    category: "ผัก",
    area: "เชียงใหม่ / แม่ริม",
    quantityText: "พร้อมส่งประมาณ 500 กก.",
    quality: "GAP / คัดเกรด",
    priceRange: "55-70 บาท/กก.",
    availableDate: "พร้อมส่ง 10 มิ.ย. 2026",
    season: "รอบส่งรายสัปดาห์",
    status: "active",
    availableQuantity: 500,
    reservedQuantity: 120,
    soldQuantity: 60,
    unit: "กก.",
    minOrderQuantity: 50,
    stockStatus: "available",
    sellerCanDeliver: true,
    deliveryAreaType: "same_province",
    deliveryAreaText: "จังหวัดเชียงใหม่",
    minimumSellerDeliveryQuantity: 300,
    minimumSellerDeliveryUnit: "กก.",
    shippingFeePolicy: "quoted_later",
    shippingFeeNote: "หากอยู่จังหวัดเดียวกัน ผู้ขายสามารถจัดส่งเองเมื่อถึงขั้นต่ำ หากไม่ถึงขั้นต่ำให้ผู้ซื้อรับเองหรือใช้รถรับจ้าง",
    buyerPickupAvailable: true,
    pickupLocationText: "จุดรวบรวมในพื้นที่ผู้ขาย",
    thirdPartyLogisticsAvailable: true,
    coldChainAvailable: false,
    vehicleTypes: ["รถกระบะ", "รถรับจ้างในพื้นที่", "ขนส่งรวมเที่ยว"],
    deliveryNote: "สินค้าไม่เกิน 25 กก. แนะนำไปรษณีย์ไทย ส่วนปริมาณมากแนะนำรถผู้ขายหรือรถรับจ้าง",
    parcelShippingAllowed: true,
    parcelCarrierRecommendation: "thailand_post",
    parcelCarrierName: "ไปรษณีย์ไทย",
    parcelMaxWeightKg: 25,
    parcelClaimSupported: true,
    parcelClaimNote: "มี tracking และสามารถร้องเรียน/ขอชดใช้กรณีเสียหายหรือสูญหายได้ตามเงื่อนไขผู้ให้บริการ",
    bulkTransportRecommendedAboveKg: 25,
    bulkShippingMinKg: 100,
    sellerOwnVehicleAvailable: true,
    localHiredVehicleAvailable: true,
    interProvinceLogisticsAvailable: true,
    isDemo: true,
  },
  {
    id: "PUB-002",
    sellerId: "seller_demo_03",
    productName: "มะเขือเทศราชินี",
    category: "ผัก/ผลไม้",
    area: "เชียงใหม่ / สันทราย",
    quantityText: "พร้อมส่งประมาณ 300 กก.",
    quality: "คัดขนาด / สดใหม่",
    priceRange: "38-48 บาท/กก.",
    availableDate: "พร้อมส่ง 12 มิ.ย. 2026",
    season: "ผลผลิตต่อเนื่อง",
    status: "active",
    availableQuantity: 300,
    reservedQuantity: 300,
    soldQuantity: 0,
    unit: "กก.",
    minOrderQuantity: 30,
    stockStatus: "out_of_stock",
    sellerCanDeliver: true,
    deliveryAreaType: "same_province",
    deliveryAreaText: "จังหวัดเชียงใหม่",
    minimumSellerDeliveryQuantity: 300,
    minimumSellerDeliveryUnit: "กก.",
    shippingFeePolicy: "quoted_later",
    shippingFeeNote: "หากอยู่จังหวัดเดียวกัน ผู้ขายสามารถจัดส่งเองเมื่อถึงขั้นต่ำ หากไม่ถึงขั้นต่ำให้ผู้ซื้อรับเองหรือใช้รถรับจ้าง",
    buyerPickupAvailable: true,
    pickupLocationText: "จุดรวบรวมในพื้นที่ผู้ขาย",
    thirdPartyLogisticsAvailable: true,
    coldChainAvailable: false,
    vehicleTypes: ["รถกระบะ", "รถรับจ้างในพื้นที่", "ขนส่งรวมเที่ยว"],
    deliveryNote: "สินค้าไม่เกิน 25 กก. แนะนำไปรษณีย์ไทย ส่วนปริมาณมากแนะนำรถผู้ขายหรือรถรับจ้าง",
    parcelShippingAllowed: true,
    parcelCarrierRecommendation: "thailand_post",
    parcelCarrierName: "ไปรษณีย์ไทย",
    parcelMaxWeightKg: 25,
    parcelClaimSupported: true,
    parcelClaimNote: "มี tracking และสามารถร้องเรียน/ขอชดใช้กรณีเสียหายหรือสูญหายได้ตามเงื่อนไขผู้ให้บริการ",
    bulkTransportRecommendedAboveKg: 25,
    bulkShippingMinKg: 100,
    sellerOwnVehicleAvailable: true,
    localHiredVehicleAvailable: true,
    interProvinceLogisticsAvailable: true,
    isDemo: true,
  },
  {
    id: "PUB-003",
    sellerId: "seller_demo_02",
    productName: "ข้าวหอมมะลิ",
    category: "ธัญพืช",
    area: "เชียงใหม่ / แม่แตง",
    quantityText: "พร้อมเสนอสูงสุด 2 ตัน",
    quality: "ความชื้นไม่เกิน 14%",
    priceRange: "ตามราคากลางพื้นที่",
    availableDate: "พร้อมส่ง 20 มิ.ย. 2026",
    season: "ล็อตเก็บเกี่ยวล่าสุด",
    status: "active",
    availableQuantity: 2000,
    reservedQuantity: 500,
    soldQuantity: 200,
    unit: "กก.",
    minOrderQuantity: 100,
    stockStatus: "available",
    sellerCanDeliver: true,
    deliveryAreaType: "same_province",
    deliveryAreaText: "จังหวัดเชียงใหม่",
    minimumSellerDeliveryQuantity: 300,
    minimumSellerDeliveryUnit: "กก.",
    shippingFeePolicy: "quoted_later",
    shippingFeeNote: "หากอยู่จังหวัดเดียวกัน ผู้ขายสามารถจัดส่งเองเมื่อถึงขั้นต่ำ หากไม่ถึงขั้นต่ำให้ผู้ซื้อรับเองหรือใช้รถรับจ้าง",
    buyerPickupAvailable: true,
    pickupLocationText: "จุดรวบรวมในพื้นที่ผู้ขาย",
    thirdPartyLogisticsAvailable: true,
    coldChainAvailable: false,
    vehicleTypes: ["รถกระบะ", "รถรับจ้างในพื้นที่", "ขนส่งรวมเที่ยว"],
    deliveryNote: "สินค้าไม่เกิน 25 กก. แนะนำไปรษณีย์ไทย ส่วนปริมาณมากแนะนำรถผู้ขายหรือรถรับจ้าง",
    parcelShippingAllowed: true,
    parcelCarrierRecommendation: "thailand_post",
    parcelCarrierName: "ไปรษณีย์ไทย",
    parcelMaxWeightKg: 25,
    parcelClaimSupported: true,
    parcelClaimNote: "มี tracking และสามารถร้องเรียน/ขอชดใช้กรณีเสียหายหรือสูญหายได้ตามเงื่อนไขผู้ให้บริการ",
    bulkTransportRecommendedAboveKg: 25,
    bulkShippingMinKg: 100,
    sellerOwnVehicleAvailable: true,
    localHiredVehicleAvailable: true,
    interProvinceLogisticsAvailable: true,
    isDemo: true,
  },
  {
    id: "PUB-004",
    sellerId: "seller_demo_01",
    productName: "พริกหวาน",
    category: "ผัก",
    area: "เชียงใหม่ / เมืองเชียงใหม่",
    quantityText: "พร้อมส่งประมาณ 250 กก.",
    quality: "คัดสี / คัดเกรด",
    priceRange: "45-55 บาท/กก.",
    availableDate: "พร้อมส่ง 22 มิ.ย. 2026",
    season: "รอบส่ง 3-5 วัน",
    status: "active",
    availableQuantity: 250,
    reservedQuantity: 80,
    soldQuantity: 40,
    unit: "กก.",
    minOrderQuantity: 25,
    stockStatus: "limited",
    sellerCanDeliver: true,
    deliveryAreaType: "same_province",
    deliveryAreaText: "จังหวัดเชียงใหม่",
    minimumSellerDeliveryQuantity: 300,
    minimumSellerDeliveryUnit: "กก.",
    shippingFeePolicy: "quoted_later",
    shippingFeeNote: "หากอยู่จังหวัดเดียวกัน ผู้ขายสามารถจัดส่งเองเมื่อถึงขั้นต่ำ หากไม่ถึงขั้นต่ำให้ผู้ซื้อรับเองหรือใช้รถรับจ้าง",
    buyerPickupAvailable: true,
    pickupLocationText: "จุดรวบรวมในพื้นที่ผู้ขาย",
    thirdPartyLogisticsAvailable: true,
    coldChainAvailable: false,
    vehicleTypes: ["รถกระบะ", "รถรับจ้างในพื้นที่", "ขนส่งรวมเที่ยว"],
    deliveryNote: "สินค้าไม่เกิน 25 กก. แนะนำไปรษณีย์ไทย ส่วนปริมาณมากแนะนำรถผู้ขายหรือรถรับจ้าง",
    parcelShippingAllowed: true,
    parcelCarrierRecommendation: "thailand_post",
    parcelCarrierName: "ไปรษณีย์ไทย",
    parcelMaxWeightKg: 25,
    parcelClaimSupported: true,
    parcelClaimNote: "มี tracking และสามารถร้องเรียน/ขอชดใช้กรณีเสียหายหรือสูญหายได้ตามเงื่อนไขผู้ให้บริการ",
    bulkTransportRecommendedAboveKg: 25,
    bulkShippingMinKg: 100,
    sellerOwnVehicleAvailable: true,
    localHiredVehicleAvailable: true,
    interProvinceLogisticsAvailable: true,
    isDemo: true,
  },
  {
    id: "PUB-005",
    sellerId: "seller_demo_04",
    productName: "ลำไย",
    category: "ผลไม้",
    area: "เชียงใหม่ / แม่แตง",
    quantityText: "พร้อมส่งประมาณ 1,000 กก.",
    quality: "คัดเกรด AA / ลังมาตรฐาน",
    priceRange: "26-32 บาท/กก.",
    availableDate: "พร้อมส่ง 18 มิ.ย. 2026",
    season: "ฤดูกาลผลผลิต",
    status: "active",
    availableQuantity: 1000,
    reservedQuantity: 200,
    soldQuantity: 300,
    unit: "กก.",
    minOrderQuantity: 100,
    stockStatus: "available",
    sellerCanDeliver: true,
    deliveryAreaType: "same_province",
    deliveryAreaText: "จังหวัดเชียงใหม่",
    minimumSellerDeliveryQuantity: 300,
    minimumSellerDeliveryUnit: "กก.",
    shippingFeePolicy: "quoted_later",
    shippingFeeNote: "หากอยู่จังหวัดเดียวกัน ผู้ขายสามารถจัดส่งเองเมื่อถึงขั้นต่ำ หากไม่ถึงขั้นต่ำให้ผู้ซื้อรับเองหรือใช้รถรับจ้าง",
    buyerPickupAvailable: true,
    pickupLocationText: "จุดรวบรวมในพื้นที่ผู้ขาย",
    thirdPartyLogisticsAvailable: true,
    coldChainAvailable: false,
    vehicleTypes: ["รถกระบะ", "รถรับจ้างในพื้นที่", "ขนส่งรวมเที่ยว"],
    deliveryNote: "สินค้าไม่เกิน 25 กก. แนะนำไปรษณีย์ไทย ส่วนปริมาณมากแนะนำรถผู้ขายหรือรถรับจ้าง",
    parcelShippingAllowed: true,
    parcelCarrierRecommendation: "thailand_post",
    parcelCarrierName: "ไปรษณีย์ไทย",
    parcelMaxWeightKg: 25,
    parcelClaimSupported: true,
    parcelClaimNote: "มี tracking และสามารถร้องเรียน/ขอชดใช้กรณีเสียหายหรือสูญหายได้ตามเงื่อนไขผู้ให้บริการ",
    bulkTransportRecommendedAboveKg: 25,
    bulkShippingMinKg: 100,
    sellerOwnVehicleAvailable: true,
    localHiredVehicleAvailable: true,
    interProvinceLogisticsAvailable: true,
    isDemo: true,
  },
  {
    id: "PUB-006",
    sellerId: "seller_demo_02",
    productName: "ผักกาดหอม",
    category: "ผัก",
    area: "เชียงใหม่ / สันทราย",
    quantityText: "พร้อมส่งประมาณ 420 กก.",
    quality: "ปลอดภัย / มีบันทึกแปลง",
    priceRange: "35-45 บาท/กก.",
    availableDate: "พร้อมส่ง 15 มิ.ย. 2026",
    season: "รอบตัดรายสัปดาห์",
    status: "active",
    availableQuantity: 420,
    reservedQuantity: 100,
    soldQuantity: 50,
    unit: "กก.",
    minOrderQuantity: 50,
    stockStatus: "available",
    sellerCanDeliver: true,
    deliveryAreaType: "same_province",
    deliveryAreaText: "จังหวัดเชียงใหม่",
    minimumSellerDeliveryQuantity: 300,
    minimumSellerDeliveryUnit: "กก.",
    shippingFeePolicy: "quoted_later",
    shippingFeeNote: "หากอยู่จังหวัดเดียวกัน ผู้ขายสามารถจัดส่งเองเมื่อถึงขั้นต่ำ หากไม่ถึงขั้นต่ำให้ผู้ซื้อรับเองหรือใช้รถรับจ้าง",
    buyerPickupAvailable: true,
    pickupLocationText: "จุดรวบรวมในพื้นที่ผู้ขาย",
    thirdPartyLogisticsAvailable: true,
    coldChainAvailable: false,
    vehicleTypes: ["รถกระบะ", "รถรับจ้างในพื้นที่", "ขนส่งรวมเที่ยว"],
    deliveryNote: "สินค้าไม่เกิน 25 กก. แนะนำไปรษณีย์ไทย ส่วนปริมาณมากแนะนำรถผู้ขายหรือรถรับจ้าง",
    parcelShippingAllowed: true,
    parcelCarrierRecommendation: "thailand_post",
    parcelCarrierName: "ไปรษณีย์ไทย",
    parcelMaxWeightKg: 25,
    parcelClaimSupported: true,
    parcelClaimNote: "มี tracking และสามารถร้องเรียน/ขอชดใช้กรณีเสียหายหรือสูญหายได้ตามเงื่อนไขผู้ให้บริการ",
    bulkTransportRecommendedAboveKg: 25,
    bulkShippingMinKg: 100,
    sellerOwnVehicleAvailable: true,
    localHiredVehicleAvailable: true,
    interProvinceLogisticsAvailable: true,
    isDemo: true,
  },
];


const sellerPerformanceRecords: SellerPerformance[] = [
  {
    sellerId: "seller_demo_01",
    completedOrders: 12,
    onTimeDeliveries: 11,
    lateDeliveries: 1,
    cancelledOrders: 0,
    disputeCount: 0,
    averageQualityRating: 4.6,
    averageDeliveryRating: 4.5,
    averageDocumentRating: 4.7,
  },
  {
    sellerId: "seller_demo_02",
    completedOrders: 8,
    onTimeDeliveries: 7,
    lateDeliveries: 1,
    cancelledOrders: 0,
    disputeCount: 1,
    averageQualityRating: 4.4,
    averageDeliveryRating: 4.3,
    averageDocumentRating: 4.2,
  },
  {
    sellerId: "seller_demo_03",
    completedOrders: 5,
    onTimeDeliveries: 4,
    lateDeliveries: 1,
    cancelledOrders: 0,
    disputeCount: 0,
    averageQualityRating: 4.2,
    averageDeliveryRating: 4.1,
    averageDocumentRating: 4.0,
  },
  {
    sellerId: "seller_demo_04",
    completedOrders: 2,
    onTimeDeliveries: 1,
    lateDeliveries: 1,
    cancelledOrders: 0,
    disputeCount: 1,
    averageQualityRating: 3.9,
    averageDeliveryRating: 3.7,
    averageDocumentRating: 3.8,
  },
];

const initialReviews: BuyerReview[] = [
  {
    id: "REV-DEMO-001",
    productName: "ผักสลัดกรีนโอ๊ค",
    sellerId: "seller_demo_01",
    buyerId: "buyer_demo_01",
    orderId: "PO-DEMO-REVIEW-001",
    qualityRating: 5,
    deliveryRating: 4,
    documentRating: 5,
    comment: "สินค้าสดใหม่ดีมาก ส่งถึงตรงเวลา เอกสารครบถ้วน",
    status: "published",
    createdAt: "2026-03-10T09:00:00.000Z",
  },
  {
    id: "REV-DEMO-002",
    productName: "มะเขือเทศราชินี",
    sellerId: "seller_demo_03",
    buyerId: "buyer_demo_01",
    orderId: "PO-DEMO-REVIEW-002",
    qualityRating: 4,
    deliveryRating: 4,
    documentRating: 4,
    comment: "คุณภาพสม่ำเสมอ เหมาะกับการใช้งานครัวกลาง",
    status: "published",
    createdAt: "2026-03-12T09:00:00.000Z",
  },
];

function getRemainingQuantity(product: PublicProduct) {
  return Math.max(product.availableQuantity - product.reservedQuantity - product.soldQuantity, 0);
}

function getStockStatusLabel(product: PublicProduct) {
  const remaining = getRemainingQuantity(product);

  if (remaining <= 0 || product.stockStatus === "out_of_stock") return "หมดชั่วคราว";
  if (product.stockStatus === "harvesting_soon") return "ใกล้พร้อมเก็บเกี่ยว";
  if (product.stockStatus === "reserved") return "ถูกกันไว้บางส่วน";
  if (product.stockStatus === "limited" || remaining <= product.minOrderQuantity) return "ปริมาณจำกัด";

  return "มีปริมาณพร้อมเสนอ";
}

const DEFAULT_PARCEL_MAX_WEIGHT_KG = 25;

function recommendTransport(quantityKg: number, sameProvince = true) {
  if (quantityKg <= DEFAULT_PARCEL_MAX_WEIGHT_KG) {
    return {
      method: "thailand_post",
      label: "ไปรษณีย์ไทย",
      message:
        "เหมาะสำหรับสินค้าเกษตรไม่เกิน 25 กก. มีหมายเลขติดตามพัสดุ และสามารถร้องเรียน/ขอชดใช้กรณีเสียหายหรือสูญหายได้ตามเงื่อนไขผู้ให้บริการ",
      risk: "low",
    };
  }

  if (quantityKg <= 100) {
    return {
      method: sameProvince ? "seller_delivery_or_pickup" : "hired_vehicle",
      label: sameProvince ? "ผู้ขายจัดส่งเอง / ผู้ซื้อรับเอง / รถรับจ้างในพื้นที่" : "รถรับจ้าง / ขนส่งภายนอก",
      message:
        "ปริมาณเกิน 25 กก. ค่าขนส่งแบบพัสดุทั่วไปมักสูงขึ้น แนะนำใช้รถผู้ขาย ผู้ซื้อรับเอง รถรับจ้าง หรือให้ผู้ขายเสนอค่าขนส่งเพิ่มเติม",
      risk: "medium",
    };
  }

  if (quantityKg <= 500) {
    return {
      method: "pickup_or_hired_vehicle",
      label: "รถกระบะ / รถรับจ้าง / ขนส่งรวมเที่ยว",
      message:
        "เหมาะกับรถกระบะ รถรับจ้าง หรือขนส่งรวมเที่ยว ซึ่งมักคุ้มกว่าการส่งแบบพัสดุทั่วไป",
      risk: "low",
    };
  }

  if (quantityKg <= 2000) {
    return {
      method: "bulk_logistics",
      label: "รถ 4 ล้อใหญ่ / 6 ล้อ / ขนส่งเหมารอบ",
      message:
        "เหมาะกับการขนส่งปริมาณมาก ควรยืนยันค่าขนส่ง จุดรับสินค้า เวลาโหลด และหลักฐานส่งมอบ",
      risk: "low",
    };
  }

  return {
    method: "truck_load",
    label: "รถ 6 ล้อ / 10 ล้อ / เหมาคัน",
    message:
      "เหมาะกับขนส่งเหมาคันหรือรถบรรทุกขนาดใหญ่ ควรตรวจสอบน้ำหนัก จุดโหลด ใบน้ำหนัก และเอกสารส่งมอบก่อนออกคำสั่งซื้อ",
    risk: "medium",
  };
}

function getShippingFeeLabel(product: PublicProduct) {
  switch (product.shippingFeePolicy) {
    case "included":
      return "รวมในราคาสินค้าแล้ว";
    case "buyer_pays":
      return product.shippingFeeAmount
        ? `ผู้ซื้อจ่ายแยก ประมาณ ${product.shippingFeeAmount.toLocaleString("th-TH")} บาท`
        : "ผู้ซื้อจ่ายค่าขนส่งแยก";
    case "seller_pays":
      return "ผู้ขายรับผิดชอบค่าขนส่ง";
    case "shared":
      return "แบ่งจ่ายตามตกลง";
    case "quoted_later":
      return "เสนอราคา/คำนวณภายหลังตามระยะทางและน้ำหนัก";
    default:
      return "รอตกลงในขั้นตอนคำขอซื้อ";
  }
}

function getProductTransportSummary(product: PublicProduct) {
  const parcelMaxWeight = product.parcelMaxWeightKg ?? DEFAULT_PARCEL_MAX_WEIGHT_KG;
  const minOrderQuantity = product.minOrderQuantity || 0;

  if ((product.parcelShippingAllowed ?? true) && minOrderQuantity <= parcelMaxWeight) {
    return `${product.parcelCarrierName || "ไปรษณีย์ไทย"} สำหรับสินค้าไม่เกิน ${parcelMaxWeight} ${product.unit}`;
  }

  if (product.sellerCanDeliver) {
    return `ผู้ขายจัดส่งเอง: ${product.deliveryAreaText || "ตามพื้นที่ที่ระบุ"}`;
  }

  if (product.thirdPartyLogisticsAvailable) {
    return "รถรับจ้าง / Logistic ภายนอก";
  }

  if (product.buyerPickupAvailable) {
    return "ผู้ซื้อรับเอง";
  }

  return "ตกลงรูปแบบขนส่งในขั้นตอนคำขอซื้อ";
}

function getSellerPerformance(sellerId: string) {
  return sellerPerformanceRecords.find((item) => item.sellerId === sellerId);
}

function getOnTimeRate(performance?: SellerPerformance) {
  if (!performance || performance.completedOrders === 0) return null;
  return Math.round((performance.onTimeDeliveries / performance.completedOrders) * 100);
}

function getSellerTrustLabel(performance?: SellerPerformance) {
  if (!performance || performance.completedOrders === 0) return "ยังไม่มีประวัติส่งมอบ";

  const onTimeRate = getOnTimeRate(performance) || 0;

  if (onTimeRate >= 90 && performance.disputeCount === 0) return "ประวัติส่งมอบดีมาก";
  if (onTimeRate >= 75) return "ประวัติส่งมอบดี";

  return "ควรตรวจสอบเพิ่มเติม";
}

function formatThaiDate(value: string) {
  try {
    return new Date(value).toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

const DELIVERY_PROOF_DUPLICATE_DELAY_MS = 24 * 60 * 60 * 1000;

type ProofDuplicateStatus = "duplicate" | "ok" | "pending_24h";

type ParsedChatAttachment = {
  kind: "image" | "document";
  name: string;
  previewUrl?: string;
  type?: string;
  fingerprint: string;
  status: ProofDuplicateStatus;
};

function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function parseChatAttachmentMarkers(message: string): ParsedChatAttachment[] {
  const imageRegex = /\[\[FARMLINK_IMAGE\|([^|]+)\|([^|]+)\|([^|]+)\|(duplicate|ok|pending_24h)\]\]/g;
  const docRegex = /\[\[FARMLINK_DOC\|([^|]+)\|([^|]+)\|([^|]+)\|(duplicate|ok|pending_24h)(?:\|([^|\]]*?))?\]\]/g;

  const matches: Array<{ index: number; attachment: ParsedChatAttachment }> = [];

  for (const match of message.matchAll(imageRegex)) {
    const [, rawName, rawUrl, rawFingerprint, status] = match;

    matches.push({
      index: match.index ?? 0,
      attachment: {
        kind: "image",
        name: safeDecodeURIComponent(rawName),
        previewUrl: safeDecodeURIComponent(rawUrl),
        fingerprint: safeDecodeURIComponent(rawFingerprint),
        status: status as ProofDuplicateStatus,
      },
    });
  }

  for (const match of message.matchAll(docRegex)) {
    const [, rawName, rawType, rawFingerprint, status, rawPreviewUrl] = match;

    matches.push({
      index: match.index ?? 0,
      attachment: {
        kind: "document",
        name: safeDecodeURIComponent(rawName),
        type: safeDecodeURIComponent(rawType),
        fingerprint: safeDecodeURIComponent(rawFingerprint),
        status: status as ProofDuplicateStatus,
        previewUrl: rawPreviewUrl ? safeDecodeURIComponent(rawPreviewUrl) : "",
      },
    });
  }

  return matches.sort((a, b) => a.index - b.index).map((item) => item.attachment);
}

function removeChatAttachmentMarkers(message: string) {
  return message
    .replace(/\[\[FARMLINK_IMAGE\|[^\]]+\]\]/g, "")
    .replace(/\[\[FARMLINK_DOC\|[^\]]+\]\]/g, "")
    .replace(/^รูปถ่ายหลักฐานที่แนบ:.*$/gm, "รูปถ่ายหลักฐานที่แนบ: ดูรูปตัวอย่างด้านล่าง")
    .replace(/^เอกสารที่แนบ:.*$/gm, "เอกสารที่แนบ: ดูรายการเอกสารด้านล่าง")
    .replace(/^ไฟล์หลักฐานการชำระเงิน:.*$/gm, "ไฟล์หลักฐานการชำระเงิน: ดูไฟล์แนบด้านล่าง")
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line, index, lines) => !(line.trim() === "" && lines[index - 1]?.trim() === ""))
    .join("\n")
    .trim();
}

function shortenChatPreview(message: string, maxLength = 260) {
  const cleanMessage = removeChatAttachmentMarkers(message);
  return cleanMessage.length > maxLength ? `${cleanMessage.slice(0, maxLength)}...` : cleanMessage;
}


const roleLabels: Record<Role, string> = {
  buyer: "ผู้ซื้อ",
  seller: "ผู้ขาย/เกษตรกร",
  admin: "ผู้ดูแลระบบ",
};

const menus: Record<Role, string[]> = {
  buyer: [
    "แดชบอร์ด",
    "ค้นหาสินค้า",
    "แชทการจัดซื้อ",
    "ประวัติธุรกรรม",
  ],
  seller: [
    "แดชบอร์ด",
    "สินค้าของฉัน",
    "แชทจากผู้ซื้อ",
    "ประวัติธุรกรรม",
  ],
  admin: [
    "ภาพรวมระบบ",
    "ตรวจสอบผู้ใช้",
    "ตรวจสอบสินค้า",
    "Fraud & Trust Monitoring",
    "ตรวจสอบแชทเสี่ยง",
    "ดีล / คำสั่งซื้อทั้งหมด",
    "รายงาน",
    "Audit Logs",
    "ตั้งค่า Workflow",
  ],
};


function getTodayDateInput() {
  return new Date().toISOString().split("T")[0];
}

function formatThaiDateFromDateInput(value: string) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function detectChatRisk(message: string): ChatRiskResult {
  const lower = message.toLowerCase();

  const mediumRiskKeywords = [
    "ขอไลน์",
    "ขอ line",
    "line",
    "ไลน์",
    "ขอเบอร์",
    "เบอร์โทร",
    "ทักส่วนตัว",
    "คุยนอกระบบ",
    "ติดต่อโดยตรง",
  ];

  const highRiskKeywords = [
    "โอนตรง",
    "บัญชีธนาคาร",
    "เลขบัญชี",
    "มัดจำก่อน",
    "ส่งของก่อน",
    "ไม่ต้องผ่านระบบ",
    "ไม่ต้องออก po",
    "ไม่ต้องออกใบสั่งซื้อ",
    "โอนแล้วเงียบ",
    "เอกสารปลอม",
    "หลอก",
  ];

  const highMatches = highRiskKeywords.filter((word) => lower.includes(word));
  const mediumMatches = mediumRiskKeywords.filter((word) => lower.includes(word));

  if (highMatches.length > 0) {
    return {
      riskLevel: "high",
      riskReasons: highMatches,
      warning:
        "แจ้งเตือนความปลอดภัยจาก FarmLink: ระบบตรวจพบข้อความที่อาจเสี่ยงต่อการหลอกลวง กรุณาหลีกเลี่ยงการโอนเงิน ส่งสินค้า หรือยืนยันธุรกรรมนอกระบบ FarmLink รายการนี้จะถูกส่งให้ผู้ดูแลระบบตรวจสอบเพิ่มเติม",
    };
  }

  if (mediumMatches.length > 0) {
    return {
      riskLevel: "medium",
      riskReasons: mediumMatches,
      warning:
        "แจ้งเตือนจาก FarmLink: กรุณาเก็บการสื่อสารและข้อตกลงไว้ในระบบ FarmLink เพื่อให้ตรวจสอบราคา ปริมาณ ขนส่ง และเอกสารได้ภายหลัง",
    };
  }

  return {
    riskLevel: "low",
    riskReasons: [],
  };
}

function formatChatTime(value: string) {
  return new Date(value).toLocaleString("th-TH", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getWorkflowStepsForChat({
  thread,
  relatedRequest,
  relatedOrder,
  messages,
}: {
  thread: ChatThread;
  relatedRequest?: PurchaseRequest;
  relatedOrder?: Order;
  messages: ChatMessage[];
}): WorkflowStep[] {
  const completedKeys = new Set<WorkflowStepKey>();

  if (thread.rfqId || relatedRequest) {
    completedKeys.add("rfq_created");
  }

  completedKeys.add("chat_opened");

  const hasSellerReply = messages.some(
    (message) => message.senderRole === "seller" && message.messageType === "user_message"
  );

  if (hasSellerReply) {
    completedKeys.add("seller_replied");
  }

  const hasFormalOfferMessage = messages.some(
    (message) =>
      message.senderRole === "seller" &&
      message.messageType === "user_message" &&
      message.message.includes("ผู้ขายส่งข้อเสนอขายอย่างเป็นทางการ")
  );

  if ((relatedRequest?.offers || 0) > 0 || hasFormalOfferMessage) {
    completedKeys.add("seller_replied");
    completedKeys.add("offer_sent");
  }

  const hasBuyerAcceptedFormalOffer = messages.some(
    (message) =>
      message.senderRole === "buyer" &&
      message.messageType === "user_message" &&
      message.message.includes("ผู้ซื้อยืนยันข้อเสนอขายอย่างเป็นทางการ")
  );

  if (hasBuyerAcceptedFormalOffer) {
    completedKeys.add("seller_replied");
    completedKeys.add("offer_sent");
    completedKeys.add("buyer_accepted");
  }

  const hasPoSoCreatedMessage = messages.some(
    (message) =>
      message.messageType === "user_message" &&
      (message.message.includes("ระบบสร้าง PO / SO") ||
        message.message.includes("PO ฝั่งผู้ซื้อ") ||
        message.message.includes("SO ฝั่งผู้ขาย"))
  );

  if (hasPoSoCreatedMessage) {
    completedKeys.add("seller_replied");
    completedKeys.add("offer_sent");
    completedKeys.add("buyer_accepted");
    completedKeys.add("order_created");
    completedKeys.add("delivery_contact_revealed");
  }

  const hasDeliveryPlanMessage = messages.some(
    (message) =>
      message.senderRole === "seller" &&
      message.messageType === "user_message" &&
      message.message.includes("ผู้ขายแจ้งดำเนินการส่งสินค้า")
  );

  if (hasDeliveryPlanMessage) {
    completedKeys.add("seller_replied");
    completedKeys.add("offer_sent");
    completedKeys.add("buyer_accepted");
    completedKeys.add("order_created");
    completedKeys.add("delivery_contact_revealed");
    completedKeys.add("delivery_in_progress");
  }

  const hasBuyerAcceptedDeliveryProofSummary = messages.some(
    (message) =>
      message.senderRole === "buyer" &&
      message.messageType === "user_message" &&
      message.message.includes("ผู้ซื้อยืนยันการตรวจสอบข้อมูลจัดส่งและหลักฐานเบื้องต้น")
  );

  if (hasBuyerAcceptedDeliveryProofSummary) {
    completedKeys.add("seller_replied");
    completedKeys.add("offer_sent");
    completedKeys.add("buyer_accepted");
    completedKeys.add("order_created");
    completedKeys.add("delivery_contact_revealed");
    completedKeys.add("delivery_in_progress");
    completedKeys.add("delivery_proof_uploaded");
  }

  const hasBuyerConfirmedDeliveryInChat = messages.some(
    (message) =>
      message.senderRole === "buyer" &&
      message.messageType === "user_message" &&
      (message.message.includes("ผู้ซื้อยืนยันรับสินค้า") || message.message.includes("ผู้ซื้อรับสินค้าแล้ว"))
  );

  if (hasBuyerConfirmedDeliveryInChat) {
    completedKeys.add("seller_replied");
    completedKeys.add("offer_sent");
    completedKeys.add("buyer_accepted");
    completedKeys.add("order_created");
    completedKeys.add("delivery_contact_revealed");
    completedKeys.add("delivery_in_progress");
    completedKeys.add("delivery_proof_uploaded");
    completedKeys.add("buyer_confirmed_delivery");
  }

  const hasBuyerPaymentProofInChat = messages.some(
    (message) =>
      message.senderRole === "buyer" &&
      message.messageType === "user_message" &&
      message.message.includes("ผู้ซื้อส่งหลักฐานการชำระเงิน")
  );

  if (hasBuyerPaymentProofInChat) {
    completedKeys.add("seller_replied");
    completedKeys.add("offer_sent");
    completedKeys.add("buyer_accepted");
    completedKeys.add("order_created");
    completedKeys.add("delivery_contact_revealed");
    completedKeys.add("delivery_in_progress");
    completedKeys.add("delivery_proof_uploaded");
    completedKeys.add("buyer_confirmed_delivery");
    completedKeys.add("payment_proof_uploaded");
  }

  const hasSellerConfirmedPaymentInChat = messages.some(
    (message) =>
      message.senderRole === "seller" &&
      message.messageType === "user_message" &&
      (message.message.includes("ผู้ขายยืนยันได้รับเงิน") ||
        message.message.includes("ผู้ขายยืนยันรับเงิน") ||
        message.message.includes("ได้รับเงินแล้ว"))
  );

  if (hasSellerConfirmedPaymentInChat) {
    completedKeys.add("seller_replied");
    completedKeys.add("offer_sent");
    completedKeys.add("buyer_accepted");
    completedKeys.add("order_created");
    completedKeys.add("delivery_contact_revealed");
    completedKeys.add("delivery_in_progress");
    completedKeys.add("delivery_proof_uploaded");
    completedKeys.add("buyer_confirmed_delivery");
    completedKeys.add("payment_proof_uploaded");
    completedKeys.add("seller_confirmed_payment");
  }

  if (relatedOrder) {
    completedKeys.add("seller_replied");
    completedKeys.add("offer_sent");
    completedKeys.add("buyer_accepted");
    completedKeys.add("order_created");
    completedKeys.add("delivery_contact_revealed");

    if (
      relatedOrder.status.includes("ส่งมอบ") ||
      relatedOrder.status.includes("เสร็จ") ||
      relatedOrder.proofStatus.includes("ส่ง")
    ) {
      completedKeys.add("delivery_in_progress");
    }

    if (
      relatedOrder.proofStatus.includes("หลักฐาน") ||
      relatedOrder.proofStatus.includes("ผู้ซื้อยืนยัน")
    ) {
      completedKeys.add("delivery_proof_uploaded");
    }

    if (
      relatedOrder.status.includes("เสร็จสมบูรณ์") ||
      relatedOrder.proofStatus.includes("ผู้ซื้อยืนยัน")
    ) {
      completedKeys.add("buyer_confirmed_delivery");
    }

    const hasPaymentProofMessage = messages.some(
      (message) =>
        message.senderRole === "buyer" &&
        message.messageType === "user_message" &&
        message.message.includes("ผู้ซื้อส่งหลักฐานการชำระเงิน")
    );

    if (hasPaymentProofMessage) {
      completedKeys.add("payment_proof_uploaded");
    }

    const hasSellerPaymentConfirmation = messages.some(
      (message) =>
        message.senderRole === "seller" &&
        ["ได้รับเงินแล้ว", "รับเงินแล้ว", "เงินเข้าแล้ว"].some((keyword) =>
          message.message.includes(keyword)
        )
    );

    if (hasSellerPaymentConfirmation) {
      completedKeys.add("seller_confirmed_payment");
    }
  }

  const hasBuyerReviewInChat = messages.some(
    (message) =>
      message.senderRole === "buyer" &&
      message.messageType === "user_message" &&
      (message.message.includes("ผู้ซื้อส่งรีวิวหลังธุรกรรม") ||
        message.message.includes("ผู้ซื้อรีวิวสินค้าและผู้ขาย"))
  );

  if (hasBuyerReviewInChat) {
    completedKeys.add("seller_replied");
    completedKeys.add("offer_sent");
    completedKeys.add("buyer_accepted");
    completedKeys.add("order_created");
    completedKeys.add("delivery_contact_revealed");
    completedKeys.add("delivery_in_progress");
    completedKeys.add("delivery_proof_uploaded");
    completedKeys.add("buyer_confirmed_delivery");
    completedKeys.add("payment_proof_uploaded");
    completedKeys.add("seller_confirmed_payment");
    completedKeys.add("review_completed");
    completedKeys.add("closed");
  }

  const firstPendingStep = adminWorkflowTemplate.steps.find((step) => !completedKeys.has(step.key));

  return adminWorkflowTemplate.steps.map((step) => ({
    ...step,
    status: completedKeys.has(step.key)
      ? "completed"
      : firstPendingStep?.key === step.key
      ? "current"
      : "pending",
  }));
}

function getWorkflowActorLabel(actor: WorkflowStep["actor"]) {
  const labels: Record<WorkflowStep["actor"], string> = {
    buyer: "ผู้ซื้อ",
    seller: "ผู้ขาย",
    admin: "ผู้ดูแลระบบ",
    system: "ระบบ",
  };

  return labels[actor];
}

function getCurrentWorkflowStep(steps: WorkflowStep[]) {
  return steps.find((step) => step.status === "current") || steps[steps.length - 1];
}

function getAgenticWorkflowInsights({
  thread,
  relatedRequest,
  relatedOrder,
  messages,
  workflowSteps,
}: {
  thread: ChatThread;
  relatedRequest?: PurchaseRequest;
  relatedOrder?: Order;
  messages: ChatMessage[];
  workflowSteps: WorkflowStep[];
}) {
  const insights: string[] = [];
  const currentStep = getCurrentWorkflowStep(workflowSteps);
  const latestRiskMessage = [...messages]
    .reverse()
    .find((message) => message.riskLevel === "medium" || message.riskLevel === "high");

  if (relatedRequest && currentStep.key === "seller_replied") {
    insights.push(
      `AI ช่วยสรุป: ผู้ซื้อขอซื้อ ${relatedRequest.productName} ${relatedRequest.quantity.toLocaleString(
        "th-TH"
      )} ${relatedRequest.unit} ต้องการรับที่ ${relatedRequest.deliveryLocation} วันที่ ${relatedRequest.deliveryDate}`
    );
  }

  if (relatedRequest && relatedRequest.quantity < 300) {
    insights.push(
      "ตรวจพบว่าปริมาณอาจต่ำกว่าขั้นต่ำสำหรับการจัดส่งโดยผู้ขาย ควรตกลงเรื่องผู้ซื้อรับเอง รถรับจ้าง หรือค่าขนส่งเพิ่มเติมก่อนส่งข้อเสนอ"
    );
  }

  if (relatedRequest && relatedRequest.quantity > 25) {
    insights.push(
      "ปริมาณเกิน 25 กก. ไม่ควรใช้พัสดุทั่วไปเป็นค่าเริ่มต้น ควรยืนยันรถผู้ขาย รถรับจ้าง หรือ bulk logistics ในแชท"
    );
  }

  if (relatedOrder && currentStep.key === "payment_proof_uploaded") {
    insights.push(
      "รายการนี้เข้าสู่ช่วงชำระเงิน ควรอัปโหลดหลักฐานชำระเงินในระบบและให้ผู้ขายยืนยันรับเงินผ่าน FarmLink"
    );
  }

  if (thread.status === "flagged" || latestRiskMessage) {
    insights.push(
      "ระบบพบสัญญาณความเสี่ยงในแชท กรุณาหลีกเลี่ยงการตกลงนอกระบบ โอนตรง หรือส่งสินค้าก่อนมีหลักฐานใน FarmLink"
    );
  }

  if (insights.length === 0) {
    insights.push(
      "ระบบแนะนำให้ดำเนินการตาม workflow ด้านล่าง และเก็บข้อตกลงเรื่องราคา ปริมาณ ขนส่ง เอกสาร และการชำระเงินไว้ในแชทนี้"
    );
  }

  return insights;
}

function StatusBadge({ value }: { value: string }) {
  const tone =
    value.includes("สูง") || value.includes("ข้อพิพาท") || value.includes("ไม่ครบ")
      ? "bg-red-100 text-red-700 border-red-200"
      : value.includes("ปานกลาง") ||
        value.includes("รอ") ||
        value.includes("ติดตาม") ||
        value.includes("กำลัง")
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : "bg-[#D1FAE5] text-[#06603F] border-[#A7F3D0]";

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${tone}`}>
      {value}
    </span>
  );
}

function StatCard({
  title,
  value,
  detail,
}: {
  title: string;
  value: string | number;
  detail?: string;
}) {
  return (
    <div className="rounded-xl border border-[#DDE7E3] bg-white p-5 shadow-[0_8px_24px_rgba(15,138,95,0.06)]">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-[#064E3B]">{value}</p>
      {detail ? <p className="mt-2 text-sm text-slate-500">{detail}</p> : null}
    </div>
  );
}

function SectionCard({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#DDE7E3] bg-white shadow-[0_8px_24px_rgba(15,138,95,0.06)]">
      <div className="flex flex-col gap-3 border-b border-[#DDE7E3] bg-[#FAFCFB] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-[#064E3B]">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function EmptyHint({ text }: { text: string }) {
  return <p className="rounded-lg bg-[#F3F7F5] p-4 text-sm text-slate-500">{text}</p>;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const role = currentUser?.role ?? null;

  const [isAdminSession, setIsAdminSession] = useState(false);
  const [activeMenu, setActiveMenu] = useState("แดชบอร์ด");
  const [loginMode, setLoginMode] = useState<LoginMode | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ทั้งหมด");

  const [products, setProducts] = useState<PublicProduct[]>(() => loadStoredArray<PublicProduct>(PRODUCTS_STORAGE_KEY, initialProducts));
  const [requests, setRequests] = useState<PurchaseRequest[]>(() => loadStoredArray<PurchaseRequest>(REQUESTS_STORAGE_KEY, initialRequests));
  const [offers, setOffers] = useState<Offer[]>(() => loadStoredArray<Offer>(OFFERS_STORAGE_KEY, initialOffers));
  const [orders, setOrders] = useState<Order[]>(() => loadStoredArray<Order>(ORDERS_STORAGE_KEY, initialOrders));
  const [reviews, setReviews] = useState<BuyerReview[]>(() => loadStoredArray<BuyerReview>(REVIEWS_STORAGE_KEY, initialReviews));
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => loadStoredArray<User>(REGISTERED_USERS_STORAGE_KEY, []));
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(() => loadStoredArray<ChatThread>(CHAT_THREADS_STORAGE_KEY, initialChatThreads));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => loadStoredArray<ChatMessage>(CHAT_MESSAGES_STORAGE_KEY, initialChatMessages));
  const [selectedChatThread, setSelectedChatThread] = useState<ChatThread | null>(null);
  const [risks] = useState<RiskAlert[]>(initialRisks);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [toast, setToast] = useState("พร้อม demo workflow: ผู้ซื้อ -> ผู้ขาย -> ผู้ดูแลระบบ");

  useEffect(() => {
    saveStoredArray(PRODUCTS_STORAGE_KEY, products);
  }, [products]);

  useEffect(() => {
    saveStoredArray(CHAT_THREADS_STORAGE_KEY, chatThreads);
  }, [chatThreads]);

  useEffect(() => {
    saveStoredArray(CHAT_MESSAGES_STORAGE_KEY, chatMessages);
  }, [chatMessages]);

  useEffect(() => {
    saveStoredArray(REQUESTS_STORAGE_KEY, requests);
  }, [requests]);

  useEffect(() => {
    saveStoredArray(OFFERS_STORAGE_KEY, offers);
  }, [offers]);

  useEffect(() => {
    saveStoredArray(ORDERS_STORAGE_KEY, orders);
  }, [orders]);

  useEffect(() => {
    saveStoredArray(REVIEWS_STORAGE_KEY, reviews);
  }, [reviews]);

  useEffect(() => {
    saveStoredArray(REGISTERED_USERS_STORAGE_KEY, registeredUsers);
  }, [registeredUsers]);

  useEffect(() => {
    const reloadChatStateFromStorage = () => {
      setProducts(loadStoredArray<PublicProduct>(PRODUCTS_STORAGE_KEY, initialProducts));
      setChatThreads(loadStoredArray<ChatThread>(CHAT_THREADS_STORAGE_KEY, initialChatThreads));
      setChatMessages(loadStoredArray<ChatMessage>(CHAT_MESSAGES_STORAGE_KEY, initialChatMessages));
      setRequests(loadStoredArray<PurchaseRequest>(REQUESTS_STORAGE_KEY, initialRequests));
      setOffers(loadStoredArray<Offer>(OFFERS_STORAGE_KEY, initialOffers));
      setOrders(loadStoredArray<Order>(ORDERS_STORAGE_KEY, initialOrders));
      setReviews(loadStoredArray<BuyerReview>(REVIEWS_STORAGE_KEY, initialReviews));
      setRegisteredUsers(loadStoredArray<User>(REGISTERED_USERS_STORAGE_KEY, []));
    };

    const handleStorageSync = (event: StorageEvent) => {
      if (
        event.key === PRODUCTS_STORAGE_KEY ||
        event.key === CHAT_THREADS_STORAGE_KEY ||
        event.key === CHAT_MESSAGES_STORAGE_KEY ||
        event.key === REQUESTS_STORAGE_KEY ||
        event.key === OFFERS_STORAGE_KEY ||
        event.key === ORDERS_STORAGE_KEY ||
        event.key === REVIEWS_STORAGE_KEY ||
        event.key === REGISTERED_USERS_STORAGE_KEY
      ) {
        reloadChatStateFromStorage();
      }
    };

    const handleVisibilitySync = () => {
      if (!document.hidden) {
        reloadChatStateFromStorage();
      }
    };

    window.addEventListener("storage", handleStorageSync);
    window.addEventListener("focus", reloadChatStateFromStorage);
    document.addEventListener("visibilitychange", handleVisibilitySync);

    return () => {
      window.removeEventListener("storage", handleStorageSync);
      window.removeEventListener("focus", reloadChatStateFromStorage);
      document.removeEventListener("visibilitychange", handleVisibilitySync);
    };
  }, []);


  const allUsers = useMemo(() => [...demoUsers, ...registeredUsers], [registeredUsers]);

  const filteredPublicProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return products
      .filter((item) => item.status === "active")
      .filter((item) => {
        const matchesKeyword =
          !keyword ||
          [item.productName, item.category, item.area, item.quality]
            .join(" ")
            .toLowerCase()
            .includes(keyword);

        const matchesCategory = categoryFilter === "ทั้งหมด" || item.category.includes(categoryFilter);

        return matchesKeyword && matchesCategory;
      });
  }, [categoryFilter, products, searchTerm]);

  const addAudit = (action: string, item: string, actorRole: string) => {
    const now = new Date();

    setAuditLogs((current) => [
      {
        id: `LOG-${String(current.length + 1).padStart(3, "0")}`,
        actor: currentUser?.displayName || "ระบบ",
        role: actorRole,
        action,
        item,
        timestamp: now.toLocaleString("th-TH", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...current,
    ]);
  };

  const normalizeLoginUsername = (value?: string) =>
    value
      ?.trim()
      .toLowerCase()
      .replace("seller_demo01", "seller_demo_01")
      .replace("seller_demo02", "seller_demo_02")
      .replace("seller_demo03", "seller_demo_03")
      .replace("seller_demo04", "seller_demo_04")
      .replace("buyer_demo01", "buyer_demo_01")
      .replace("buyerdemo01", "buyer_demo_01");

  const chooseRole = (
    _nextRole: Role,
    adminSession = false,
    username?: string,
    password?: string
  ) => {
    const normalizedUsername = normalizeLoginUsername(username);
    const normalizedPassword = password?.trim() ?? "";

    const usernameUser = allUsers.find(
      (user) => user.username.toLowerCase() === normalizedUsername
    );

    let nextUser: User | undefined;

    if (normalizedUsername === "useradmin") {
      if (normalizedPassword !== "admin123") {
        window.alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        return;
      }

      nextUser = allUsers.find((user) => user.role === "admin");
    } else if (usernameUser) {
      if (!normalizedPassword) {
        window.alert("กรุณากรอกรหัสผ่าน");
        return;
      }

      nextUser = usernameUser;
    }

    if (!nextUser) {
      window.alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      return;
    }

    setCurrentUser(nextUser);
    setIsAdminSession(adminSession || nextUser.role === "admin");
    setLoginMode(null);
    setActiveMenu(nextUser.role === "admin" ? "ภาพรวมระบบ" : "แดชบอร์ด");
    setToast(`เข้าสู่ระบบเป็น ${nextUser.displayName}`);
  };

  const registerMember = (input: RegistrationInput) => {
    const normalizedUsername = normalizeLoginUsername(input.username);
    const normalizedPassword = input.password.trim();

    if (!normalizedUsername || !normalizedPassword || !input.displayName.trim()) {
      window.alert("กรุณากรอกชื่อผู้ใช้ รหัสผ่าน และชื่อสมาชิกให้ครบ");
      return;
    }

    if (normalizedUsername === "useradmin" || allUsers.some((user) => user.username.toLowerCase() === normalizedUsername)) {
      window.alert("ชื่อผู้ใช้นี้ถูกใช้แล้ว กรุณาใช้ชื่ออื่น");
      return;
    }

    const newUser: User = {
      id: `${input.role}_${Date.now()}`,
      username: normalizedUsername,
      displayName: input.displayName.trim(),
      role: input.role,
      province: input.province.trim() || "ยังไม่ระบุจังหวัด",
      organizationType:
        input.organizationType.trim() || (input.role === "seller" ? "เกษตรกร/ผู้ขายสินค้าเกษตร" : "ผู้ซื้อสินค้าเกษตร"),
      verificationStatus: input.role === "seller" ? "pending_review" : "member",
    };

    setRegisteredUsers((current) => [newUser, ...current]);
    setCurrentUser(newUser);
    setIsAdminSession(false);
    setLoginMode(null);
    setActiveMenu("แดชบอร์ด");
    setToast(
      input.role === "seller"
        ? `สมัครผู้ขาย/เกษตรกร ${newUser.displayName} แล้ว รอผู้ดูแลตรวจสอบข้อมูล`
        : `สมัครผู้ซื้อ ${newUser.displayName} แล้ว`
    );
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdminSession(false);
    setLoginMode(null);
    setActiveMenu("แดชบอร์ด");
  };

  const getOrCreateChatThread = ({
    threadType,
    rfqId,
    orderId,
    productId,
    buyerId,
    sellerId,
  }: {
    threadType: ChatThread["threadType"];
    rfqId?: string;
    orderId?: string;
    productId?: string;
    buyerId: string;
    sellerId: string;
  }) => {
    const existingThread = chatThreads.find((thread) => {
      if (threadType === "order") return thread.orderId === orderId && thread.buyerId === buyerId && thread.sellerId === sellerId;
      if (threadType === "rfq") return thread.rfqId === rfqId && thread.buyerId === buyerId && thread.sellerId === sellerId;
      return false;
    });

    if (existingThread) {
      setSelectedChatThread(existingThread);
      return existingThread;
    }

    const now = new Date().toISOString();
    const newThread: ChatThread = {
      id: crypto.randomUUID(),
      threadType,
      rfqId,
      orderId,
      productId,
      buyerId,
      sellerId,
      status: "open",
      createdAt: now,
      updatedAt: now,
    };

    setChatThreads((current) => [newThread, ...current]);
    setSelectedChatThread(newThread);
    return newThread;
  };

  const openRequestChat = (request: PurchaseRequest) => {
    if (!request.sellerId) {
      setToast("ยังไม่มีผู้ขายที่เกี่ยวข้องกับคำขอซื้อนี้");
      return;
    }

    getOrCreateChatThread({
      threadType: "rfq",
      rfqId: request.id,
      productId: request.productId,
      buyerId: request.buyerId,
      sellerId: request.sellerId,
    });
  };

  const openOrderChat = (order: Order) => {
    getOrCreateChatThread({
      threadType: "order",
      orderId: order.id,
      buyerId: order.buyerId,
      sellerId: order.sellerId,
    });
  };

  const markChatThreadAsRead = (threadId: string) => {
    if (!currentUser) return;

    const now = new Date().toISOString();

    setChatMessages((current) => {
      let changed = false;

      const nextMessages = current.map((message) => {
        if (message.threadId !== threadId) return message;

        const existingReadBy = message.readBy || [];

        if (existingReadBy.includes(currentUser.id)) return message;

        changed = true;

        return {
          ...message,
          readBy: [...existingReadBy, currentUser.id],
        };
      });

      if (changed) {
        saveStoredArray(CHAT_MESSAGES_STORAGE_KEY, nextMessages);
        return nextMessages;
      }

      return current;
    });

    setChatThreads((current) => {
      const nextThreads = current.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              updatedAt: now,
            }
          : thread
      );
      saveStoredArray(CHAT_THREADS_STORAGE_KEY, nextThreads);
      return nextThreads;
    });
  };

  const sendChatMessage = (thread: ChatThread, message: string, options?: ChatSendOptions) => {
    if (!currentUser) return;

    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    const risk = options?.skipRisk
      ? { riskLevel: "low" as const, riskReasons: [] }
      : detectChatRisk(trimmedMessage);
    const now = new Date().toISOString();

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      threadId: thread.id,
      senderId: currentUser.id,
      senderRole: currentUser.role,
      message: trimmedMessage,
      messageType: "user_message",
      riskLevel: risk.riskLevel,
      riskReasons: risk.riskReasons,
      readBy: [currentUser.id],
      createdAt: now,
    };

    const systemWarning: ChatMessage | null = risk.warning
      ? {
          id: crypto.randomUUID(),
          threadId: thread.id,
          senderId: "system",
          senderRole: "system",
          message: risk.warning,
          messageType: "system_warning",
          riskLevel: risk.riskLevel,
          riskReasons: risk.riskReasons,
          readBy: [currentUser.id],
          createdAt: now,
        }
      : null;

    setChatMessages((current) => {
      const nextMessages = [
        ...current,
        userMessage,
        ...(systemWarning ? [systemWarning] : []),
      ];
      saveStoredArray(CHAT_MESSAGES_STORAGE_KEY, nextMessages);
      return nextMessages;
    });

    setChatThreads((current) => {
      const nextThreads = current.map((item) =>
        item.id === thread.id
          ? {
              ...item,
              status: risk.riskLevel === "high" ? "flagged" : item.status,
              updatedAt: now,
            }
          : item
      );
      saveStoredArray(CHAT_THREADS_STORAGE_KEY, nextThreads);
      return nextThreads;
    });

    if (risk.riskLevel === "high") {
      addAudit("ตรวจพบข้อความเสี่ยงสูงในแชท", `${thread.threadType.toUpperCase()} ${thread.rfqId || thread.orderId || thread.id}`, "ระบบ");
      setToast("ระบบตรวจพบข้อความที่อาจมีความเสี่ยงสูง และส่งให้ผู้ดูแลระบบตรวจสอบ");
    } else if (risk.riskLevel === "medium") {
      addAudit("ตรวจพบข้อความควรระวังในแชท", `${thread.threadType.toUpperCase()} ${thread.rfqId || thread.orderId || thread.id}`, "ระบบ");
      setToast("ระบบแทรกคำเตือนความปลอดภัยในแชทแล้ว");
    }
  };

  const createPoSoFromChat = (thread: ChatThread, request?: PurchaseRequest) => {
    if (!currentUser || currentUser.role !== "seller") {
      setToast("เฉพาะผู้ขายเท่านั้นที่ยืนยันรับคำสั่งซื้อและสร้าง PO/SO ได้");
      return null;
    }

    const relatedRequest =
      request ||
      requests.find((item) => item.id === thread.rfqId);

    if (!relatedRequest || !relatedRequest.sellerId) {
      setToast("ไม่พบคำขอซื้อที่เกี่ยวข้องกับแชทนี้");
      return null;
    }

    if (relatedRequest.sellerId !== currentUser.id) {
      setToast("ไม่สามารถสร้าง PO/SO ให้คำขอซื้อที่ไม่ใช่ของคุณได้");
      return null;
    }

    const existingOrder = orders.find(
      (order) =>
        order.requestId === relatedRequest.id &&
        order.buyerId === relatedRequest.buyerId &&
        order.sellerId === relatedRequest.sellerId
    );

    const now = new Date().toISOString();

    if (existingOrder) {
      const existingSoId = existingOrder.salesOrderId || existingOrder.id.replace("PO-", "SO-");

      setChatThreads((current) =>
        current.map((item) =>
          item.id === thread.id
            ? {
                ...item,
                threadType: "order",
                orderId: existingOrder.id,
                updatedAt: now,
              }
            : item
        )
      );

      setToast(`มี PO/SO อยู่แล้ว: ${existingOrder.id} / ${existingSoId}`);
      return {
        poId: existingOrder.id,
        soId: existingSoId,
        created: false,
      };
    }

    const nextIndex = orders.length + 1;
    const documentNumber = String(nextIndex).padStart(4, "0");
    const poId = `PO-2026-${documentNumber}`;
    const soId = `SO-2026-${documentNumber}`;

    const firstPriceMatch = relatedRequest.targetPrice.match(/\d+(?:\.\d+)?/);
    const inferredPrice = firstPriceMatch ? Number(firstPriceMatch[0]) : 0;
    const buyerName =
      demoUsers.find((user) => user.id === relatedRequest.buyerId)?.displayName || "ผู้ซื้อ";
    const sellerName = currentUser.displayName;

    const newOrder: Order = {
      id: poId,
      salesOrderId: soId,
      requestId: relatedRequest.id,
      salesOfferId: `OFF-${relatedRequest.id}`,
      buyerId: relatedRequest.buyerId,
      sellerId: relatedRequest.sellerId,
      productName: relatedRequest.productName,
      buyerName,
      sellerName,
      quantity: relatedRequest.quantity,
      price: inferredPrice,
      deliveryDate: relatedRequest.deliveryDate,
      status: "ยืนยันคำสั่งซื้อแล้ว / รอส่งมอบ",
      proofStatus: "รอผู้ขายอัปโหลดหลักฐานส่งมอบ",
    };

    setOrders((current) => [newOrder, ...current]);

    setRequests((current) =>
      current.map((item) =>
        item.id === relatedRequest.id
          ? {
              ...item,
              status: "สร้าง PO/SO แล้ว",
            }
          : item
      )
    );

    setChatThreads((current) =>
      current.map((item) =>
        item.id === thread.id
          ? {
              ...item,
              threadType: "order",
              orderId: poId,
              updatedAt: now,
            }
          : item
      )
    );

    addAudit("สร้าง PO/SO จากแชท", `${poId} / ${soId} สำหรับ ${relatedRequest.productName}`, "ผู้ขาย/เกษตรกร");
    setToast(`สร้าง PO/SO สำเร็จ: ${poId} / ${soId}`);

    return {
      poId,
      soId,
      created: true,
    };
  };


  const createDemoRequest = () => {
    if (!currentUser || currentUser.role !== "buyer") {
      setToast("เฉพาะผู้ซื้อเท่านั้นที่สร้างคำขอซื้อได้");
      return;
    }

    if (requests.some((item) => item.id === "REQ-DEMO" && item.buyerId === currentUser.id)) {
      setToast("มีคำขอซื้อ demo อยู่แล้ว");
      setActiveMenu("คำขอซื้อของฉัน");
      return;
    }

    const newRequest: PurchaseRequest = {
      id: "REQ-DEMO",
      buyerId: currentUser.id,
      sellerId: "seller_demo_01",
      productId: "PUB-004",
      productName: "พริกหวาน",
      category: "ผัก",
      quantity: 250,
      unit: "กก.",
      qualitySpec: "คัดเกรด สีสม่ำเสมอ พร้อมส่งภายใน 5 วัน",
      deliveryLocation: "โรงพยาบาลชุมชนแม่ริม",
      deliveryDate: "22 มิ.ย. 2026",
      targetPrice: "45-55 บาท/กก.",
      status: "เปิดรับข้อเสนอ",
      riskLevel: "ต่ำ",
      offers: 0,
    };

    setRequests((current) => [newRequest, ...current]);
    addAudit("สร้างคำขอซื้อ", "REQ-DEMO พริกหวาน 250 กก.", "ผู้ซื้อ");
    setToast("สร้างคำขอซื้อ demo สำเร็จ และแสดงในประกาศรับซื้อของผู้ขายแล้ว");
    setActiveMenu("คำขอซื้อของฉัน");
  };


  const createPurchaseRequestFromProduct = (product: PublicProduct, form: PurchaseRequestFormState) => {
    if (!currentUser || currentUser.role !== "buyer") {
      setToast("เฉพาะผู้ซื้อเท่านั้นที่สร้างคำขอซื้อได้");
      return;
    }

    const requestedQuantity = Number(form.requestedQuantity || product.minOrderQuantity || 0);
    const remainingQuantity = getRemainingQuantity(product);

    if (!Number.isFinite(requestedQuantity) || requestedQuantity <= 0) {
      setToast("กรุณาระบุปริมาณที่ต้องการให้ถูกต้อง");
      return;
    }

    if (remainingQuantity <= 0) {
      setToast("สินค้านี้หมดชั่วคราว ไม่สามารถสร้างคำขอซื้อได้");
      return;
    }

    const isBelowMinimum = requestedQuantity < product.minOrderQuantity;
    const isOverRemaining = requestedQuantity > remainingQuantity;

    const riskLevel: PurchaseRequest["riskLevel"] =
      isOverRemaining ? "สูง" : isBelowMinimum ? "ปานกลาง" : "ต่ำ";

    const newRequest: PurchaseRequest = {
      id: `REQ-${String(requests.length + 1).padStart(3, "0")}`,
      buyerId: currentUser.id,
      sellerId: product.sellerId,
      productId: product.id,
      productName: product.productName,
      category: product.category,
      quantity: requestedQuantity,
      unit: product.unit,
      qualitySpec: form.qualitySpec || product.quality,
      deliveryLocation: form.deliveryLocation,
      deliveryDate: formatThaiDateFromDateInput(form.deliveryDate),
      targetPrice: form.targetPrice || product.priceRange,
      status: isOverRemaining ? "รอผู้ขายตรวจสอบปริมาณ" : "เปิดรับข้อเสนอ",
      riskLevel,
      offers: 0,
    };

    setRequests((current) => [newRequest, ...current]);

    const newThread = getOrCreateChatThread({
      threadType: "rfq",
      rfqId: newRequest.id,
      productId: product.id,
      buyerId: currentUser.id,
      sellerId: product.sellerId,
    });

    const now = new Date().toISOString();
    setChatMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        threadId: newThread.id,
        senderId: currentUser.id,
        senderRole: "buyer",
        messageType: "user_message",
        message: `ส่งคำขอซื้อ ${product.productName} ปริมาณ ${requestedQuantity.toLocaleString("th-TH")} ${product.unit} ต้องการรับวันที่ ${formatThaiDateFromDateInput(form.deliveryDate)} เงื่อนไขขนส่ง: ${form.deliveryPreference || "ให้ผู้ขายเสนอทางเลือก"}`,
        riskLevel: "low",
        riskReasons: [],
        readBy: [currentUser.id],
        createdAt: now,
      },
      {
        id: crypto.randomUUID(),
        threadId: newThread.id,
        senderId: "system",
        senderRole: "system",
        messageType: "system_warning",
        message: "คำขอซื้อถูกส่งแล้ว รายการนี้ยังไม่ถือเป็นการจองสินค้า กรุณารอผู้ขายยืนยันปริมาณ ราคา วันส่งมอบ และเงื่อนไขขนส่งก่อนสร้างคำสั่งซื้อ",
        riskLevel: "low",
        riskReasons: [],
        readBy: [currentUser.id],
        createdAt: now,
      },
    ]);

    addAudit(
      "สร้างคำขอซื้อจากสินค้า",
      `${newRequest.id} ${product.productName} ${requestedQuantity.toLocaleString("th-TH")} ${product.unit}`,
      "ผู้ซื้อ"
    );

    if (isOverRemaining) {
      setToast("ส่งคำขอซื้อแล้ว แต่ปริมาณเกินคงเหลือโดยประมาณ ระบบจะให้ผู้ขายตรวจสอบก่อน");
    } else if (isBelowMinimum) {
      setToast("ส่งคำขอซื้อแล้ว แต่ปริมาณต่ำกว่าขั้นต่ำ ผู้ขายอาจเสนอเงื่อนไขขนส่งเพิ่มเติม");
    } else {
      setToast("ส่งคำขอซื้อสำเร็จ ผู้ขายสามารถตรวจสอบและตอบข้อเสนอได้");
    }

    setActiveMenu("คำขอซื้อของฉัน");
  };

  const submitDemoOffer = (requestId: string) => {
    if (!currentUser || currentUser.role !== "seller") {
      setToast("เฉพาะผู้ขายเท่านั้นที่ส่งข้อเสนอขายได้");
      return;
    }

    if (offers.some((item) => item.requestId === requestId && item.sellerId === currentUser.id)) {
      setToast("คุณส่งข้อเสนอขายสำหรับรายการนี้แล้ว");
      setActiveMenu("แชทจากผู้ซื้อ");
      return;
    }

    const request = requests.find((item) => item.id === requestId);

    if (!request) {
      setToast("ไม่พบคำขอซื้อ");
      return;
    }

    const newOffer: Offer = {
      id: `OFF-${String(offers.length + 1).padStart(3, "0")}`,
      requestId,
      buyerId: request.buyerId,
      sellerId: currentUser.id,
      sellerName: currentUser.displayName,
      area: currentUser.province || "ไม่ระบุพื้นที่",
      quantity: Math.min(request.quantity, 250),
      price: request.productName === "พริกหวาน" ? 49 : 61,
      deliveryDate: request.deliveryDate,
      trustScore: 86,
      verificationStatus: "ตรวจสอบแล้ว",
      status: "รอผู้ซื้อพิจารณา",
      risk: "ไม่มี",
    };

    setOffers((current) => [newOffer, ...current]);
    setRequests((current) =>
      current.map((item) =>
        item.id === requestId
          ? { ...item, offers: item.offers + 1, status: "กำลังคัดเลือกผู้ขาย" }
          : item
      )
    );

    addAudit("ส่งข้อเสนอขาย", `${newOffer.id} สำหรับ ${requestId}`, "ผู้ขาย/เกษตรกร");
    setToast("ส่งข้อเสนอขายสำเร็จ ผู้ซื้อสามารถเปรียบเทียบข้อเสนอได้แล้ว");
    setActiveMenu("แชทจากผู้ซื้อ");
  };

  const acceptOffer = (offer: Offer) => {
    if (!currentUser || currentUser.role !== "buyer") {
      setToast("เฉพาะผู้ซื้อเท่านั้นที่เลือกข้อเสนอได้");
      return;
    }

    if (orders.some((item) => item.salesOfferId === offer.id)) {
      setToast("ข้อเสนอนี้ถูกเลือกและสร้างคำสั่งซื้อแล้ว");
      setActiveMenu("ดีล / คำสั่งซื้อของฉัน");
      return;
    }

    const request = requests.find((item) => item.id === offer.requestId);

    if (!request) {
      setToast("ไม่พบคำขอซื้อ");
      return;
    }

    const newOrder: Order = {
      id: `PO-2026-${String(orders.length + 1).padStart(4, "0")}`,
      requestId: offer.requestId,
      salesOfferId: offer.id,
      buyerId: currentUser.id,
      sellerId: offer.sellerId,
      productName: request.productName,
      buyerName: currentUser.displayName,
      sellerName: offer.sellerName,
      quantity: offer.quantity,
      price: offer.price,
      deliveryDate: offer.deliveryDate,
      status: "ยืนยันแล้ว",
      proofStatus: "ยังไม่ส่งหลักฐาน",
    };

    setOrders((current) => [newOrder, ...current]);
    setOffers((current) =>
      current.map((item) =>
        item.id === offer.id
          ? { ...item, status: "ถูกเลือก" }
          : item.requestId === offer.requestId
          ? { ...item, status: "ไม่ถูกเลือก" }
          : item
      )
    );
    setRequests((current) =>
      current.map((item) =>
        item.id === offer.requestId ? { ...item, status: "สร้างคำสั่งซื้อแล้ว" } : item
      )
    );

    addAudit("เลือกข้อเสนอและสร้างคำสั่งซื้อ", `${newOrder.id} จาก ${offer.sellerName}`, "ผู้ซื้อ");
    setToast("เลือกข้อเสนอสำเร็จ ระบบสร้างคำสั่งซื้อแล้ว");
    setActiveMenu("ดีล / คำสั่งซื้อของฉัน");
  };

  const uploadDeliveryProof = () => {
    if (!currentUser || currentUser.role !== "seller") {
      setToast("เฉพาะผู้ขายเท่านั้นที่อัปโหลดหลักฐานได้");
      return;
    }

    const targetOrder = orders.find((item) => item.sellerId === currentUser.id);

    if (!targetOrder) {
      setToast("ยังไม่มีคำสั่งซื้อที่ต้องส่งหลักฐาน");
      return;
    }

    setOrders((current) =>
      current.map((item) =>
        item.id === targetOrder.id
          ? {
              ...item,
              status: "ส่งมอบแล้ว",
              proofStatus: "ส่งหลักฐานครบ รอผู้ซื้อยืนยัน",
            }
          : item
      )
    );

    addAudit("อัปโหลดหลักฐานการส่งมอบ", targetOrder.id, "ผู้ขาย/เกษตรกร");
    setToast("อัปโหลดหลักฐานการส่งมอบสำเร็จ");
    setActiveMenu("ดีล / คำสั่งซื้อของฉัน");
  };

  const confirmDelivery = (orderId: string) => {
    if (!currentUser || currentUser.role !== "buyer") {
      setToast("เฉพาะผู้ซื้อเท่านั้นที่ยืนยันรับสินค้าได้");
      return;
    }

    setOrders((current) =>
      current.map((item) =>
        item.id === orderId && item.buyerId === currentUser.id
          ? { ...item, status: "เสร็จสมบูรณ์", proofStatus: "ผู้ซื้อยืนยันแล้ว" }
          : item
      )
    );

    addAudit("ยืนยันรับสินค้า", orderId, "ผู้ซื้อ");
    setToast("ยืนยันรับสินค้าแล้ว ธุรกรรมถูกปิดเป็นเสร็จสมบูรณ์");
  };


  const submitBuyerReview = (order: Order, form: ReviewFormState) => {
    if (!currentUser || currentUser.role !== "buyer") {
      setToast("เฉพาะผู้ซื้อเท่านั้นที่ส่งรีวิวได้");
      return;
    }

    const isCompleted = order.status === "เสร็จสมบูรณ์" || order.proofStatus.includes("ผู้ซื้อยืนยันแล้ว");

    if (!isCompleted || order.buyerId !== currentUser.id) {
      setToast("รีวิวได้เฉพาะคำสั่งซื้อของคุณที่เสร็จสมบูรณ์แล้ว");
      return;
    }

    const hasReviewed = reviews.some(
      (review) =>
        review.orderId === order.id &&
        review.buyerId === currentUser.id &&
        review.status !== "hidden"
    );

    if (hasReviewed) {
      setToast("คำสั่งซื้อนี้ถูกรีวิวแล้ว");
      return;
    }

    const newReview: BuyerReview = {
      id: crypto.randomUUID(),
      productName: order.productName,
      sellerId: order.sellerId,
      buyerId: currentUser.id,
      orderId: order.id,
      qualityRating: form.qualityRating,
      deliveryRating: form.deliveryRating,
      documentRating: form.documentRating,
      comment: form.comment.trim() || "ผู้ซื้อยืนยันว่าธุรกรรมนี้ส่งมอบสำเร็จ",
      status: "published",
      createdAt: new Date().toISOString(),
    };

    setReviews((current) => [newReview, ...current]);
    addAudit("ส่งรีวิวหลังการส่งมอบ", `${order.id} ${order.productName}`, "ผู้ซื้อ");
    setToast("ส่งรีวิวสำเร็จ รีวิวจะแสดงในหน้ารายละเอียดสินค้าโดยไม่เปิดเผยชื่อจริงผู้ซื้อ");
  };

  const createReport = () => {
    addAudit("สร้างรายงาน", "รายงานภาพรวมคำขอซื้อและความเสี่ยง", "ผู้ดูแลระบบ");
    setToast("สร้างรายงาน mock สำเร็จ พร้อมส่งออก PDF/CSV สำหรับ demo");
  };

  const addSellerProduct = (form: ProductFormState) => {
    if (!currentUser || currentUser.role !== "seller") {
      setToast("เฉพาะผู้ขายเท่านั้นที่เพิ่มสินค้าได้");
      return;
    }

    const newProduct: PublicProduct = {
      id: crypto.randomUUID(),
      sellerId: currentUser.id,
      productName: form.productName,
      category: form.category,
      area: form.area,
      quantityText: form.quantityText,
      quality: form.quality,
      priceRange: form.priceRange,
      availableDate: form.availableDate,
      season: form.season,
      status: "active",
      availableQuantity: Number(form.availableQuantity) || 0,
      reservedQuantity: Number(form.reservedQuantity) || 0,
      soldQuantity: Number(form.soldQuantity) || 0,
      unit: form.unit || "กก.",
      minOrderQuantity: Number(form.minOrderQuantity) || 1,
      maxOrderQuantity: Number(form.maxOrderQuantity) || undefined,
      stockStatus: (form.stockStatus || "available") as StockStatus,
      sellerCanDeliver: form.sellerCanDeliver === "yes",
      deliveryAreaType: (form.deliveryAreaType || "same_province") as DeliveryAreaType,
      deliveryAreaText: form.deliveryAreaText || "จังหวัดเดียวกัน",
      minimumSellerDeliveryQuantity: Number(form.minimumSellerDeliveryQuantity) || 300,
      minimumSellerDeliveryUnit: form.minimumSellerDeliveryUnit || "กก.",
      shippingFeePolicy: (form.shippingFeePolicy || "quoted_later") as ShippingFeePolicy,
      shippingFeeAmount: Number(form.shippingFeeAmount) || undefined,
      shippingFeeNote: form.shippingFeeNote,
      buyerPickupAvailable: form.buyerPickupAvailable !== "no",
      pickupLocationText: form.pickupLocationText,
      thirdPartyLogisticsAvailable: form.thirdPartyLogisticsAvailable !== "no",
      coldChainAvailable: form.coldChainAvailable === "yes",
      vehicleTypes: form.vehicleTypes
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      deliveryNote: form.deliveryNote,
      parcelShippingAllowed: form.parcelShippingAllowed !== "no",
      parcelCarrierRecommendation:
        Number(form.minOrderQuantity) <= (Number(form.parcelMaxWeightKg) || DEFAULT_PARCEL_MAX_WEIGHT_KG)
          ? "thailand_post"
          : "not_recommended",
      parcelCarrierName: form.parcelCarrierName || "ไปรษณีย์ไทย",
      parcelMaxWeightKg: Number(form.parcelMaxWeightKg) || DEFAULT_PARCEL_MAX_WEIGHT_KG,
      parcelClaimSupported: form.parcelClaimSupported !== "no",
      parcelClaimNote:
        form.parcelClaimNote ||
        "มี tracking และสามารถร้องเรียน/ขอชดใช้กรณีเสียหายหรือสูญหายได้ตามเงื่อนไขผู้ให้บริการ",
      bulkTransportRecommendedAboveKg: Number(form.bulkTransportRecommendedAboveKg) || DEFAULT_PARCEL_MAX_WEIGHT_KG,
      bulkShippingMinKg: Number(form.bulkShippingMinKg) || 100,
      sellerOwnVehicleAvailable: form.sellerOwnVehicleAvailable === "yes",
      localHiredVehicleAvailable: form.localHiredVehicleAvailable !== "no",
      interProvinceLogisticsAvailable: form.interProvinceLogisticsAvailable === "yes",
      imageUrl: form.imageUrl,
      isDemo: false,
    };

    setProducts((current) => [newProduct, ...current]);
    addAudit("เพิ่มสินค้าใหม่", newProduct.productName, "ผู้ขาย/เกษตรกร");
    setToast(`เพิ่มสินค้า "${newProduct.productName}" สำเร็จ`);
    setActiveMenu("สินค้าของฉัน");
  };

  const editSellerProduct = (productId: string, form: ProductFormState) => {
    if (!currentUser || currentUser.role !== "seller") {
      setToast("เฉพาะผู้ขายเท่านั้นที่แก้ไขสินค้าได้");
      return;
    }

    const targetProduct = products.find(
      (product) => product.id === productId && product.sellerId === currentUser.id
    );

    if (!targetProduct) {
      setToast("ไม่สามารถแก้ไขสินค้าที่ไม่ใช่ของคุณได้");
      return;
    }

    const updatedProduct: PublicProduct = {
      ...targetProduct,
      productName: form.productName,
      category: form.category,
      area: form.area,
      quantityText: form.quantityText,
      quality: form.quality,
      priceRange: form.priceRange,
      availableDate: form.availableDate,
      season: form.season,
      availableQuantity: Number(form.availableQuantity) || 0,
      reservedQuantity: Number(form.reservedQuantity) || 0,
      soldQuantity: Number(form.soldQuantity) || 0,
      unit: form.unit || "กก.",
      minOrderQuantity: Number(form.minOrderQuantity) || 1,
      maxOrderQuantity: Number(form.maxOrderQuantity) || undefined,
      stockStatus: (form.stockStatus || targetProduct.stockStatus || "available") as StockStatus,
      sellerCanDeliver: form.sellerCanDeliver === "yes",
      deliveryAreaType: (form.deliveryAreaType || "same_province") as DeliveryAreaType,
      deliveryAreaText: form.deliveryAreaText || "จังหวัดเดียวกัน",
      minimumSellerDeliveryQuantity: Number(form.minimumSellerDeliveryQuantity) || 300,
      minimumSellerDeliveryUnit: form.minimumSellerDeliveryUnit || "กก.",
      shippingFeePolicy: (form.shippingFeePolicy || "quoted_later") as ShippingFeePolicy,
      shippingFeeAmount: Number(form.shippingFeeAmount) || undefined,
      shippingFeeNote: form.shippingFeeNote,
      buyerPickupAvailable: form.buyerPickupAvailable !== "no",
      pickupLocationText: form.pickupLocationText,
      thirdPartyLogisticsAvailable: form.thirdPartyLogisticsAvailable !== "no",
      coldChainAvailable: form.coldChainAvailable === "yes",
      vehicleTypes: form.vehicleTypes
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      deliveryNote: form.deliveryNote,
      parcelShippingAllowed: form.parcelShippingAllowed !== "no",
      parcelCarrierRecommendation:
        Number(form.minOrderQuantity) <= (Number(form.parcelMaxWeightKg) || DEFAULT_PARCEL_MAX_WEIGHT_KG)
          ? "thailand_post"
          : "not_recommended",
      parcelCarrierName: form.parcelCarrierName || "ไปรษณีย์ไทย",
      parcelMaxWeightKg: Number(form.parcelMaxWeightKg) || DEFAULT_PARCEL_MAX_WEIGHT_KG,
      parcelClaimSupported: form.parcelClaimSupported !== "no",
      parcelClaimNote:
        form.parcelClaimNote ||
        "มี tracking และสามารถร้องเรียน/ขอชดใช้กรณีเสียหายหรือสูญหายได้ตามเงื่อนไขผู้ให้บริการ",
      bulkTransportRecommendedAboveKg: Number(form.bulkTransportRecommendedAboveKg) || DEFAULT_PARCEL_MAX_WEIGHT_KG,
      bulkShippingMinKg: Number(form.bulkShippingMinKg) || 100,
      sellerOwnVehicleAvailable: form.sellerOwnVehicleAvailable === "yes",
      localHiredVehicleAvailable: form.localHiredVehicleAvailable !== "no",
      interProvinceLogisticsAvailable: form.interProvinceLogisticsAvailable === "yes",
      imageUrl: form.imageUrl,
      isDemo: targetProduct.isDemo,
    };

    setProducts((current) =>
      current.map((product) =>
        product.id === productId && product.sellerId === currentUser.id ? updatedProduct : product
      )
    );

    addAudit("แก้ไขสินค้า", updatedProduct.productName, "ผู้ขาย/เกษตรกร");
    setToast(`แก้ไขสินค้า "${updatedProduct.productName}" สำเร็จ`);
    setActiveMenu("สินค้าของฉัน");
  };

  const updateSellerProductImage = (productId: string, imageUrl?: string) => {
    if (!currentUser || currentUser.role !== "seller") {
      setToast("เฉพาะผู้ขายเท่านั้นที่จัดการรูปภาพสินค้าได้");
      return;
    }

    const targetProduct = products.find(
      (product) => product.id === productId && product.sellerId === currentUser.id
    );

    if (!targetProduct) {
      setToast("ไม่สามารถจัดการรูปภาพสินค้าที่ไม่ใช่ของคุณได้");
      return;
    }

    setProducts((current) =>
      current.map((product) =>
        product.id === productId && product.sellerId === currentUser.id
          ? { ...product, imageUrl }
          : product
      )
    );

    addAudit(imageUrl ? "อัปเดตรูปภาพสินค้า" : "ลบรูปภาพสินค้า", targetProduct.productName, "ผู้ขาย/เกษตรกร");
    setToast(imageUrl ? `อัปเดตรูปภาพ "${targetProduct.productName}" สำเร็จ` : `ลบรูปภาพ "${targetProduct.productName}" แล้ว`);
    setActiveMenu("สินค้าของฉัน");
  };

  const deleteSellerProduct = (productId: string) => {
    if (!currentUser || currentUser.role !== "seller") return;

    const targetProduct = products.find(
      (product) => product.id === productId && product.sellerId === currentUser.id
    );

    if (!targetProduct) {
      setToast("ไม่สามารถลบสินค้าที่ไม่ใช่ของคุณได้");
      return;
    }

    setProducts((current) =>
      current.filter((product) => !(product.id === productId && product.sellerId === currentUser.id))
    );

    addAudit("ลบสินค้า", targetProduct.productName, "ผู้ขาย/เกษตรกร");
    setToast(`ลบสินค้า "${targetProduct.productName}" แล้ว`);
  };

  if (!currentUser || !role) {
    return (
      <PublicCatalog
        products={filteredPublicProducts}
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        loginMode={loginMode}
        onSearchChange={setSearchTerm}
        onCategoryChange={setCategoryFilter}
        onLoginModeChange={setLoginMode}
        onLogin={chooseRole}
        onRegister={registerMember}
      />
    );
  }

  const currentMenus = menus[role];

  const menuBadgeCounts: Record<string, number> = {};
  const myChatThreadCount = chatThreads.filter((thread) =>
    role === "buyer" ? thread.buyerId === currentUser.id : role === "seller" ? thread.sellerId === currentUser.id : false
  ).length;

  if (role === "buyer") {
    menuBadgeCounts["แชทการจัดซื้อ"] = myChatThreadCount;
    menuBadgeCounts["ประวัติธุรกรรม"] =
      requests.filter((request) => request.buyerId === currentUser.id).length +
      orders.filter((order) => order.buyerId === currentUser.id).length;
  }

  if (role === "seller") {
    menuBadgeCounts["แชทจากผู้ซื้อ"] = myChatThreadCount;
    menuBadgeCounts["ประวัติธุรกรรม"] =
      offers.filter((offer) => offer.sellerId === currentUser.id).length +
      orders.filter((order) => order.sellerId === currentUser.id).length;
  }

  return (
    <div className="min-h-screen bg-[#F3F7F5] text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-72 overflow-y-auto bg-[#064E3B] px-5 py-6 text-white lg:block shadow-[8px_0_28px_rgba(6,78,59,0.18)]">
        <button onClick={logout} className="text-left">
          <p className="text-2xl font-bold">FarmLink</p>
          <p className="text-sm text-emerald-100">ฟาร์มลิงก์</p>
          <p className="mt-2 inline-flex rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-emerald-50">
            BAAC Trust Green Theme
          </p>
        </button>

        <div className="mt-8 rounded-xl border border-white/15 bg-white/10 p-4 shadow-inner">
          <p className="text-sm text-slate-300">ผู้ใช้งานปัจจุบัน</p>
          <p className="mt-1 font-bold">{currentUser.displayName}</p>
          <p className="mt-1 text-sm text-slate-300">{roleLabels[role]}</p>
        </div>

        <nav className="mt-6 space-y-1">
          {currentMenus.map((item) => (
            <button
              key={item}
              onClick={() => setActiveMenu(item)}
              className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium ${
                activeMenu === item ? "bg-[#0F8A5F] text-white" : "text-slate-200 hover:bg-white/10"
              }`}
            >
              <span className="flex w-full items-center justify-between gap-2">
                <span>{item}</span>
                {menuBadgeCounts[item] ? (
                  <span className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-bold ${
                    activeMenu === item ? "bg-white text-[#06603F]" : "bg-[#0F8A5F] text-white"
                  }`}>
                    {menuBadgeCounts[item]}
                  </span>
                ) : null}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-[#DDE7E3] bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-slate-500">FarmLink MVP Demo</p>
              <h1 className="text-2xl font-bold text-[#0F172A]">
                {roleLabels[role]} / {activeMenu}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                เข้าสู่ระบบเป็น: {currentUser.displayName}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {isAdminSession ? (
                <>
                  <span className="rounded-md bg-amber-100 px-3 py-2 text-sm font-medium text-amber-800">
                    โหมดผู้ดูแลระบบ
                  </span>
                  {(["buyer", "seller", "admin"] as Role[]).map((item) => (
                    <button
                      key={item}
                      onClick={() => chooseRole(item, true)}
                      className={`rounded-md border px-3 py-2 text-sm font-medium ${
                        role === item
                          ? "border-emerald-600 bg-[#0F8A5F] text-white"
                          : "border-[#DDE7E3] bg-white text-slate-700"
                      }`}
                    >
                      {item === "admin" ? "กลับผู้ดูแลระบบ" : `ดูในมุม${roleLabels[item]}`}
                    </button>
                  ))}
                </>
              ) : null}

              <button
                onClick={logout}
                className="rounded-md border border-[#DDE7E3] px-3 py-2 text-sm font-medium text-slate-700"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </header>

        <main className="space-y-6 p-5 lg:p-8">
          <div className="rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] px-4 py-3 text-sm text-emerald-800">
            {toast}
          </div>

          <RoleContent
            currentUser={currentUser}
            role={role}
            activeMenu={activeMenu}
            products={products}
            requests={requests}
            offers={offers}
            orders={orders}
            reviews={reviews}
            chatThreads={chatThreads}
            chatMessages={chatMessages}
            risks={risks}
            auditLogs={auditLogs}
            selectedChatThread={selectedChatThread}
            setSelectedChatThread={setSelectedChatThread}
            openRequestChat={openRequestChat}
            openOrderChat={openOrderChat}
            sendChatMessage={sendChatMessage}
            markChatThreadAsRead={markChatThreadAsRead}
            createPoSoFromChat={createPoSoFromChat}
            createDemoRequest={createDemoRequest}
            createPurchaseRequestFromProduct={createPurchaseRequestFromProduct}
            submitDemoOffer={submitDemoOffer}
            acceptOffer={acceptOffer}
            uploadDeliveryProof={uploadDeliveryProof}
            confirmDelivery={confirmDelivery}
            submitBuyerReview={submitBuyerReview}
            createReport={createReport}
            addSellerProduct={addSellerProduct}
            editSellerProduct={editSellerProduct}
            updateSellerProductImage={updateSellerProductImage}
            deleteSellerProduct={deleteSellerProduct}
          />
        </main>
      </div>
    </div>
  );
}

function PublicCatalog({
  products,
  searchTerm,
  categoryFilter,
  loginMode,
  onSearchChange,
  onCategoryChange,
  onLoginModeChange,
  onLogin,
  onRegister,
}: {
  products: PublicProduct[];
  searchTerm: string;
  categoryFilter: string;
  loginMode: LoginMode | null;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onLoginModeChange: (value: LoginMode | null) => void;
  onLogin: (role: Role, adminSession?: boolean, username?: string, password?: string) => void;
  onRegister: (input: RegistrationInput) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authView, setAuthView] = useState<"login" | "register">("login");
  const [registerRole, setRegisterRole] = useState<RegistrationInput["role"]>("buyer");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerDisplayName, setRegisterDisplayName] = useState("");
  const [registerProvince, setRegisterProvince] = useState("");
  const [registerOrganizationType, setRegisterOrganizationType] = useState("");
  const [publicDetailProduct, setPublicDetailProduct] = useState<PublicProduct | null>(null);

  const loginTitle = loginMode === "buyerGate" ? "เข้าสู่ระบบเพื่อส่งคำขอซื้อ" : "เข้าสู่ระบบสมาชิก";
  const authTitle = authView === "register" ? "สมัครสมาชิก FarmLink" : loginTitle;

  const authHelp =
    authView === "register"
      ? "เลือกประเภทสมาชิก กรอกข้อมูลพื้นฐาน แล้วเริ่มใช้งาน prototype ได้ทันที"
      : "กรอกชื่อผู้ใช้และรหัสผ่าน ระบบจะพาไปยังหน้าที่ตรงกับบัญชีของคุณโดยอัตโนมัติ";

  const isHiddenAdminLogin = username.trim().toLowerCase() === "useradmin" && password === "admin123";

  const loginRole: Role = "buyer";

  const openLoginModal = () => {
    setAuthView("login");
    onLoginModeChange("buyer");
  };

  const openRegisterModal = (role: RegistrationInput["role"] = "buyer") => {
    setAuthView("register");
    setRegisterRole(role);
    onLoginModeChange(role);
  };

  const handleRegistrationSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onRegister({
      role: registerRole,
      username: registerUsername,
      password: registerPassword,
      displayName: registerDisplayName,
      province: registerProvince,
      organizationType: registerOrganizationType,
    });
  };

  const categoryMenu = [
    { label: "ทั้งหมด", icon: "▦" },
    { label: "ผัก", icon: "🌿" },
    { label: "ผลไม้", icon: "♡" },
    { label: "ธัญพืช", icon: "▧" },
  ];

  return (
    <main className="min-h-screen bg-[#FAFBF8] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-[#E4EDE7] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5">
          <button onClick={() => onCategoryChange("ทั้งหมด")} className="flex items-center gap-3 text-left">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#2B7554] text-xl text-white shadow-sm">
              ♧
            </span>
            <span>
              <span className="block text-2xl font-bold tracking-tight text-[#10251B]">FarmLink</span>
              <span className="sr-only">ระบบจัดซื้อสินค้าเกษตร B2B</span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={openLoginModal}
              className="rounded-xl border border-[#D8E4DC] bg-white px-4 py-2.5 text-sm font-semibold text-[#10251B] shadow-sm transition hover:border-[#2B7554] hover:text-[#2B7554]"
            >
              เข้าสู่ระบบสมาชิก
            </button>
            <button
              onClick={() => openRegisterModal("buyer")}
              className="rounded-xl bg-[#2B7554] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1F6044]"
            >
              สมัครสมาชิก
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-10 pt-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-lg font-medium leading-relaxed text-[#4B6B5C]">
            ระบบจัดซื้อสินค้าเกษตร B2B ตรวจสอบได้ — ค้นหา เปรียบเทียบ และส่งคำขอซื้อจากผู้ผลิตโดยตรง
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-6xl">
          <label className="relative block">
            <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-[#9AA8A0]">⌕</span>
            <input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="ค้นหาสินค้า หมวดหมู่ พื้นที่ หรือมาตรฐาน เช่น ผัก เชียงใหม่ GAP"
              className="w-full rounded-2xl border border-[#DDE7E3] bg-white py-4 pl-14 pr-5 text-base text-[#254236] shadow-sm outline-none transition placeholder:text-[#799084] focus:border-[#2B7554] focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <div className="mt-5 flex flex-wrap gap-3">
            {categoryMenu.map((item) => {
              const isActive = categoryFilter === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => onCategoryChange(item.label)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold shadow-sm transition ${
                    isActive
                      ? "border-[#2B7554] bg-[#2B7554] text-white"
                      : "border-[#E1E8E3] bg-white text-[#10251B] hover:border-[#2B7554] hover:text-[#2B7554]"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10">
          {products.length === 0 ? (
            <div className="rounded-2xl border border-[#DDE7E3] bg-white p-10 text-center text-slate-500 shadow-sm">
              ยังไม่มีสินค้าที่พร้อมเสนอในขณะนี้
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  mode="public"
                  onView={setPublicDetailProduct}
                  onBuyerAction={() => onLoginModeChange("buyerGate")}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {publicDetailProduct ? (
        <ProductDetailModal
          product={publicDetailProduct}
          reviews={[]}
          onClose={() => setPublicDetailProduct(null)}
          onRequestPurchase={() => {
            setPublicDetailProduct(null);
            onLoginModeChange("buyerGate");
          }}
        />
      ) : null}

      {loginMode ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/45 px-4">
          <section className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#0F172A]">{authTitle}</h2>
                <p className="mt-2 text-sm text-slate-600">{authHelp}</p>
              </div>
              <button onClick={() => onLoginModeChange(null)} className="text-slate-400 hover:text-slate-700">
                ปิด
              </button>
            </div>

            {authView === "login" ? (
              <>
                <div className="mt-5 space-y-3">
                  <label className="block text-sm font-medium text-slate-700">
                    ชื่อผู้ใช้
                    <input
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="เช่น buyer_demo_01 หรือ seller_demo_01"
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    รหัสผ่าน
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="รหัสผ่าน"
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                    />
                  </label>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <button
                    onClick={() => onLogin(loginRole, isHiddenAdminLogin, username, password)}
                    className="rounded-md bg-[#0F8A5F] px-4 py-2 text-sm font-medium text-white"
                  >
                    เข้าสู่ระบบ
                  </button>

                  <div className="rounded-xl border border-[#DDE7E3] bg-[#F8FBF9] p-3">
                    <p className="text-sm font-semibold text-[#10251B]">ยังไม่มีบัญชี?</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => openRegisterModal("buyer")}
                        className="rounded-md border border-[#2B7554] bg-white px-3 py-2 text-sm font-medium text-[#2B7554]"
                      >
                        สมัครผู้ซื้อ
                      </button>
                      <button
                        type="button"
                        onClick={() => openRegisterModal("seller")}
                        className="rounded-md border border-[#2B7554] bg-white px-3 py-2 text-sm font-medium text-[#2B7554]"
                      >
                        สมัครผู้ขาย/เกษตรกร
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onLoginModeChange(null)}
                    className="rounded-md border border-[#DDE7E3] px-4 py-2 text-sm font-medium text-slate-700"
                  >
                    กลับไปดูสินค้า
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleRegistrationSubmit} className="mt-5 space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">ประเภทสมาชิก</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {(["buyer", "seller"] as RegistrationInput["role"][]).map((roleOption) => (
                      <button
                        key={roleOption}
                        type="button"
                        onClick={() => setRegisterRole(roleOption)}
                        className={`rounded-md border px-3 py-2 text-sm font-semibold ${
                          registerRole === roleOption
                            ? "border-[#2B7554] bg-[#2B7554] text-white"
                            : "border-[#DDE7E3] bg-white text-slate-700"
                        }`}
                      >
                        {roleOption === "buyer" ? "ผู้ซื้อ" : "ผู้ขาย/เกษตรกร"}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block text-sm font-medium text-slate-700">
                  {registerRole === "seller" ? "ชื่อฟาร์ม / กลุ่ม / ร้านค้า" : "ชื่อผู้ซื้อ / องค์กร"}
                  <input
                    value={registerDisplayName}
                    onChange={(event) => setRegisterDisplayName(event.target.value)}
                    placeholder={registerRole === "seller" ? "เช่น ไร่สุขใจ แม่ริม" : "เช่น ร้านอาหารบ้านสวน"}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-700">
                    จังหวัด
                    <input
                      value={registerProvince}
                      onChange={(event) => setRegisterProvince(event.target.value)}
                      placeholder="เช่น เชียงใหม่"
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    ประเภทองค์กร
                    <input
                      value={registerOrganizationType}
                      onChange={(event) => setRegisterOrganizationType(event.target.value)}
                      placeholder={registerRole === "seller" ? "เกษตรกร / สหกรณ์" : "ร้านอาหาร / โรงแรม"}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-700">
                    ชื่อผู้ใช้
                    <input
                      value={registerUsername}
                      onChange={(event) => setRegisterUsername(event.target.value)}
                      placeholder="ตั้งชื่อผู้ใช้"
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    รหัสผ่าน
                    <input
                      type="password"
                      value={registerPassword}
                      onChange={(event) => setRegisterPassword(event.target.value)}
                      placeholder="ตั้งรหัสผ่าน"
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                    />
                  </label>
                </div>

                {registerRole === "seller" ? (
                  <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                    ผู้ขายที่สมัครใหม่จะแสดงสถานะรอตรวจสอบ เพื่อให้ผู้ดูแลระบบอนุมัติก่อนใช้งานจริง
                  </p>
                ) : null}

                <div className="flex flex-col gap-2">
                  <button type="submit" className="rounded-md bg-[#0F8A5F] px-4 py-2 text-sm font-medium text-white">
                    สมัครและเข้าสู่ระบบ
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthView("login")}
                    className="rounded-md border border-[#DDE7E3] px-4 py-2 text-sm font-medium text-slate-700"
                  >
                    กลับไปเข้าสู่ระบบ
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      ) : null}
    </main>
  );
}


function ProductCard({
  product,
  mode,
  onBuyerAction,
  onEdit,
  onManageImages,
  onView,
  onDelete,
}: {
  product: PublicProduct;
  mode: "public" | "seller" | "admin";
  onBuyerAction?: () => void;
  onEdit?: (product: PublicProduct) => void;
  onManageImages?: (product: PublicProduct) => void;
  onView?: (product: PublicProduct) => void;
  onDelete?: (productId: string) => void;
}) {
  const remainingQuantity = getRemainingQuantity(product);
  const stockLabel = getStockStatusLabel(product);
  const performance = getSellerPerformance(product.sellerId);
  const onTimeRate = getOnTimeRate(performance);
  const trustLabel = getSellerTrustLabel(performance);
  const canSendRfq = remainingQuantity > 0;
  const transportRecommendation = recommendTransport(product.minOrderQuantity, true);
  const shippingFeeLabel = getShippingFeeLabel(product);

  if (mode === "public") {
    return (
      <article className="group overflow-hidden rounded-2xl border border-[#E1E8E3] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <button
          type="button"
          onClick={() => onView?.(product)}
          className="relative block h-64 w-full overflow-hidden bg-[#F3F7F5] text-left"
          aria-label={`ดูรายละเอียด ${product.productName}`}
        >
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.productName} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#F3F7F5] to-[#ECFDF5] text-center text-base font-medium text-slate-400">
              ยังไม่มีรูปสินค้า
            </div>
          )}

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-xl bg-white/95 px-3 py-1.5 text-xs font-bold text-[#2B7554] shadow-sm">
              {product.category}
            </span>
            <span className="rounded-xl bg-[#D1FAE5]/95 px-3 py-1.5 text-xs font-bold text-[#047857] shadow-sm">
              {canSendRfq ? "พร้อมส่ง" : "หมดชั่วคราว"}
            </span>
          </div>

          <span className="absolute right-4 top-4 rounded-xl bg-[#2B7554] px-3 py-1.5 text-xs font-bold text-white shadow-sm">
            {product.quality.split("/")[0]?.trim() || "ตรวจสอบได้"}
          </span>
        </button>

        <div className="p-5">
          <h3 className="text-xl font-bold text-[#10251B]">{product.productName}</h3>
          <p className="mt-3 flex items-center gap-2 text-sm text-[#5B6F64]">
            <span>⌖</span>
            <span>{product.area.split("/")[0]?.replace("พื้นที่:", "").trim() || product.area}</span>
          </p>

          <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-[#5B6F64]">พร้อมส่ง</p>
              <p className="mt-1 font-bold text-[#10251B]">
                {product.availableQuantity.toLocaleString("th-TH")} {product.unit}
              </p>
            </div>
            <div>
              <p className="text-[#5B6F64]">ขั้นต่ำ</p>
              <p className="mt-1 font-bold text-[#10251B]">
                {product.minOrderQuantity.toLocaleString("th-TH")} {product.unit}
              </p>
            </div>
            <div>
              <p className="text-[#5B6F64]">ราคา</p>
              <p className="mt-1 font-bold text-[#0F8A5F]">{product.priceRange.replace("ช่วงราคา:", "").trim()}</p>
            </div>
          </div>

          <p className="mt-5 flex items-center gap-2 text-sm text-[#5B6F64]">
            <span>▣</span>
            <span>{product.availableDate.replace("พร้อมส่ง", "พร้อมส่ง")}</span>
          </p>

          <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
            <button
              type="button"
              onClick={canSendRfq ? onBuyerAction : undefined}
              disabled={!canSendRfq}
              className={`rounded-xl px-4 py-3 text-sm font-bold text-white shadow-sm transition ${
                canSendRfq ? "bg-[#2B7554] hover:bg-[#1F5E43]" : "cursor-not-allowed bg-slate-300"
              }`}
            >
              🛒 {canSendRfq ? "คำขอซื้อ" : "หมดสต็อก"}
            </button>
            <button
              type="button"
              onClick={() => onView?.(product)}
              className="flex h-12 w-14 items-center justify-center rounded-xl border border-[#DDE7E3] bg-white text-2xl font-bold leading-none text-[#2B7554] hover:bg-[#F3F7F5]"
              aria-label={`ดูข้อมูลเพิ่มเติมของ ${product.productName}`}
              title="ดูข้อมูลเพิ่มเติม"
            >
              ...
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="overflow-hidden rounded-lg border border-[#DDE7E3] bg-white shadow-sm">
      <button
        type="button"
        onClick={() => (mode === "seller" ? onManageImages?.(product) : onView?.(product))}
        className="flex h-36 w-full items-center justify-center bg-[#F3F7F5] text-left"
      >
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.productName} className="h-full w-full object-cover" />
        ) : (
          <div className="text-center text-sm text-slate-400">
            <p>ยังไม่มีรูปสินค้า</p>
            {mode === "seller" ? <p className="mt-1 text-xs">กดจัดการรูปภาพเพื่ออัปโหลดรูป</p> : null}
          </div>
        )}
      </button>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-[#06603F]">{product.category}</p>
            <h3 className="mt-1 text-xl font-bold text-[#0F172A]">{product.productName}</h3>
          </div>
          <div className="flex flex-col items-end gap-1">
            <StatusBadge value={product.status === "active" ? "พร้อมเสนอ" : product.status} />
            {product.isDemo ? <span className="text-xs text-slate-400">สินค้าตัวอย่าง</span> : null}
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <p>พื้นที่: {product.area}</p>
          <p>{product.quantityText}</p>
          <p>มาตรฐาน: {product.quality}</p>
          <p>ช่วงราคา: {product.priceRange}</p>
          <p>{product.availableDate}</p>
        </div>

        <div className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-slate-700">
          <p className="font-bold text-[#0F172A]">ปริมาณพร้อมเสนอ: {product.availableQuantity.toLocaleString("th-TH")} {product.unit}</p>
          <p>คงเหลือประมาณ: {remainingQuantity.toLocaleString("th-TH")} {product.unit}</p>
          <p>ขั้นต่ำต่อคำขอซื้อ: {product.minOrderQuantity.toLocaleString("th-TH")} {product.unit}</p>
          <span className={`mt-2 inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${
            canSendRfq ? "bg-[#D1FAE5] text-[#06603F]" : "bg-red-100 text-red-700"
          }`}>
            {stockLabel}
          </span>
        </div>

        <div className="mt-4 rounded-md bg-[#ECFDF5] p-3 text-sm text-slate-700">
          <p className="font-bold text-[#0F172A]">ขนส่ง: {getProductTransportSummary(product)}</p>
          <p>คำแนะนำ: {transportRecommendation.label}</p>
          <p>ค่าขนส่ง: {shippingFeeLabel}</p>
          {product.minOrderQuantity <= (product.parcelMaxWeightKg ?? DEFAULT_PARCEL_MAX_WEIGHT_KG) ? (
            <p className="mt-1 text-xs text-[#06603F]">
              สินค้าขนาดเล็กไม่เกิน {(product.parcelMaxWeightKg ?? DEFAULT_PARCEL_MAX_WEIGHT_KG).toLocaleString("th-TH")} {product.unit} แนะนำ {product.parcelCarrierName || "ไปรษณีย์ไทย"} และเคลมได้ตามเงื่อนไขผู้ให้บริการ
            </p>
          ) : (
            <p className="mt-1 text-xs text-amber-700">
              เกิน 25 {product.unit} ไม่แนะนำพัสดุทั่วไปเป็นค่าเริ่มต้น ควรพิจารณารถผู้ขาย รถรับจ้าง หรือ bulk logistics
            </p>
          )}
        </div>

        <div className="mt-4 rounded-md bg-blue-50 p-3 text-sm text-slate-700">
          <p className="font-bold text-[#0F172A]">ประวัติผู้ขาย:</p>
          {performance ? (
            <>
              <p>ส่งมอบสำเร็จ: {performance.completedOrders} ครั้ง</p>
              <p>ส่งตรงเวลา: {onTimeRate ?? "-"}%</p>
              <p>คะแนนคุณภาพ: {performance.averageQualityRating}/5</p>
              {performance.disputeCount > 0 ? <p className="text-red-600">ข้อพิพาท: {performance.disputeCount}</p> : null}
              <span className="mt-2 inline-flex rounded-md bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                {trustLabel}
              </span>
            </>
          ) : (
            <p>ยังไม่มีประวัติส่งมอบในระบบ</p>
          )}
        </div>

        {mode === "seller" ? (
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onEdit?.(product)}
              className="rounded-md border border-[#DDE7E3] px-3 py-2 text-sm font-medium text-slate-700 hover:bg-[#F3F7F5]"
            >
              แก้ไข
            </button>
            <button
              type="button"
              onClick={() => onManageImages?.(product)}
              className="rounded-md border border-[#DDE7E3] px-3 py-2 text-sm font-medium text-slate-700 hover:bg-[#F3F7F5]"
            >
              จัดการรูปภาพ
            </button>
            <button
              type="button"
              onClick={() => onView?.(product)}
              className="rounded-md border border-[#DDE7E3] px-3 py-2 text-sm font-medium text-slate-700 hover:bg-[#F3F7F5]"
            >
              ดูรายละเอียด
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(product.id)}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              ลบ
            </button>
          </div>
        ) : (
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => onView?.(product)}
              className="flex-1 rounded-md border border-[#DDE7E3] px-3 py-2 text-sm font-medium text-slate-700 hover:bg-[#F3F7F5]"
            >
              ดูรายละเอียด
            </button>
            <button
              type="button"
              onClick={canSendRfq ? onBuyerAction : undefined}
              disabled={!canSendRfq}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium text-white ${
                canSendRfq ? "bg-slate-950 hover:bg-slate-800" : "cursor-not-allowed bg-slate-300"
              }`}
            >
              {canSendRfq ? "คำขอซื้อ" : "หมดสต็อก"}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function RoleContent({
  currentUser,
  role,
  activeMenu,
  products,
  requests,
  offers,
  orders,
  reviews,
  chatThreads,
  chatMessages,
  risks,
  auditLogs,
  selectedChatThread,
  setSelectedChatThread,
  openRequestChat,
  openOrderChat,
  sendChatMessage,
  markChatThreadAsRead,
  createPoSoFromChat,
  createDemoRequest,
  createPurchaseRequestFromProduct,
  submitDemoOffer,
  acceptOffer,
  uploadDeliveryProof,
  confirmDelivery,
  submitBuyerReview,
  createReport,
  addSellerProduct,
  editSellerProduct,
  updateSellerProductImage,
  deleteSellerProduct,
}: {
  currentUser: User;
  role: Role;
  activeMenu: string;
  products: PublicProduct[];
  requests: PurchaseRequest[];
  offers: Offer[];
  orders: Order[];
  reviews: BuyerReview[];
  chatThreads: ChatThread[];
  chatMessages: ChatMessage[];
  risks: RiskAlert[];
  auditLogs: AuditLog[];
  selectedChatThread: ChatThread | null;
  setSelectedChatThread: (thread: ChatThread | null) => void;
  openRequestChat: (request: PurchaseRequest) => void;
  openOrderChat: (order: Order) => void;
  sendChatMessage: (thread: ChatThread, message: string) => void;
  markChatThreadAsRead: (threadId: string) => void;
  createPoSoFromChat: (
    thread: ChatThread,
    request?: PurchaseRequest
  ) => { poId: string; soId: string; created: boolean } | null;
  createDemoRequest: () => void;
  createPurchaseRequestFromProduct: (product: PublicProduct, form: PurchaseRequestFormState) => void;
  submitDemoOffer: (requestId: string) => void;
  acceptOffer: (offer: Offer) => void;
  uploadDeliveryProof: () => void;
  confirmDelivery: (orderId: string) => void;
  submitBuyerReview: (order: Order, form: ReviewFormState) => void;
  createReport: () => void;
  addSellerProduct: (form: ProductFormState) => void;
  editSellerProduct: (productId: string, form: ProductFormState) => void;
  updateSellerProductImage: (productId: string, imageUrl?: string) => void;
  deleteSellerProduct: (productId: string) => void;
}) {
  const myBuyerRequests = requests.filter((item) => item.buyerId === currentUser.id);
  const myBuyerOffers = offers.filter((item) => item.buyerId === currentUser.id);
  const myBuyerOrders = orders.filter((item) => item.buyerId === currentUser.id);

  const mySellerProducts = products.filter((item) => item.sellerId === currentUser.id);
  const mySellerOffers = offers.filter((item) => item.sellerId === currentUser.id);
  const mySellerOrders = orders.filter((item) => item.sellerId === currentUser.id);
  const myChatThreads = chatThreads.filter((thread) =>
    role === "buyer" ? thread.buyerId === currentUser.id : role === "seller" ? thread.sellerId === currentUser.id : true
  );
  const getTransactionStatusFromWorkflow = (steps: WorkflowStep[], fallbackStatus?: string) => {
    const isCompleted = (key: WorkflowStepKey) => steps.some((step) => step.key === key && step.status === "completed");
    const currentStep = getCurrentWorkflowStep(steps);

    if (isCompleted("closed")) return "ปิดธุรกรรม";
    if (isCompleted("review_completed")) return "รีวิวแล้ว";
    if (isCompleted("seller_confirmed_payment")) return "รับเงินแล้ว";
    if (isCompleted("payment_proof_uploaded")) return "รอผู้ขายยืนยันรับเงิน";
    if (isCompleted("buyer_confirmed_delivery")) return "รอหลักฐานชำระเงิน";
    if (isCompleted("delivery_proof_uploaded")) return "รอผู้ซื้อยืนยันรับสินค้า";
    if (isCompleted("delivery_in_progress")) return "อยู่ระหว่างส่งมอบ";
    if (isCompleted("order_created")) return "สร้าง PO/SO แล้ว";
    if (isCompleted("buyer_accepted")) return "ผู้ซื้อยืนยันข้อเสนอ";
    if (isCompleted("offer_sent")) return "รอผู้ซื้อยืนยันข้อเสนอ";
    if (isCompleted("seller_replied")) return "กำลังตกลงเงื่อนไข";
    if (currentStep?.key === "chat_opened") return "เปิดแชทแล้ว";

    return fallbackStatus || "เปิดรับข้อเสนอ";
  };

  const getRequestStatusFromChat = (request: PurchaseRequest) => {
    const thread = chatThreads.find((item) => item.rfqId === request.id);
    const relatedOrder = orders.find((order) => order.requestId === request.id);

    if (!thread && !relatedOrder) return request.status;

    const threadMessages = thread ? chatMessages.filter((message) => message.threadId === thread.id) : [];
    const steps = getWorkflowStepsForChat({
      thread:
        thread ||
        ({
          id: `history-${request.id}`,
          threadType: "rfq",
          rfqId: request.id,
          productId: request.productId,
          buyerId: request.buyerId,
          sellerId: request.sellerId || "",
          status: "closed",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as ChatThread),
      relatedRequest: request,
      relatedOrder,
      messages: threadMessages,
    });

    return getTransactionStatusFromWorkflow(steps, request.status);
  };

  const getOrderStatusFromChat = (order: Order) => {
    const thread = chatThreads.find((item) => item.orderId === order.id || item.rfqId === order.requestId);
    if (!thread) return order.status;

    const relatedRequest = requests.find((request) => request.id === order.requestId);
    const threadMessages = chatMessages.filter((message) => message.threadId === thread.id);
    const steps = getWorkflowStepsForChat({
      thread,
      relatedRequest,
      relatedOrder: order,
      messages: threadMessages,
    });

    return getTransactionStatusFromWorkflow(steps, order.status);
  };

  const extractTradeDocumentIdsFromChat = (thread: ChatThread) => {
    const threadMessages = chatMessages.filter((message) => message.threadId === thread.id);
    const fullText = threadMessages.map((message) => message.message).join("\n");
    const poId = thread.orderId || fullText.match(/PO-\d{4}-\d{4}/)?.[0];
    const soId = fullText.match(/SO-\d{4}-\d{4}/)?.[0] || poId?.replace("PO-", "SO-");

    return { poId, soId };
  };

  const inferPriceForHistoryOrder = (request?: PurchaseRequest, thread?: ChatThread) => {
    const threadMessages = thread ? chatMessages.filter((message) => message.threadId === thread.id) : [];
    const latestOfferText = [...threadMessages]
      .reverse()
      .find((message) => message.message.includes("ราคาเสนอ"))?.message;

    const priceText = latestOfferText || request?.targetPrice || "";
    const firstPriceMatch = priceText.match(/\d+(?:\.\d+)?/);

    return firstPriceMatch ? Number(firstPriceMatch[0]) : 0;
  };

  const createHistoryOrderFromChatThread = (thread: ChatThread): Order | null => {
    const { poId, soId } = extractTradeDocumentIdsFromChat(thread);
    if (!poId) return null;

    const relatedRequest = requests.find((request) => request.id === thread.rfqId);
    const existingOrder = orders.find((order) => order.id === poId || order.requestId === thread.rfqId);

    if (existingOrder) {
      return {
        ...existingOrder,
        salesOrderId: existingOrder.salesOrderId || soId,
        status: getOrderStatusFromChat(existingOrder),
      };
    }

    const buyerId = thread.buyerId || relatedRequest?.buyerId || "";
    const sellerId = thread.sellerId || relatedRequest?.sellerId || "";
    const buyerName = demoUsers.find((user) => user.id === buyerId)?.displayName || "ผู้ซื้อ";
    const sellerName = demoUsers.find((user) => user.id === sellerId)?.displayName || "ผู้ขาย/เกษตรกร";

    const syntheticOrder: Order = {
      id: poId,
      salesOrderId: soId,
      requestId: relatedRequest?.id || thread.rfqId || poId,
      salesOfferId: relatedRequest ? `OFF-${relatedRequest.id}` : undefined,
      buyerId,
      sellerId,
      productName: relatedRequest?.productName || "รายการจากแชทการจัดซื้อ",
      buyerName,
      sellerName,
      quantity: relatedRequest?.quantity || 0,
      price: inferPriceForHistoryOrder(relatedRequest, thread),
      deliveryDate: relatedRequest?.deliveryDate || "-",
      status: "สร้าง PO/SO แล้ว",
      proofStatus: "บันทึกจากแชทการจัดซื้อ",
    };

    return {
      ...syntheticOrder,
      status: getOrderStatusFromChat(syntheticOrder),
    };
  };

  const mergeUniqueOrders = (baseOrders: Order[], derivedOrders: Order[]) => {
    const orderMap = new Map<string, Order>();

    [...baseOrders, ...derivedOrders].forEach((order) => {
      const key = order.id || order.requestId;
      if (!orderMap.has(key)) {
        orderMap.set(key, order);
        return;
      }

      const existing = orderMap.get(key);
      if (existing && existing.status !== order.status) {
        orderMap.set(key, {
          ...existing,
          ...order,
        });
      }
    });

    return Array.from(orderMap.values());
  };

  const chatDerivedOrdersForCurrentUser = myChatThreads
    .map((thread) => createHistoryOrderFromChatThread(thread))
    .filter((order): order is Order => Boolean(order));

  const myBuyerRequestsForHistory = myBuyerRequests.map((request) => ({
    ...request,
    status: getRequestStatusFromChat(request),
  }));

  const myBuyerOrdersForHistory = mergeUniqueOrders(
    myBuyerOrders.map((order) => ({
      ...order,
      status: getOrderStatusFromChat(order),
    })),
    chatDerivedOrdersForCurrentUser.filter((order) => order.buyerId === currentUser.id)
  );

  const mySellerOrdersForHistory = mergeUniqueOrders(
    mySellerOrders.map((order) => ({
      ...order,
      status: getOrderStatusFromChat(order),
    })),
    chatDerivedOrdersForCurrentUser.filter((order) => order.sellerId === currentUser.id)
  );
  const flaggedChatThreads = chatThreads.filter((thread) => thread.status === "flagged");
  const [buyerDetailProduct, setBuyerDetailProduct] = useState<PublicProduct | null>(null);
  const [selectedRequestProduct, setSelectedRequestProduct] = useState<PublicProduct | null>(null);
  const [selectedReviewOrder, setSelectedReviewOrder] = useState<Order | null>(null);

  if (role === "buyer") {
    if (activeMenu === "ค้นหาสินค้า") {
      const marketplaceProducts = products.filter((item) => item.status === "active");

      return (
        <>
          <SectionCard title="ค้นหาสินค้าเกษตรที่พร้อมเสนอ">
            {marketplaceProducts.length === 0 ? (
              <EmptyHint text="ยังไม่มีสินค้าที่พร้อมเสนอในขณะนี้" />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {marketplaceProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    mode="public"
                    onView={setBuyerDetailProduct}
                    onBuyerAction={() => setSelectedRequestProduct(product)}
                  />
                ))}
              </div>
            )}
          </SectionCard>

          {buyerDetailProduct ? (
            <ProductDetailModal
              product={buyerDetailProduct}
              reviews={reviews}
              onClose={() => setBuyerDetailProduct(null)}
              onRequestPurchase={(product) => {
                setBuyerDetailProduct(null);
                setSelectedRequestProduct(product);
              }}
            />
          ) : null}

          {selectedRequestProduct ? (
            <PurchaseRequestModal
              product={selectedRequestProduct}
              buyerProvince={currentUser.province || ""}
              onClose={() => setSelectedRequestProduct(null)}
              onSubmit={(form) => {
                createPurchaseRequestFromProduct(selectedRequestProduct, form);
                setSelectedRequestProduct(null);
              }}
            />
          ) : null}
        </>
      );
    }

    if (activeMenu === "สร้างคำขอซื้อ") {
      return (
        <SectionCard
          title="สร้างคำขอซื้อใหม่"
          action={
            <button
              onClick={createDemoRequest}
              className="rounded-md bg-[#0F8A5F] px-4 py-2 text-sm font-medium text-white"
            >
              สร้างคำขอซื้อ demo
            </button>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "ชื่อสินค้า: พริกหวาน",
              "ปริมาณ: 250 กก.",
              "คุณภาพ: คัดเกรด สีสม่ำเสมอ",
              "พื้นที่รับสินค้า: โรงพยาบาลชุมชนแม่ริม",
              "วันที่ต้องการรับสินค้า: 22 มิ.ย. 2026",
              "ช่วงราคา: 45-55 บาท/กก.",
            ].map((item) => (
              <div key={item} className="rounded-md border border-[#DDE7E3] bg-[#F3F7F5] p-4 text-sm">
                {item}
              </div>
            ))}
          </div>
        </SectionCard>
      );
    }

    if (activeMenu === "คำขอซื้อของฉัน") {
      return (
        <>
          <RequestsTable requests={myBuyerRequests} title="คำขอซื้อของฉัน" onOpenChat={openRequestChat} />

          {selectedChatThread ? (
            <ChatModal
              thread={selectedChatThread}
              currentUser={currentUser}
              messages={chatMessages.filter((message) => message.threadId === selectedChatThread.id)}
              relatedRequest={requests.find((request) => request.id === selectedChatThread.rfqId)}
              relatedOrder={orders.find((order) => order.id === selectedChatThread.orderId)}
              onSend={(message, options) => sendChatMessage(selectedChatThread, message, options)}
              onMarkRead={markChatThreadAsRead}
              onCreatePoSo={createPoSoFromChat}
              reviews={reviews}
              onSubmitChatReview={(order, form) => submitBuyerReview(order, form)}
              onClose={() => setSelectedChatThread(null)}
            />
          ) : null}
        </>
      );
    }

    if (activeMenu === "แชทการจัดซื้อ" || activeMenu === "ข้อความการจัดซื้อ") {
      return (
        <>
          <ChatThreadList
            title="แชทการจัดซื้อ"
            threads={myChatThreads}
            messages={chatMessages}
            currentUser={currentUser}
            requests={requests}
            orders={orders}
            onOpen={setSelectedChatThread}
          />

          {selectedChatThread ? (
            <ChatModal
              thread={selectedChatThread}
              currentUser={currentUser}
              messages={chatMessages.filter((message) => message.threadId === selectedChatThread.id)}
              relatedRequest={requests.find((request) => request.id === selectedChatThread.rfqId)}
              relatedOrder={orders.find((order) => order.id === selectedChatThread.orderId)}
              onSend={(message, options) => sendChatMessage(selectedChatThread, message, options)}
              onMarkRead={markChatThreadAsRead}
              onCreatePoSo={createPoSoFromChat}
              reviews={reviews}
              onSubmitChatReview={(order, form) => submitBuyerReview(order, form)}
              onClose={() => setSelectedChatThread(null)}
            />
          ) : null}
        </>
      );
    }

    if (activeMenu === "ข้อเสนอขาย") {
      return <OfferComparison offers={myBuyerOffers} acceptOffer={acceptOffer} />;
    }

    if (activeMenu === "ดีล / คำสั่งซื้อของฉัน" || activeMenu === "คำสั่งซื้อของฉัน") {
      return (
        <>
          <OrdersTable
            orders={myBuyerOrders}
            confirmDelivery={confirmDelivery}
            currentUser={currentUser}
            reviews={reviews}
            onReviewOrder={setSelectedReviewOrder}
            onOpenChat={openOrderChat}
          />

          {selectedChatThread ? (
            <ChatModal
              thread={selectedChatThread}
              currentUser={currentUser}
              messages={chatMessages.filter((message) => message.threadId === selectedChatThread.id)}
              relatedRequest={requests.find((request) => request.id === selectedChatThread.rfqId)}
              relatedOrder={orders.find((order) => order.id === selectedChatThread.orderId)}
              onSend={(message, options) => sendChatMessage(selectedChatThread, message, options)}
              onMarkRead={markChatThreadAsRead}
              onCreatePoSo={createPoSoFromChat}
              reviews={reviews}
              onSubmitChatReview={(order, form) => submitBuyerReview(order, form)}
              onClose={() => setSelectedChatThread(null)}
            />
          ) : null}

          {selectedReviewOrder ? (
            <ReviewModal
              order={selectedReviewOrder}
              onClose={() => setSelectedReviewOrder(null)}
              onSubmit={(form) => {
                submitBuyerReview(selectedReviewOrder, form);
                setSelectedReviewOrder(null);
              }}
            />
          ) : null}
        </>
      );
    }

    if (activeMenu === "ประวัติธุรกรรม") {
      return (
        <>
          <RequestsTable requests={myBuyerRequestsForHistory} title="ประวัติคำขอซื้อของฉัน" />
          <OrdersTable
            orders={myBuyerOrdersForHistory}
            currentUser={currentUser}
            reviews={reviews}
            onReviewOrder={setSelectedReviewOrder}
          />
        </>
      );
    }

    return (
      <>
        <SectionCard title="แดชบอร์ดผู้ซื้อแบบ Chat-first">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] p-4">
              <p className="font-bold text-emerald-900">1. ค้นหาสินค้า</p>
              <p className="mt-2 text-sm text-emerald-800">
                เลือกสินค้าแล้วกด “คำขอซื้อ” ระบบจะเปิดห้องแชทและพาเดินตามขั้นตอน
              </p>
            </div>
            <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
              <p className="font-bold text-sky-900">2. ทำรายการในแชท</p>
              <p className="mt-2 text-sm text-sky-800">
                ยืนยันเงื่อนไข ขอแก้ไขข้อเสนอ สร้าง PO/SO ส่งมอบ และชำระเงินผ่าน Action Card ในแชท
              </p>
            </div>
            <div className="rounded-lg border border-[#DDE7E3] bg-[#F3F7F5] p-4">
              <p className="font-bold text-slate-900">3. ดูย้อนหลังในประวัติ</p>
              <p className="mt-2 text-sm text-slate-600">
                คำขอซื้อ ข้อเสนอ PO/SO คำสั่งซื้อ และหลักฐานทั้งหมดถูกเก็บไว้ในประวัติธุรกรรม
              </p>
            </div>
          </div>
        </SectionCard>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title="ห้องแชทการจัดซื้อ" value={myChatThreads.length} detail="ใช้เป็นศูนย์กลางการทำธุรกรรม" />
          <StatCard title="คำขอซื้อของฉัน" value={myBuyerRequests.length} />
          <StatCard title="ดีล / คำสั่งซื้อ" value={myBuyerOrders.length} />
        </div>

        <ChatThreadList
          title="แชทการจัดซื้อล่าสุด"
          threads={myChatThreads.slice(0, 3)}
          messages={chatMessages}
          currentUser={currentUser}
          requests={requests}
          orders={orders}
          onOpen={setSelectedChatThread}
        />

        {selectedChatThread ? (
          <ChatModal
            thread={selectedChatThread}
            currentUser={currentUser}
            messages={chatMessages.filter((message) => message.threadId === selectedChatThread.id)}
            relatedRequest={requests.find((request) => request.id === selectedChatThread.rfqId)}
            relatedOrder={orders.find((order) => order.id === selectedChatThread.orderId)}
            onSend={(message, options) => sendChatMessage(selectedChatThread, message, options)}
            onMarkRead={markChatThreadAsRead}
            onCreatePoSo={createPoSoFromChat}
              reviews={reviews}
              onSubmitChatReview={(order, form) => submitBuyerReview(order, form)}
            onClose={() => setSelectedChatThread(null)}
          />
        ) : null}
      </>
    );
  }

  if (role === "seller") {
    if (activeMenu === "ข้อมูลของฉัน" || activeMenu === "ข้อมูลผู้ขาย/ฟาร์ม") {
      return (
        <SectionCard title="ข้อมูลของฉัน">
          <UserProfile currentUser={currentUser} />
        </SectionCard>
      );
    }

    if (activeMenu === "สินค้าของฉัน") {
      return (
        <SellerProductsSection
          products={mySellerProducts}
          reviews={reviews}
          onAddProduct={addSellerProduct}
          onEditProduct={editSellerProduct}
          onUpdateImage={updateSellerProductImage}
          onDeleteProduct={deleteSellerProduct}
        />
      );
    }

    if (activeMenu === "คำขอซื้อที่ได้รับ" || activeMenu === "ประกาศรับซื้อ") {
      const sellerRequests = requests.filter((request) => !request.sellerId || request.sellerId === currentUser.id);
      return (
        <>
          <SellerAnnouncements requests={sellerRequests} submitDemoOffer={submitDemoOffer} onOpenChat={openRequestChat} />

          {selectedChatThread ? (
            <ChatModal
              thread={selectedChatThread}
              currentUser={currentUser}
              messages={chatMessages.filter((message) => message.threadId === selectedChatThread.id)}
              relatedRequest={requests.find((request) => request.id === selectedChatThread.rfqId)}
              relatedOrder={orders.find((order) => order.id === selectedChatThread.orderId)}
              onSend={(message, options) => sendChatMessage(selectedChatThread, message, options)}
              onMarkRead={markChatThreadAsRead}
              onCreatePoSo={createPoSoFromChat}
              reviews={reviews}
              onSubmitChatReview={(order, form) => submitBuyerReview(order, form)}
              onClose={() => setSelectedChatThread(null)}
            />
          ) : null}
        </>
      );
    }

    if (activeMenu === "แชทจากผู้ซื้อ" || activeMenu === "ข้อความจากผู้ซื้อ") {
      return (
        <>
          <ChatThreadList
            title="แชทจากผู้ซื้อ"
            threads={myChatThreads}
            messages={chatMessages}
            currentUser={currentUser}
            requests={requests}
            orders={orders}
            onOpen={setSelectedChatThread}
          />

          {selectedChatThread ? (
            <ChatModal
              thread={selectedChatThread}
              currentUser={currentUser}
              messages={chatMessages.filter((message) => message.threadId === selectedChatThread.id)}
              relatedRequest={requests.find((request) => request.id === selectedChatThread.rfqId)}
              relatedOrder={orders.find((order) => order.id === selectedChatThread.orderId)}
              onSend={(message, options) => sendChatMessage(selectedChatThread, message, options)}
              onMarkRead={markChatThreadAsRead}
              onCreatePoSo={createPoSoFromChat}
              reviews={reviews}
              onSubmitChatReview={(order, form) => submitBuyerReview(order, form)}
              onClose={() => setSelectedChatThread(null)}
            />
          ) : null}
        </>
      );
    }

    if (activeMenu === "ข้อเสนอขายของฉัน") {
      return (
        <>
          <SellerOffersTable
            offers={mySellerOffers}
            requests={requests}
            onOpenChat={(request) => openRequestChat(request)}
          />

          {selectedChatThread ? (
            <ChatModal
              thread={selectedChatThread}
              currentUser={currentUser}
              messages={chatMessages.filter((message) => message.threadId === selectedChatThread.id)}
              relatedRequest={requests.find((request) => request.id === selectedChatThread.rfqId)}
              relatedOrder={orders.find((order) => order.id === selectedChatThread.orderId)}
              onSend={(message, options) => sendChatMessage(selectedChatThread, message, options)}
              onMarkRead={markChatThreadAsRead}
              onCreatePoSo={createPoSoFromChat}
              reviews={reviews}
              onSubmitChatReview={(order, form) => submitBuyerReview(order, form)}
              onClose={() => setSelectedChatThread(null)}
            />
          ) : null}
        </>
      );
    }

    if (activeMenu === "ดีล / คำสั่งซื้อของฉัน" || activeMenu === "คำสั่งซื้อของฉัน") {
      return (
        <>
          <OrdersTable orders={mySellerOrders} onOpenChat={openOrderChat} />

          {selectedChatThread ? (
            <ChatModal
              thread={selectedChatThread}
              currentUser={currentUser}
              messages={chatMessages.filter((message) => message.threadId === selectedChatThread.id)}
              relatedRequest={requests.find((request) => request.id === selectedChatThread.rfqId)}
              relatedOrder={orders.find((order) => order.id === selectedChatThread.orderId)}
              onSend={(message, options) => sendChatMessage(selectedChatThread, message, options)}
              onMarkRead={markChatThreadAsRead}
              onCreatePoSo={createPoSoFromChat}
              reviews={reviews}
              onSubmitChatReview={(order, form) => submitBuyerReview(order, form)}
              onClose={() => setSelectedChatThread(null)}
            />
          ) : null}
        </>
      );
    }

    if (activeMenu === "หลักฐานการส่งมอบ") {
      return (
        <SectionCard
          title="หลักฐานการส่งมอบ"
          action={
            <button
              onClick={uploadDeliveryProof}
              className="rounded-md bg-[#0F8A5F] px-4 py-2 text-sm font-medium text-white"
            >
              อัปโหลดหลักฐาน demo
            </button>
          }
        >
          {mySellerOrders.length === 0 ? (
            <EmptyHint text="ยังไม่มีคำสั่งซื้อที่ต้องส่งหลักฐาน" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-md border border-[#DDE7E3] p-4">
                <p className="font-bold">คำสั่งซื้อที่เกี่ยวข้อง</p>
                <p className="text-slate-600">{mySellerOrders[0].id}</p>
              </div>
              <div className="rounded-md border border-[#DDE7E3] p-4">
                <p className="font-bold">เอกสารประกอบ</p>
                <p className="text-slate-600">รูปสินค้า, ใบน้ำหนัก, สถานที่, เวลา</p>
              </div>
            </div>
          )}
        </SectionCard>
      );
    }

    if (activeMenu === "ประวัติธุรกรรม") {
      return (
        <>
          <SellerOffersTable offers={mySellerOffers} />
          <OrdersTable orders={mySellerOrdersForHistory} />
        </>
      );
    }

    return (
      <>
        <SectionCard title="แดชบอร์ดผู้ขายแบบ Chat-first">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] p-4">
              <p className="font-bold text-emerald-900">1. จัดการสินค้า</p>
              <p className="mt-2 text-sm text-emerald-800">
                เพิ่มสินค้า รูปภาพ stock ราคา และเงื่อนไขขนส่งในเมนู “สินค้าของฉัน”
              </p>
            </div>
            <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
              <p className="font-bold text-sky-900">2. ตอบผู้ซื้อในแชท</p>
              <p className="mt-2 text-sm text-sky-800">
                เมื่อลูกค้าส่งคำขอซื้อ ระบบจะเปิดห้องแชทและแสดง Action Card ให้ตอบเงื่อนไข ส่งข้อเสนอ และสร้าง PO/SO
              </p>
            </div>
            <div className="rounded-lg border border-[#DDE7E3] bg-[#F3F7F5] p-4">
              <p className="font-bold text-slate-900">3. ดูย้อนหลังในประวัติ</p>
              <p className="mt-2 text-sm text-slate-600">
                ข้อเสนอ PO/SO คำสั่งซื้อ หลักฐานส่งมอบ และการชำระเงินถูกเก็บไว้ในประวัติธุรกรรม
              </p>
            </div>
          </div>
        </SectionCard>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard title="สินค้าของฉัน" value={mySellerProducts.length} detail="เฉพาะ sellerId ของฉัน" />
          <StatCard title="แชทจากผู้ซื้อ" value={myChatThreads.length} detail="ใช้เป็นศูนย์กลางการทำธุรกรรม" />
          <StatCard title="ดีล / คำสั่งซื้อ" value={mySellerOrders.length} />
          <StatCard title="คะแนนความน่าเชื่อถือ" value="86" detail={currentUser.verificationStatus || "รอตรวจสอบ"} />
        </div>

        <ChatThreadList
          title="แชทจากผู้ซื้อล่าสุด"
          threads={myChatThreads.slice(0, 3)}
          messages={chatMessages}
          currentUser={currentUser}
          requests={requests}
          orders={orders}
          onOpen={setSelectedChatThread}
        />

        {selectedChatThread ? (
          <ChatModal
            thread={selectedChatThread}
            currentUser={currentUser}
            messages={chatMessages.filter((message) => message.threadId === selectedChatThread.id)}
            relatedRequest={requests.find((request) => request.id === selectedChatThread.rfqId)}
            relatedOrder={orders.find((order) => order.id === selectedChatThread.orderId)}
            onSend={(message, options) => sendChatMessage(selectedChatThread, message, options)}
            onMarkRead={markChatThreadAsRead}
            onCreatePoSo={createPoSoFromChat}
              reviews={reviews}
              onSubmitChatReview={(order, form) => submitBuyerReview(order, form)}
            onClose={() => setSelectedChatThread(null)}
          />
        ) : null}
      </>
    );
  }

  if (activeMenu === "ตรวจสอบผู้ใช้") {
    return (
      <SectionCard title="ตรวจสอบผู้ใช้">
        <div className="grid gap-4 md:grid-cols-3">
          {["ผู้ซื้อที่ผ่านการยืนยัน", "ผู้ขายที่ผ่านการยืนยัน", "บัญชีที่ควรตรวจสอบเพิ่มเติม"].map((item) => (
            <div key={item} className="rounded-lg border border-[#DDE7E3] bg-[#F3F7F5] p-4">
              <p className="font-bold text-[#0F172A]">{item}</p>
              <p className="mt-2 text-sm text-slate-500">
                ใช้สำหรับตรวจสอบตัวตน สถานะความน่าเชื่อถือ และประวัติธุรกรรมของผู้ใช้
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    );
  }

  if (activeMenu === "ตั้งค่า Workflow") {
    return (
      <SectionCard title="ตั้งค่า Workflow">
        <div className="space-y-3">
          {[
            "ส่งคำขอซื้อ",
            "เปิดแชทการจัดซื้อ",
            "ผู้ขายส่งข้อเสนอขาย",
            "ผู้ซื้อยืนยันข้อเสนอ",
            "สร้างคำสั่งซื้อ",
            "ส่งมอบสินค้า",
            "ยืนยันรับสินค้า",
            "อัปโหลดหลักฐานชำระเงิน",
            "ผู้ขายยืนยันได้รับเงิน",
            "ผู้ซื้อรีวิวสินค้าและผู้ขาย",
            "ปิดธุรกรรม",
          ].map((item, index) => (
            <div key={item} className="flex items-center gap-3 rounded-md border border-[#DDE7E3] bg-[#F3F7F5] p-3 text-sm">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F8A5F] text-xs font-bold text-white">
                {index + 1}
              </span>
              <span className="font-medium text-slate-800">{item}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-md bg-amber-50 p-4 text-sm text-amber-800">
          ขั้นตอนเหล่านี้จะแสดงเป็น Agentic-guided workflow ในแชท เพื่อให้ผู้ซื้อและผู้ขายทำตามขั้นตอนเดียวกัน
        </p>
      </SectionCard>
    );
  }

  if (activeMenu === "ตรวจสอบสินค้า") {
    return (
      <SectionCard title="ตรวจสอบสินค้า">
        {products.length === 0 ? (
          <EmptyHint text="ยังไม่มีรายการสินค้าในระบบ" />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} mode="admin" />
            ))}
          </div>
        )}
      </SectionCard>
    );
  }

  if (activeMenu === "คำขอซื้อทั้งหมด") {
    return <RequestsTable requests={requests} title="คำขอซื้อทั้งหมด" />;
  }

  if (activeMenu === "ข้อเสนอขายทั้งหมด") {
    return <OfferComparison offers={offers} acceptOffer={acceptOffer} />;
  }

  if (activeMenu === "ดีล / คำสั่งซื้อทั้งหมด" || activeMenu === "คำสั่งซื้อทั้งหมด") {
    return <OrdersTable orders={orders} />;
  }

  if (activeMenu === "Fraud & Trust Monitoring" || activeMenu === "แจ้งเตือนความเสี่ยง") {
    return <RiskTable risks={risks} />;
  }

  if (activeMenu === "ตรวจสอบแชทเสี่ยง") {
    return (
      <>
        <ChatThreadList
          title="ตรวจสอบแชทเสี่ยง"
          threads={flaggedChatThreads}
          messages={chatMessages}
          currentUser={currentUser}
          requests={requests}
          orders={orders}
          onOpen={setSelectedChatThread}
          adminMode
        />

        {selectedChatThread ? (
          <ChatModal
            thread={selectedChatThread}
            currentUser={currentUser}
            messages={chatMessages.filter((message) => message.threadId === selectedChatThread.id)}
            relatedRequest={requests.find((request) => request.id === selectedChatThread.rfqId)}
            relatedOrder={orders.find((order) => order.id === selectedChatThread.orderId)}
            onSend={(message, options) => sendChatMessage(selectedChatThread, message, options)}
            onMarkRead={markChatThreadAsRead}
            onCreatePoSo={createPoSoFromChat}
              reviews={reviews}
              onSubmitChatReview={(order, form) => submitBuyerReview(order, form)}
            onClose={() => setSelectedChatThread(null)}
          />
        ) : null}
      </>
    );
  }

  if (activeMenu === "Audit Logs" || activeMenu === "บันทึกการทำงาน") {
    return <AuditTable auditLogs={auditLogs} />;
  }

  if (activeMenu === "รายงาน") {
    return (
      <SectionCard
        title="รายงาน"
        action={
          <button
            onClick={createReport}
            className="rounded-md bg-[#0F8A5F] px-4 py-2 text-sm font-medium text-white"
          >
            สร้างรายงาน demo
          </button>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "รายงานภาพรวมคำขอซื้อ",
            "รายงานผู้ขาย/เกษตรกร",
            "รายงานคำสั่งซื้อและการส่งมอบ",
            "รายงานแจ้งเตือนความเสี่ยง",
            "รายงานปัญหา/ข้อพิพาท",
            "รายงานผลกระทบต่อเกษตรกรเบื้องต้น",
          ].map((item) => (
            <div key={item} className="rounded-lg border border-[#DDE7E3] bg-[#F3F7F5] p-4">
              <p className="font-bold">{item}</p>
              <p className="mt-2 text-sm text-slate-500">filter: ช่วงเวลา, สินค้า, พื้นที่, สถานะ, ความเสี่ยง</p>
            </div>
          ))}
        </div>
      </SectionCard>
    );
  }

  return (
    <>
      <SectionCard title="ภาพรวมระบบ">
        <UserProfile currentUser={currentUser} />
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="สินค้าในระบบ" value={products.length} />
        <StatCard title="คำขอซื้อทั้งหมด" value={requests.length} />
        <StatCard title="คำสั่งซื้อทั้งหมด" value={orders.length} />
        <StatCard title="แจ้งเตือนความเสี่ยง" value={risks.length} detail="ต้องติดตาม" />
      </div>

      <RiskTable risks={risks} />
      <AuditTable auditLogs={auditLogs.slice(0, 5)} />
    </>
  );
}

function UserProfile({ currentUser }: { currentUser: User }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-md border border-[#DDE7E3] p-4">
        <p className="text-sm text-slate-500">ชื่อ</p>
        <p className="font-bold text-[#0F172A]">{currentUser.displayName}</p>
      </div>
      <div className="rounded-md border border-[#DDE7E3] p-4">
        <p className="text-sm text-slate-500">Username</p>
        <p className="font-bold text-[#0F172A]">{currentUser.username}</p>
      </div>
      <div className="rounded-md border border-[#DDE7E3] p-4">
        <p className="text-sm text-slate-500">จังหวัด</p>
        <p className="font-bold text-[#0F172A]">{currentUser.province || "-"}</p>
      </div>
      <div className="rounded-md border border-[#DDE7E3] p-4">
        <p className="text-sm text-slate-500">ประเภทองค์กร</p>
        <p className="font-bold text-[#0F172A]">{currentUser.organizationType || "-"}</p>
      </div>
    </div>
  );
}

function SellerProductsSection({
  products,
  reviews,
  onAddProduct,
  onEditProduct,
  onUpdateImage,
  onDeleteProduct,
  compact,
}: {
  products: PublicProduct[];
  reviews: BuyerReview[];
  onAddProduct: (form: ProductFormState) => void;
  onEditProduct: (productId: string, form: ProductFormState) => void;
  onUpdateImage: (productId: string, imageUrl?: string) => void;
  onDeleteProduct: (productId: string) => void;
  compact?: boolean;
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<PublicProduct | null>(null);
  const [detailProduct, setDetailProduct] = useState<PublicProduct | null>(null);
  const [imageProduct, setImageProduct] = useState<PublicProduct | null>(null);

  const closeAllModals = () => {
    setIsAddOpen(false);
    setEditingProduct(null);
    setDetailProduct(null);
    setImageProduct(null);
  };

  return (
    <>
      <SectionCard
        title={compact ? "สินค้าของฉัน" : "จัดการสินค้าของฉัน"}
        action={
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="rounded-md bg-[#0F8A5F] px-4 py-2 text-sm font-medium text-white"
          >
            + เพิ่มสินค้าใหม่
          </button>
        }
      >
        {products.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-[#F3F7F5] p-8 text-center">
            <h3 className="text-lg font-bold text-[#0F172A]">ยังไม่มีสินค้าในระบบ</h3>
            <p className="mt-2 text-sm text-slate-500">
              เริ่มเพิ่มสินค้าเกษตรของคุณ พร้อมอัปโหลดรูปภาพและรายละเอียดสินค้า เพื่อให้ผู้ซื้อ B2B สามารถค้นหาและส่งคำขอซื้อได้
            </p>
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="mt-5 rounded-md bg-[#0F8A5F] px-4 py-2 text-sm font-medium text-white"
            >
              + เพิ่มสินค้าใหม่
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                mode="seller"
                onEdit={setEditingProduct}
                onManageImages={setImageProduct}
                onView={setDetailProduct}
                onDelete={onDeleteProduct}
              />
            ))}
          </div>
        )}
      </SectionCard>

      {isAddOpen ? (
        <AddProductModal
          title="เพิ่มสินค้าใหม่"
          submitLabel="บันทึกสินค้า"
          onClose={closeAllModals}
          onSubmit={(form) => {
            onAddProduct(form);
            closeAllModals();
          }}
        />
      ) : null}

      {editingProduct ? (
        <AddProductModal
          title="แก้ไขสินค้า"
          submitLabel="บันทึกการแก้ไข"
          initialProduct={editingProduct}
          onClose={closeAllModals}
          onSubmit={(form) => {
            onEditProduct(editingProduct.id, form);
            closeAllModals();
          }}
        />
      ) : null}

      {detailProduct ? (
        <ProductDetailModal product={detailProduct} reviews={reviews} onClose={closeAllModals} />
      ) : null}

      {imageProduct ? (
        <ManageImageModal
          product={imageProduct}
          onClose={closeAllModals}
          onSave={(imageUrl) => {
            onUpdateImage(imageProduct.id, imageUrl);
            closeAllModals();
          }}
        />
      ) : null}
    </>
  );
}

function AddProductModal({
  title,
  submitLabel,
  initialProduct,
  onClose,
  onSubmit,
}: {
  title: string;
  submitLabel: string;
  initialProduct?: PublicProduct;
  onClose: () => void;
  onSubmit: (form: ProductFormState) => void;
}) {
  const [form, setForm] = useState<ProductFormState>({
    productName: initialProduct?.productName || "",
    category: initialProduct?.category || "ผัก",
    area: initialProduct?.area || "",
    quantityText: initialProduct?.quantityText || "",
    quality: initialProduct?.quality || "",
    priceRange: initialProduct?.priceRange || "",
    availableDate: initialProduct?.availableDate || "",
    season: initialProduct?.season || "",
    availableQuantity: String(initialProduct?.availableQuantity ?? 0),
    reservedQuantity: String(initialProduct?.reservedQuantity ?? 0),
    soldQuantity: String(initialProduct?.soldQuantity ?? 0),
    unit: initialProduct?.unit || "กก.",
    minOrderQuantity: String(initialProduct?.minOrderQuantity ?? 1),
    maxOrderQuantity: String(initialProduct?.maxOrderQuantity ?? ""),
    stockStatus: initialProduct?.stockStatus || "available",
    sellerCanDeliver: initialProduct?.sellerCanDeliver ? "yes" : "no",
    deliveryAreaType: initialProduct?.deliveryAreaType || "same_province",
    deliveryAreaText: initialProduct?.deliveryAreaText || "จังหวัดเดียวกัน",
    minimumSellerDeliveryQuantity: String(initialProduct?.minimumSellerDeliveryQuantity ?? 300),
    minimumSellerDeliveryUnit: initialProduct?.minimumSellerDeliveryUnit || "กก.",
    shippingFeePolicy: initialProduct?.shippingFeePolicy || "quoted_later",
    shippingFeeAmount: String(initialProduct?.shippingFeeAmount ?? ""),
    shippingFeeNote: initialProduct?.shippingFeeNote || "",
    buyerPickupAvailable: initialProduct?.buyerPickupAvailable === false ? "no" : "yes",
    pickupLocationText: initialProduct?.pickupLocationText || "",
    thirdPartyLogisticsAvailable: initialProduct?.thirdPartyLogisticsAvailable === false ? "no" : "yes",
    coldChainAvailable: initialProduct?.coldChainAvailable ? "yes" : "no",
    vehicleTypes: (initialProduct?.vehicleTypes || ["รถกระบะ", "รถรับจ้างในพื้นที่"]).join(", "),
    deliveryNote: initialProduct?.deliveryNote || "",
    parcelShippingAllowed: initialProduct?.parcelShippingAllowed === false ? "no" : "yes",
    parcelCarrierName: initialProduct?.parcelCarrierName || "ไปรษณีย์ไทย",
    parcelMaxWeightKg: String(initialProduct?.parcelMaxWeightKg ?? 25),
    parcelClaimSupported: initialProduct?.parcelClaimSupported === false ? "no" : "yes",
    parcelClaimNote:
      initialProduct?.parcelClaimNote ||
      "มี tracking และสามารถร้องเรียน/ขอชดใช้กรณีเสียหายหรือสูญหายได้ตามเงื่อนไขผู้ให้บริการ",
    bulkTransportRecommendedAboveKg: String(initialProduct?.bulkTransportRecommendedAboveKg ?? 25),
    bulkShippingMinKg: String(initialProduct?.bulkShippingMinKg ?? 100),
    sellerOwnVehicleAvailable: initialProduct?.sellerOwnVehicleAvailable ? "yes" : "no",
    localHiredVehicleAvailable: initialProduct?.localHiredVehicleAvailable === false ? "no" : "yes",
    interProvinceLogisticsAvailable: initialProduct?.interProvinceLogisticsAvailable ? "yes" : "no",
    imageUrl: initialProduct?.imageUrl || "",
  });

  const update = (key: keyof ProductFormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("รองรับเฉพาะ JPG, PNG หรือ WebP");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("ขนาดไฟล์ต้องไม่เกิน 5MB");
      return;
    }

    const storedImageUrl = await imageFileToStoredDataUrl(file);
    update("imageUrl", storedImageUrl);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.productName.trim()) {
      alert("กรุณากรอกชื่อสินค้า");
      return;
    }

    onSubmit({
      ...form,
      area: form.area || "ไม่ระบุพื้นที่",
      quantityText: form.quantityText || "ระบุปริมาณภายหลัง",
      quality: form.quality || "ระบุมาตรฐานภายหลัง",
      priceRange: form.priceRange || "ระบุราคาเมื่อเสนอขาย",
      availableDate: form.availableDate || "ระบุวันพร้อมส่งภายหลัง",
      season: form.season || "รอบผลผลิตปัจจุบัน",
      availableQuantity: form.availableQuantity || "0",
      reservedQuantity: form.reservedQuantity || "0",
      soldQuantity: form.soldQuantity || "0",
      unit: form.unit || "กก.",
      minOrderQuantity: form.minOrderQuantity || "1",
      maxOrderQuantity: form.maxOrderQuantity || "",
      stockStatus: form.stockStatus || "available",
      sellerCanDeliver: form.sellerCanDeliver || "no",
      deliveryAreaType: form.deliveryAreaType || "same_province",
      deliveryAreaText: form.deliveryAreaText || "จังหวัดเดียวกัน",
      minimumSellerDeliveryQuantity: form.minimumSellerDeliveryQuantity || "300",
      minimumSellerDeliveryUnit: form.minimumSellerDeliveryUnit || "กก.",
      shippingFeePolicy: form.shippingFeePolicy || "quoted_later",
      shippingFeeAmount: form.shippingFeeAmount || "",
      shippingFeeNote: form.shippingFeeNote || "",
      buyerPickupAvailable: form.buyerPickupAvailable || "yes",
      pickupLocationText: form.pickupLocationText || "",
      thirdPartyLogisticsAvailable: form.thirdPartyLogisticsAvailable || "yes",
      coldChainAvailable: form.coldChainAvailable || "no",
      vehicleTypes: form.vehicleTypes || "",
      deliveryNote: form.deliveryNote || "",
      parcelShippingAllowed: form.parcelShippingAllowed || "yes",
      parcelCarrierName: form.parcelCarrierName || "ไปรษณีย์ไทย",
      parcelMaxWeightKg: form.parcelMaxWeightKg || "25",
      parcelClaimSupported: form.parcelClaimSupported || "yes",
      parcelClaimNote:
        form.parcelClaimNote ||
        "มี tracking และสามารถร้องเรียน/ขอชดใช้กรณีเสียหายหรือสูญหายได้ตามเงื่อนไขผู้ให้บริการ",
      bulkTransportRecommendedAboveKg: form.bulkTransportRecommendedAboveKg || "25",
      bulkShippingMinKg: form.bulkShippingMinKg || "100",
      sellerOwnVehicleAvailable: form.sellerOwnVehicleAvailable || "no",
      localHiredVehicleAvailable: form.localHiredVehicleAvailable || "yes",
      interProvinceLogisticsAvailable: form.interProvinceLogisticsAvailable || "no",
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-slate-950/45 px-4 py-8">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A]">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              ผู้ขายเป็นผู้จัดการข้อมูลสินค้าเอง ข้อมูลนี้จะแสดงเฉพาะภายใต้บัญชีผู้ขายปัจจุบัน
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
            ปิด
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            ชื่อสินค้า
            <input
              value={form.productName}
              onChange={(event) => update("productName", event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            หมวดหมู่
            <select
              value={form.category}
              onChange={(event) => update("category", event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            >
              <option>ผัก</option>
              <option>ผลไม้</option>
              <option>ผัก/ผลไม้</option>
              <option>ธัญพืช</option>
              <option>อื่น ๆ</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            พื้นที่ เช่น เชียงใหม่ / แม่ริม
            <input
              value={form.area}
              onChange={(event) => update("area", event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            ปริมาณพร้อมส่ง
            <input
              value={form.quantityText}
              onChange={(event) => update("quantityText", event.target.value)}
              placeholder="พร้อมส่งประมาณ 500 กก."
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            มาตรฐานสินค้า
            <input
              value={form.quality}
              onChange={(event) => update("quality", event.target.value)}
              placeholder="GAP / Organic / คัดเกรด"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            ช่วงราคา
            <input
              value={form.priceRange}
              onChange={(event) => update("priceRange", event.target.value)}
              placeholder="55-70 บาท/กก."
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            วันที่พร้อมส่ง
            <input
              value={form.availableDate}
              onChange={(event) => update("availableDate", event.target.value)}
              placeholder="พร้อมส่ง 10 มิ.ย. 2026"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            รอบผลผลิต / หมายเหตุ
            <input
              value={form.season}
              onChange={(event) => update("season", event.target.value)}
              placeholder="รอบส่งรายสัปดาห์"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            />
          </label>
        </div>

        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="font-bold text-[#0F172A]">ข้อมูลปริมาณสินค้า</p>
          <p className="mt-1 text-sm text-slate-500">
            ใช้ตอบคำถามผู้ซื้อว่า supply มีปริมาณพอจริงหรือไม่
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="block text-sm font-medium text-slate-700">
              ปริมาณพร้อมเสนอ
              <input
                type="number"
                min="0"
                value={form.availableQuantity}
                onChange={(event) => update("availableQuantity", event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              หน่วย
              <input
                value={form.unit}
                onChange={(event) => update("unit", event.target.value)}
                placeholder="กก."
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              ขั้นต่ำต่อคำขอซื้อ
              <input
                type="number"
                min="0"
                value={form.minOrderQuantity}
                onChange={(event) => update("minOrderQuantity", event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              ปริมาณที่กันไว้
              <input
                type="number"
                min="0"
                value={form.reservedQuantity}
                onChange={(event) => update("reservedQuantity", event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              ปริมาณที่ขายแล้ว
              <input
                type="number"
                min="0"
                value={form.soldQuantity}
                onChange={(event) => update("soldQuantity", event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              สถานะสินค้า
              <select
                value={form.stockStatus}
                onChange={(event) => update("stockStatus", event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              >
                <option value="available">มีปริมาณพร้อมเสนอ</option>
                <option value="limited">ปริมาณจำกัด</option>
                <option value="reserved">ถูกกันไว้บางส่วน</option>
                <option value="out_of_stock">หมดชั่วคราว</option>
                <option value="harvesting_soon">ใกล้พร้อมเก็บเกี่ยว</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] p-4">
          <p className="font-bold text-[#0F172A]">เงื่อนไขการขนส่ง</p>
          <p className="mt-1 text-sm text-slate-600">
            สำหรับสินค้าไม่เกิน 25 กก. ระบบจะแนะนำไปรษณีย์ไทยเป็นตัวเลือกหลัก ส่วนปริมาณมากจะแนะนำรถผู้ขาย รถรับจ้าง หรือ bulk logistics
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="block text-sm font-medium text-slate-700">
              ผู้ขายจัดส่งเองได้
              <select
                value={form.sellerCanDeliver}
                onChange={(event) => update("sellerCanDeliver", event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              >
                <option value="yes">ได้</option>
                <option value="no">ไม่ได้</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              พื้นที่จัดส่งเอง
              <select
                value={form.deliveryAreaType}
                onChange={(event) => update("deliveryAreaType", event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              >
                <option value="same_district">อำเภอเดียวกัน</option>
                <option value="same_province">จังหวัดเดียวกัน</option>
                <option value="nearby_province">จังหวัดใกล้เคียง</option>
                <option value="nationwide">ทั่วประเทศ</option>
                <option value="custom">กำหนดเอง</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              รายละเอียดพื้นที่จัดส่ง
              <input
                value={form.deliveryAreaText}
                onChange={(event) => update("deliveryAreaText", event.target.value)}
                placeholder="เช่น จังหวัดเชียงใหม่ / ไม่เกิน 50 กม."
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              ขั้นต่ำผู้ขายจัดส่งเอง
              <input
                type="number"
                min="0"
                value={form.minimumSellerDeliveryQuantity}
                onChange={(event) => update("minimumSellerDeliveryQuantity", event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              หน่วยขั้นต่ำจัดส่ง
              <input
                value={form.minimumSellerDeliveryUnit}
                onChange={(event) => update("minimumSellerDeliveryUnit", event.target.value)}
                placeholder="กก."
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              นโยบายค่าขนส่ง
              <select
                value={form.shippingFeePolicy}
                onChange={(event) => update("shippingFeePolicy", event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              >
                <option value="included">รวมในราคาสินค้าแล้ว</option>
                <option value="buyer_pays">ผู้ซื้อจ่ายแยก</option>
                <option value="seller_pays">ผู้ขายรับผิดชอบ</option>
                <option value="shared">แบ่งจ่ายตามตกลง</option>
                <option value="quoted_later">คำนวณ/เสนอภายหลัง</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              ค่าขนส่งโดยประมาณ
              <input
                type="number"
                min="0"
                value={form.shippingFeeAmount}
                onChange={(event) => update("shippingFeeAmount", event.target.value)}
                placeholder="เช่น 1200"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              ผู้ซื้อรับเองได้
              <select
                value={form.buyerPickupAvailable}
                onChange={(event) => update("buyerPickupAvailable", event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              >
                <option value="yes">ได้</option>
                <option value="no">ไม่ได้</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              รถรับจ้าง / Logistic ภายนอก
              <select
                value={form.thirdPartyLogisticsAvailable}
                onChange={(event) => update("thirdPartyLogisticsAvailable", event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              >
                <option value="yes">รองรับ</option>
                <option value="no">ไม่รองรับ</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              ขนส่งควบคุมอุณหภูมิ
              <select
                value={form.coldChainAvailable}
                onChange={(event) => update("coldChainAvailable", event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              >
                <option value="no">ไม่จำเป็น / ไม่มี</option>
                <option value="yes">รองรับ</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700 md:col-span-2">
              ประเภทรถที่รองรับ
              <input
                value={form.vehicleTypes}
                onChange={(event) => update("vehicleTypes", event.target.value)}
                placeholder="รถกระบะ, รถ 4 ล้อ, รถรับจ้างในพื้นที่"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700 md:col-span-3">
              จุดรับสินค้า / หมายเหตุขนส่ง
              <input
                value={form.pickupLocationText}
                onChange={(event) => update("pickupLocationText", event.target.value)}
                placeholder="เช่น จุดรวบรวม อ.แม่ริม จ.เชียงใหม่"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700 md:col-span-3">
              หมายเหตุค่าขนส่ง
              <textarea
                value={form.shippingFeeNote || form.deliveryNote}
                onChange={(event) => {
                  update("shippingFeeNote", event.target.value);
                  update("deliveryNote", event.target.value);
                }}
                rows={3}
                placeholder="เช่น ผู้ขายจัดส่งเองเฉพาะจังหวัดเดียวกัน ขั้นต่ำ 300 กก. หากต่ำกว่านี้ผู้ซื้อรับเองหรือใช้รถรับจ้าง"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
            </label>
          </div>

          <div className="mt-4 rounded-md bg-white p-4 text-sm text-slate-700">
            <p className="font-bold text-[#0F172A]">กฎขนส่งพัสดุขนาดเล็ก</p>
            <div className="mt-3 grid gap-4 md:grid-cols-3">
              <label className="block text-sm font-medium text-slate-700">
                ผู้ให้บริการแนะนำ
                <input
                  value={form.parcelCarrierName}
                  onChange={(event) => update("parcelCarrierName", event.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                น้ำหนักสูงสุดสำหรับพัสดุ
                <input
                  type="number"
                  min="0"
                  value={form.parcelMaxWeightKg}
                  onChange={(event) => update("parcelMaxWeightKg", event.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                เริ่มแนะนำ bulk logistics เมื่อเกิน
                <input
                  type="number"
                  min="0"
                  value={form.bulkTransportRecommendedAboveKg}
                  onChange={(event) => update("bulkTransportRecommendedAboveKg", event.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                />
              </label>
            </div>

            <label className="mt-3 block text-sm font-medium text-slate-700">
              หมายเหตุการเคลม
              <textarea
                value={form.parcelClaimNote}
                onChange={(event) => update("parcelClaimNote", event.target.value)}
                rows={2}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
            </label>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-[#DDE7E3] p-4">
          <p className="font-bold text-[#0F172A]">รูปภาพสินค้า</p>
          <p className="mt-1 text-sm text-slate-500">
            รองรับ JPG, PNG, WebP ไม่เกิน 5MB รูปภาพจะใช้เป็นรูปหลักของสินค้า
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-[180px_1fr]">
            <div className="flex h-36 items-center justify-center overflow-hidden rounded-md bg-[#F3F7F5]">
              {form.imageUrl ? (
                <img src={form.imageUrl} alt="preview" className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm text-slate-400">Preview รูปสินค้า</span>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex cursor-pointer items-center justify-center rounded-md border border-dashed border-slate-300 p-4 text-sm font-medium text-slate-600 hover:bg-[#F3F7F5]">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFile}
                  className="hidden"
                />
                อัปโหลดรูปสินค้า
              </label>

              {form.imageUrl ? (
                <button
                  type="button"
                  onClick={() => update("imageUrl", "")}
                  className="w-full rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  ลบรูปภาพ
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[#DDE7E3] px-4 py-2 text-sm font-medium text-slate-700"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="rounded-md bg-[#0F8A5F] px-4 py-2 text-sm font-medium text-white"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}


function PurchaseRequestModal({
  product,
  buyerProvince,
  onClose,
  onSubmit,
}: {
  product: PublicProduct;
  buyerProvince: string;
  onClose: () => void;
  onSubmit: (form: PurchaseRequestFormState) => void;
}) {
  const remainingQuantity = getRemainingQuantity(product);
  const [form, setForm] = useState<PurchaseRequestFormState>({
    requestedQuantity: String(product.minOrderQuantity || Math.min(product.availableQuantity, DEFAULT_PARCEL_MAX_WEIGHT_KG)),
    deliveryLocation: buyerProvince ? `จังหวัด${buyerProvince}` : "",
    deliveryDate: "",
    targetPrice: product.priceRange,
    qualitySpec: product.quality,
    deliveryPreference: "seller_delivery",
    logisticsNote: "",
  });

  const requestedQuantity = Number(form.requestedQuantity || 0);
  const transportRecommendation = recommendTransport(requestedQuantity || product.minOrderQuantity || 0, true);
  const belowMinimumOrder = requestedQuantity > 0 && requestedQuantity < product.minOrderQuantity;
  const aboveRemaining = requestedQuantity > remainingQuantity;
  const belowSellerDeliveryMinimum =
    form.deliveryPreference === "seller_delivery" &&
    product.sellerCanDeliver &&
    requestedQuantity > 0 &&
    requestedQuantity < (product.minimumSellerDeliveryQuantity ?? product.minOrderQuantity);

  const update = (key: keyof PurchaseRequestFormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!requestedQuantity || requestedQuantity <= 0) {
      alert("กรุณาระบุปริมาณที่ต้องการ");
      return;
    }

    if (!form.deliveryLocation.trim()) {
      alert("กรุณาระบุสถานที่รับ/ส่งสินค้า");
      return;
    }

    if (!form.deliveryDate.trim()) {
      alert("กรุณาระบุวันที่ต้องการรับสินค้า");
      return;
    }

    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-slate-950/45 px-4 py-8">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-[#06603F]">{product.category}</p>
            <h2 className="text-2xl font-bold text-[#0F172A]">สร้างคำขอซื้อ</h2>
            <p className="mt-1 text-sm text-slate-500">
              กรอกข้อมูลคำขอซื้อเพื่อให้ผู้ขายตรวจสอบปริมาณ ราคา เงื่อนไขคุณภาพ และการขนส่งก่อนตอบข้อเสนอ
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
            ปิด
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <InfoBox label="สินค้า" value={product.productName} />
          <InfoBox label="พื้นที่ผู้ขาย" value={product.area} />
          <InfoBox label="คงเหลือโดยประมาณ" value={`${remainingQuantity.toLocaleString("th-TH")} ${product.unit}`} />
          <InfoBox label="ขั้นต่ำต่อคำขอซื้อ" value={`${product.minOrderQuantity.toLocaleString("th-TH")} ${product.unit}`} />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            ปริมาณที่ต้องการ ({product.unit})
            <input
              type="number"
              min="1"
              value={form.requestedQuantity}
              onChange={(event) => update("requestedQuantity", event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            วันที่ต้องการรับสินค้า
            <input
              type="date"
              value={form.deliveryDate}
              min={getTodayDateInput()}
              onChange={(event) => update("deliveryDate", event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            />
            <p className="mt-1 text-xs text-slate-500">
              กรุณาเลือกจากปฏิทิน เพื่อลดความผิดพลาดของรูปแบบวันที่
            </p>
          </label>

          <label className="block text-sm font-medium text-slate-700 md:col-span-2">
            สถานที่รับ/ส่งสินค้า
            <input
              value={form.deliveryLocation}
              onChange={(event) => update("deliveryLocation", event.target.value)}
              placeholder="เช่น โรงแรม / โรงงาน / จุดรับสินค้า"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            ช่วงราคาที่รับได้
            <input
              value={form.targetPrice}
              onChange={(event) => update("targetPrice", event.target.value)}
              placeholder={product.priceRange}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            รูปแบบขนส่งที่ต้องการ
            <select
              value={form.deliveryPreference}
              onChange={(event) => update("deliveryPreference", event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            >
              <option value="seller_delivery">ให้ผู้ขายจัดส่ง</option>
              <option value="buyer_pickup">ผู้ซื้อรับเอง</option>
              <option value="third_party_logistics">ใช้รถรับจ้าง / Logistic ภายนอก</option>
              <option value="to_be_discussed">ให้ผู้ขายเสนอทางเลือก</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700 md:col-span-2">
            เงื่อนไขคุณภาพ / เอกสารที่ต้องการ
            <textarea
              value={form.qualitySpec}
              onChange={(event) => update("qualitySpec", event.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 md:col-span-2">
            หมายเหตุด้านขนส่ง
            <textarea
              value={form.logisticsNote}
              onChange={(event) => update("logisticsNote", event.target.value)}
              rows={2}
              placeholder="เช่น ต้องการรับช่วงเช้า ขอใบส่งของ หรือให้ผู้ขายเสนอค่าขนส่งแยก"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            />
          </label>
        </div>

        <div className="mt-5 space-y-3">
          <div className="rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] p-4 text-sm text-slate-700">
            <p className="font-bold text-[#0F172A]">คำแนะนำด้านขนส่ง</p>
            <p className="mt-1">{transportRecommendation.message}</p>
            <p className="mt-1 font-medium">ตัวเลือกที่แนะนำ: {transportRecommendation.label}</p>
          </div>

          {belowMinimumOrder ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              ปริมาณที่ต้องการต่ำกว่าขั้นต่ำต่อคำขอซื้อของผู้ขาย ขั้นต่ำคือ {product.minOrderQuantity.toLocaleString("th-TH")} {product.unit}
            </div>
          ) : null}

          {belowSellerDeliveryMinimum ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              ปริมาณนี้ยังไม่ถึงขั้นต่ำสำหรับให้ผู้ขายจัดส่งเอง ขั้นต่ำจัดส่งคือ {(product.minimumSellerDeliveryQuantity ?? product.minOrderQuantity).toLocaleString("th-TH")} {product.minimumSellerDeliveryUnit || product.unit} คุณสามารถเพิ่มปริมาณ เลือกผู้ซื้อรับเอง ใช้รถรับจ้าง หรือให้ผู้ขายเสนอค่าขนส่งเพิ่มเติม
            </div>
          ) : null}

          {aboveRemaining ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              ปริมาณที่ขอซื้อสูงกว่าคงเหลือโดยประมาณ ระบบจะส่งให้ผู้ขายตรวจสอบก่อนตอบข้อเสนอ
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[#DDE7E3] px-4 py-2 text-sm font-medium text-slate-700"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={remainingQuantity <= 0}
            className={`rounded-md px-4 py-2 text-sm font-medium text-white ${
              remainingQuantity > 0 ? "bg-[#0F8A5F] hover:bg-[#0B6F4A]" : "cursor-not-allowed bg-slate-300"
            }`}
          >
            ส่งคำขอซื้อ
          </button>
        </div>
      </form>
    </div>
  );
}

function ProductDetailModal({
  product,
  reviews,
  onClose,
  onRequestPurchase,
}: {
  product: PublicProduct;
  reviews: BuyerReview[];
  onClose: () => void;
  onRequestPurchase?: (product: PublicProduct) => void;
}) {
  const remainingQuantity = getRemainingQuantity(product);
  const stockLabel = getStockStatusLabel(product);
  const performance = getSellerPerformance(product.sellerId);
  const onTimeRate = getOnTimeRate(performance);
  const trustLabel = getSellerTrustLabel(performance);
  const transportRecommendation = recommendTransport(product.minOrderQuantity, true);
  const shippingFeeLabel = getShippingFeeLabel(product);
  const productReviews = reviews.filter(
    (review) =>
      review.status === "published" &&
      review.sellerId === product.sellerId &&
      review.productName === product.productName
  );

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-slate-950/45 px-4 py-8">
      <section className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-[#06603F]">{product.category}</p>
            <h2 className="text-2xl font-bold text-[#0F172A]">{product.productName}</h2>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
            ปิด
          </button>
        </div>

        <div className="mt-5 overflow-hidden rounded-lg bg-[#F3F7F5]">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.productName} className="h-64 w-full object-cover" />
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-slate-400">ยังไม่มีรูปสินค้า</div>
          )}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <InfoBox label="พื้นที่" value={product.area} />
          <InfoBox label="ปริมาณพร้อมส่ง" value={product.quantityText} />
          <InfoBox label="มาตรฐานสินค้า" value={product.quality} />
          <InfoBox label="ช่วงราคา" value={product.priceRange} />
          <InfoBox label="วันที่พร้อมส่ง" value={product.availableDate} />
          <InfoBox label="รอบผลผลิต / หมายเหตุ" value={product.season} />
        </div>

        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-5">
          <h3 className="font-bold text-[#0F172A]">ข้อมูลปริมาณ</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-slate-500">ปริมาณพร้อมเสนอ</p>
              <p className="text-lg font-bold">{product.availableQuantity.toLocaleString("th-TH")} {product.unit}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">คงเหลือประมาณ</p>
              <p className="text-lg font-bold">{remainingQuantity.toLocaleString("th-TH")} {product.unit}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">ขั้นต่ำต่อคำขอซื้อ</p>
              <p className="text-lg font-bold">{product.minOrderQuantity.toLocaleString("th-TH")} {product.unit}</p>
            </div>
          </div>
          <span className={`mt-4 inline-flex rounded-md px-3 py-1.5 text-sm font-medium ${
            remainingQuantity > 0 ? "bg-[#D1FAE5] text-[#06603F]" : "bg-red-100 text-red-700"
          }`}>
            {stockLabel}
          </span>
        </div>

        <div className="mt-6 rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] p-5">
          <h3 className="font-bold text-[#0F172A]">เงื่อนไขและคำแนะนำด้านขนส่ง</h3>
          <p className="mt-2 text-sm text-slate-700">{transportRecommendation.message}</p>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <InfoBox label="คำแนะนำขนส่ง" value={transportRecommendation.label} />
            <InfoBox label="ขนส่งพัสดุเล็ก" value={`${product.parcelCarrierName || "ไปรษณีย์ไทย"} ไม่เกิน ${(product.parcelMaxWeightKg ?? DEFAULT_PARCEL_MAX_WEIGHT_KG).toLocaleString("th-TH")} ${product.unit}`} />
            <InfoBox label="ค่าขนส่ง" value={shippingFeeLabel} />
            <InfoBox label="ผู้ขายจัดส่งเอง" value={product.sellerCanDeliver ? `ได้ (${product.deliveryAreaText || "ตามพื้นที่ที่ระบุ"})` : "ไม่ได้ / รอตกลง"} />
            <InfoBox label="ขั้นต่ำผู้ขายจัดส่งเอง" value={`${(product.minimumSellerDeliveryQuantity ?? 300).toLocaleString("th-TH")} ${product.minimumSellerDeliveryUnit || product.unit}`} />
            <InfoBox label="ผู้ซื้อรับเอง" value={product.buyerPickupAvailable ? product.pickupLocationText || "ได้" : "ไม่ได้ระบุ"} />
            <InfoBox label="รถรับจ้าง / Bulk Logistics" value={product.thirdPartyLogisticsAvailable ? "รองรับ" : "ไม่ระบุ"} />
            <InfoBox label="รถที่รองรับ" value={product.vehicleTypes?.length ? product.vehicleTypes.join(", ") : "รถกระบะ / รถรับจ้าง"} />
            <InfoBox label="Cold Chain" value={product.coldChainAvailable ? "รองรับ" : "ไม่จำเป็น / ไม่ระบุ"} />
          </div>

          <div className="mt-4 rounded-md bg-white p-4 text-sm text-slate-700">
            <p className="font-bold text-[#0F172A]">กฎ 25 กก. สำหรับ FarmLink</p>
            <p className="mt-1">
              หากปริมาณไม่เกิน {(product.parcelMaxWeightKg ?? DEFAULT_PARCEL_MAX_WEIGHT_KG).toLocaleString("th-TH")} {product.unit} ระบบแนะนำ {product.parcelCarrierName || "ไปรษณีย์ไทย"} เพราะเหมาะกับพัสดุขนาดเล็ก มี tracking และสามารถร้องเรียน/ขอชดใช้กรณีสินค้าเสียหายหรือสูญหายได้ตามเงื่อนไขผู้ให้บริการ
            </p>
            <p className="mt-2">
              หากเกิน 25 {product.unit} ค่าขนส่งแบบพัสดุทั่วไปอาจสูงขึ้น ควรพิจารณารถผู้ขาย รถรับจ้าง ผู้ซื้อรับเอง หรือขนส่งแบบเหมารอบ/ปริมาณมาก
            </p>
            {product.deliveryNote || product.shippingFeeNote ? (
              <p className="mt-2 font-medium text-slate-800">หมายเหตุ: {product.deliveryNote || product.shippingFeeNote}</p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-5">
          <h3 className="font-bold text-[#0F172A]">ประวัติผู้ขาย</h3>
          {performance ? (
            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-slate-500">ส่งมอบสำเร็จ</p>
                <p className="text-lg font-bold">{performance.completedOrders} ครั้ง</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">ส่งตรงเวลา</p>
                <p className="text-lg font-bold">{onTimeRate ?? "-"}%</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">คะแนนคุณภาพ</p>
                <p className="text-lg font-bold">{performance.averageQualityRating}/5</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">ข้อพิพาท</p>
                <p className={`text-lg font-bold ${performance.disputeCount > 0 ? "text-red-600" : "text-[#0F172A]"}`}>
                  {performance.disputeCount}
                </p>
              </div>
              <div className="md:col-span-4">
                <span className="inline-flex rounded-md bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700">
                  {trustLabel}
                </span>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">ยังไม่มีประวัติส่งมอบในระบบ</p>
          )}
        </div>

        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-5">
          <h3 className="font-bold text-[#0F172A]">รีวิวจากผู้ซื้อที่เคยทำรายการ</h3>
          {productReviews.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">ยังไม่มีรีวิวหลังการส่งมอบสำเร็จสำหรับสินค้านี้</p>
          ) : (
            <div className="mt-4 space-y-4">
              {productReviews.map((review) => (
                <article key={review.id} className="rounded-lg border border-blue-100 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-[#0F172A]">ผู้ซื้อ B2B ที่ผ่านการยืนยัน</p>
                      <p className="text-sm text-slate-500">{formatThaiDate(review.createdAt)}</p>
                    </div>
                    <span className="rounded-md bg-blue-100 px-2.5 py-1 text-sm font-medium text-blue-700">
                      ★ {Math.round((review.qualityRating + review.deliveryRating + review.documentRating) / 3)}/5
                    </span>
                  </div>

                  <div className="mt-3 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                    <p>คะแนนคุณภาพ: {review.qualityRating}/5</p>
                    <p>การส่งมอบ: {review.deliveryRating}/5</p>
                    <p>เอกสาร: {review.documentRating}/5</p>
                  </div>

                  <p className="mt-3 text-sm text-slate-700">"{review.comment}"</p>
                  <span className="mt-3 inline-flex rounded-md bg-[#D1FAE5] px-2.5 py-1 text-xs font-medium text-[#06603F]">
                    รีวิวหลังการส่งมอบสำเร็จ
                  </span>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[#DDE7E3] px-4 py-2 text-sm font-medium text-slate-700"
          >
            ปิดรายละเอียด
          </button>
          {onRequestPurchase ? (
            <button
              type="button"
              onClick={() => onRequestPurchase(product)}
              disabled={remainingQuantity <= 0}
              className={`rounded-md px-4 py-2 text-sm font-medium text-white ${
                remainingQuantity > 0 ? "bg-slate-950 hover:bg-slate-800" : "cursor-not-allowed bg-slate-300"
              }`}
            >
              {remainingQuantity > 0 ? "สร้างคำขอซื้อ" : "หมดสต็อก"}
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function ManageImageModal({
  product,
  onClose,
  onSave,
}: {
  product: PublicProduct;
  onClose: () => void;
  onSave: (imageUrl?: string) => void;
}) {
  const [imageUrl, setImageUrl] = useState(product.imageUrl || "");

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("รองรับเฉพาะ JPG, PNG หรือ WebP");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("ขนาดไฟล์ต้องไม่เกิน 5MB");
      return;
    }

    const storedImageUrl = await imageFileToStoredDataUrl(file);
    setImageUrl(storedImageUrl);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-slate-950/45 px-4 py-8">
      <section className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A]">จัดการรูปภาพสินค้า</h2>
            <p className="mt-1 text-sm text-slate-500">{product.productName}</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
            ปิด
          </button>
        </div>

        <div className="mt-5 overflow-hidden rounded-lg bg-[#F3F7F5]">
          {imageUrl ? (
            <img src={imageUrl} alt={product.productName} className="h-64 w-full object-cover" />
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-slate-400">ยังไม่มีรูปสินค้า</div>
          )}
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center justify-center rounded-md border border-dashed border-slate-300 p-4 text-sm font-medium text-slate-600 hover:bg-[#F3F7F5]">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFile}
              className="hidden"
            />
            อัปโหลด / เปลี่ยนรูป
          </label>

          <button
            type="button"
            onClick={() => setImageUrl("")}
            className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            ลบรูปภาพ
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[#DDE7E3] px-4 py-2 text-sm font-medium text-slate-700"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={() => onSave(imageUrl || undefined)}
            className="rounded-md bg-[#0F8A5F] px-4 py-2 text-sm font-medium text-white"
          >
            บันทึกรูปภาพ
          </button>
        </div>
      </section>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#DDE7E3] p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-[#0F172A]">{value || "-"}</p>
    </div>
  );
}

function ChatThreadList({
  title,
  threads,
  messages,
  currentUser,
  requests,
  orders,
  onOpen,
  adminMode,
}: {
  title: string;
  threads: ChatThread[];
  messages: ChatMessage[];
  currentUser: User;
  requests: PurchaseRequest[];
  orders: Order[];
  onOpen: (thread: ChatThread) => void;
  adminMode?: boolean;
}) {
  return (
    <SectionCard title={title}>
      {threads.length === 0 ? (
        <EmptyHint text={adminMode ? "ยังไม่มีแชทที่ถูก flag ความเสี่ยง" : "ยังไม่มีข้อความการจัดซื้อ"} />
      ) : (
        <div className="space-y-3">
          {threads.map((thread) => {
            const latestMessage = [...messages]
              .filter((message) => message.threadId === thread.id)
              .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

            const unreadCount = messages.filter(
              (message) =>
                message.threadId === thread.id &&
                message.senderId !== currentUser.id &&
                !(message.readBy || []).includes(currentUser.id)
            ).length;

            const latestAttachments = latestMessage ? parseChatAttachmentMarkers(latestMessage.message) : [];
            const latestImageAttachments = latestAttachments.filter(
              (attachment) => attachment.kind === "image" || (attachment.type?.startsWith("image/") && attachment.previewUrl)
            );
            const latestDocumentAttachments = latestAttachments.filter((attachment) => attachment.kind === "document");

            const relatedRequest = requests.find((request) => request.id === thread.rfqId);
            const relatedOrder = orders.find((order) => order.id === thread.orderId);
            const titleText =
              relatedRequest?.productName ||
              relatedOrder?.productName ||
              (thread.threadType === "rfq" ? "คำขอซื้อ" : "คำสั่งซื้อ");

            return (
              <div key={thread.id} className="rounded-lg border border-[#DDE7E3] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-[#0F172A]">{titleText}</p>
                      <StatusBadge value={thread.status === "flagged" ? "แชทมีความเสี่ยง" : "เปิดแชท"} />
                      {unreadCount > 0 ? (
                        <span className="rounded-full bg-[#0F8A5F] px-2.5 py-1 text-xs font-bold text-white">
                          ยังไม่อ่าน {unreadCount}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {thread.threadType === "rfq" ? `RFQ: ${thread.rfqId || "-"}` : `Order: ${thread.orderId || "-"}`}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                      {latestMessage ? shortenChatPreview(latestMessage.message) : "ยังไม่มีข้อความ"}
                    </p>

                    {latestImageAttachments.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {latestImageAttachments.slice(0, 4).map((attachment, attachmentIndex) => (
                          <div
                            key={`${thread.id}-preview-image-${attachmentIndex}`}
                            className="h-20 w-20 overflow-hidden rounded-md border border-[#DDE7E3] bg-[#F3F7F5]"
                            title={attachment.name}
                          >
                            {attachment.previewUrl ? (
                              <img
                                src={attachment.previewUrl}
                                alt={attachment.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                                รูปภาพ
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {latestDocumentAttachments.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {latestDocumentAttachments.slice(0, 4).map((attachment, attachmentIndex) => (
                          <span
                            key={`${thread.id}-preview-doc-${attachmentIndex}`}
                            className="rounded-full bg-[#F3F7F5] px-2.5 py-1 text-xs text-slate-600"
                            title={attachment.name}
                          >
                            เอกสาร: {attachment.name}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {adminMode ? (
                      <p className="mt-2 text-xs text-slate-500">
                        buyerId: {thread.buyerId} / sellerId: {thread.sellerId}
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpen(thread)}
                    className="rounded-md bg-[#0F8A5F] px-4 py-2 text-sm font-medium text-white"
                  >
                    {currentUser.role === "seller" ? "ตอบแชท" : "เปิดแชท"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}


function WorkflowTimeline({
  steps,
  templateName,
}: {
  steps: WorkflowStep[];
  templateName: string;
}) {
  const currentStep = getCurrentWorkflowStep(steps);
  const completedCount = steps.filter((step) => step.status === "completed").length;

  return (
    <div className="mt-4 rounded-lg border border-[#DDE7E3] bg-[#F3F7F5] p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[#0F172A]">ขั้นตอนธุรกรรมจากผู้ดูแลระบบ</p>
          <p className="mt-1 text-xs text-slate-500">{templateName}</p>
        </div>
        <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
          {completedCount}/{steps.length} ขั้นตอน
        </span>
      </div>

      <div className="mt-3 rounded-md border border-emerald-100 bg-[#ECFDF5] p-3 text-sm text-emerald-900">
        <span className="font-bold">สถานะปัจจุบัน:</span> {currentStep.label}
        <p className="mt-1 text-xs text-emerald-800">{currentStep.description}</p>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {steps.map((step, index) => {
          const tone =
            step.status === "completed"
              ? "border-[#A7F3D0] bg-[#ECFDF5] text-emerald-900"
              : step.status === "current"
              ? "border-amber-200 bg-amber-50 text-amber-900"
              : "border-[#DDE7E3] bg-white text-slate-500";

          const marker = step.status === "completed" ? "✓" : step.status === "current" ? "●" : "○";

          return (
            <div key={step.id} className={`rounded-md border p-3 text-xs ${tone}`}>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 font-bold">{marker}</span>
                <div>
                  <p className="font-bold">
                    {index + 1}. {step.label}
                  </p>
                  <p className="mt-1">{step.description}</p>
                  <p className="mt-1 text-[11px] opacity-75">ผู้รับผิดชอบ: {getWorkflowActorLabel(step.actor)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgenticWorkflowPanel({ insights }: { insights: string[] }) {
  return (
    <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">
      <p className="font-bold">Agentic Procurement Assistant</p>
      <p className="mt-1 text-xs text-blue-700">
        ระบบช่วยสรุปและเตือนความเสี่ยงจากข้อมูลคำขอซื้อ แชท ขนส่ง สต็อก และขั้นตอนธุรกรรม โดยไม่ตัดสินใจแทนผู้ใช้
      </p>
      <ul className="mt-3 space-y-2">
        {insights.map((insight) => (
          <li key={insight} className="rounded-md bg-white/70 p-2">
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
}

function WorkflowActionHint({
  currentUser,
  currentStep,
}: {
  currentUser: User;
  currentStep: WorkflowStep;
}) {
  const hints: Record<WorkflowStepKey, string> = {
    rfq_created: "ระบบสร้างคำขอซื้อแล้ว ขั้นถัดไปคือเปิดแชทและรอผู้ขายตอบกลับ",
    chat_opened: "ใช้แชทนี้เพื่อตกลงปริมาณ ราคา ขนส่ง เอกสาร และวันส่งมอบ",
    seller_replied: "ผู้ขายควรตอบกลับหรือใช้ข้อมูลในแชทเพื่อส่งข้อเสนอขาย",
    offer_sent: "ผู้ซื้อควรตรวจราคา ปริมาณ ขนส่ง และเงื่อนไขชำระเงินก่อนยืนยันข้อเสนอ",
    buyer_accepted: "ระบบควรสร้างคำสั่งซื้อเพื่อบันทึกข้อตกลงหลักอย่างเป็นทางการ",
    order_created: "หลังสร้างคำสั่งซื้อ ระบบจึงควรเปิดข้อมูลติดต่อสำหรับขนส่งเท่านั้น",
    delivery_contact_revealed: "คู่ค้าสามารถใช้เบอร์ขนส่งเพื่อประสานหน้างาน แต่ข้อตกลงหลักควรอยู่ใน FarmLink",
    delivery_in_progress: "ผู้ขายควรอัปโหลดหลักฐานส่งมอบ เช่น รูปสินค้า ใบน้ำหนัก หรือใบส่งของ",
    delivery_proof_uploaded: "ผู้ซื้อควรตรวจสอบหลักฐานและกดยืนยันรับสินค้าในระบบ",
    buyer_confirmed_delivery: "เข้าสู่ช่วงชำระเงิน ควรส่งหลักฐานชำระเงินและยืนยันรับเงินผ่านระบบ",
    payment_proof_uploaded: "ผู้ขายควรตรวจสอบยอดเงินและกดยืนยันได้รับเงินเมื่อถูกต้อง",
    seller_confirmed_payment: "ธุรกรรมใกล้เสร็จสมบูรณ์ ผู้ซื้อสามารถรีวิวหลังการส่งมอบได้",
    review_completed: "รีวิวถูกบันทึกเป็นสัญญาณความน่าเชื่อถือของผู้ขาย",
    closed: "ธุรกรรมถูกปิดพร้อม audit trail สำหรับตรวจสอบย้อนหลัง",
  };

  return (
    <div className="mt-4 rounded-md border border-[#DDE7E3] bg-white p-3 text-sm text-slate-700">
      <p className="font-bold text-[#0F172A]">คำแนะนำตามขั้นตอนสำหรับ{roleLabels[currentUser.role]}</p>
      <p className="mt-1">{hints[currentStep.key]}</p>
    </div>
  );
}


function ChatModal({
  thread,
  currentUser,
  messages,
  relatedRequest,
  relatedOrder,
  reviews = [],
  onSend,
  onMarkRead,
  onCreatePoSo,
  onSubmitChatReview,
  onClose,
}: {
  thread: ChatThread;
  currentUser: User;
  messages: ChatMessage[];
  relatedRequest?: PurchaseRequest;
  relatedOrder?: Order;
  reviews?: BuyerReview[];
  onSend: (message: string, options?: ChatSendOptions) => void;
  onMarkRead: (threadId: string) => void;
  onCreatePoSo?: (
    thread: ChatThread,
    request?: PurchaseRequest
  ) => { poId: string; soId: string; created: boolean } | null;
  onSubmitChatReview?: (order: Order, form: ReviewFormState) => void;
  onClose: () => void;
}) {
  const [message, setMessage] = useState("");
  const [lastRefreshedAt, setLastRefreshedAt] = useState(() => new Date());
  const [sellerGuidedReply, setSellerGuidedReply] = useState({
    deliveryRound: "รอบส่งถัดไปภายใน 1-2 วันทำการ",
    deliveryMethod: "ผู้ขายจัดส่งเอง",
    shippingCondition: "จัดส่งในจังหวัดเดียวกันเมื่อถึงขั้นต่ำ",
    shippingFeePolicy: "ค่าขนส่งรวมในราคาแล้ว",
    minimumDelivery: relatedRequest ? `${relatedRequest.quantity.toLocaleString("th-TH")} ${relatedRequest.unit}` : "ตามเงื่อนไขสินค้า",
    documents: "รูปสินค้าก่อนส่ง, ใบน้ำหนัก, ใบส่งของ",
    note: "",
  });
  const [selectedTradeDocument, setSelectedTradeDocument] = useState<TradeDocumentSelection | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    onSend(trimmedMessage);
    setMessage("");
    setLastRefreshedAt(new Date());
  };

  const sortedMessages = [...messages].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const existingDeliveryProofEntries = useMemo(() => {
    const fingerprintPattern = /รหัสตรวจภาพภายใน:\s*([^\n]+)/g;

    return sortedMessages.flatMap((item) => {
      const fingerprints: string[] = [];
      let match = fingerprintPattern.exec(item.message);

      while (match) {
        fingerprints.push(
          ...match[1]
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean)
        );
        match = fingerprintPattern.exec(item.message);
      }

      return fingerprints.map((fingerprint) => ({
        fingerprint,
        createdAt: item.createdAt,
      }));
    });
  }, [sortedMessages]);

  const hasDuplicateProofAfterDelay = (fingerprint: string) => {
    const now = Date.now();

    return existingDeliveryProofEntries.some((entry) => {
      if (entry.fingerprint !== fingerprint) return false;

      const createdAtTime = new Date(entry.createdAt).getTime();

      if (Number.isNaN(createdAtTime)) return false;

      return now - createdAtTime >= DELIVERY_PROOF_DUPLICATE_DELAY_MS;
    });
  };


  const latestBuyerMessage = [...sortedMessages]
    .reverse()
    .find((item) => item.senderRole === "buyer" && item.messageType === "user_message");

  const sellerHasRepliedAfterLatestBuyerMessage = latestBuyerMessage
    ? sortedMessages.some(
        (item) =>
          item.senderRole === "seller" &&
          item.messageType === "user_message" &&
          item.createdAt > latestBuyerMessage.createdAt
      )
    : false;

  const latestBuyerMessageIsTermsAccepted =
    latestBuyerMessage?.message.includes("ผู้ซื้อยืนยันเงื่อนไข") ?? false;

  const latestBuyerMessageIsRequestCancelled =
    latestBuyerMessage?.message.includes("ผู้ซื้อยกเลิกคำขอซื้อ") ?? false;

  const latestBuyerMessageIsFormalOfferAccepted =
    latestBuyerMessage?.message.includes("ผู้ซื้อยืนยันข้อเสนอขายอย่างเป็นทางการ") ?? false;

  const latestBuyerMessageIsFormalOfferRevision =
    latestBuyerMessage?.message.includes("ผู้ซื้อขอแก้ไขข้อเสนอขายอย่างเป็นทางการ") ?? false;

  const latestBuyerMessageIsFormalOfferCancelled =
    latestBuyerMessage?.message.includes("ผู้ซื้อยกเลิกข้อเสนอขายอย่างเป็นทางการ") ?? false;

  const latestBuyerMessageIsDeliveryProofAccepted =
    latestBuyerMessage?.message.includes("ผู้ซื้อยืนยันการตรวจสอบข้อมูลจัดส่งและหลักฐานเบื้องต้น") ?? false;

  const latestBuyerMessageIsDeliveryCorrectionRequest =
    latestBuyerMessage?.message.includes("ผู้ซื้อขอให้ผู้ขายแก้ไขหรือส่งหลักฐานใหม่") ?? false;

  const latestBuyerMessageIsDeliveryReceived =
    latestBuyerMessage?.message.includes("ผู้ซื้อยืนยันรับสินค้า") ?? false;

  const latestBuyerMessageIsDeliveryIssueReported =
    latestBuyerMessage?.message.includes("ผู้ซื้อแจ้งปัญหาการรับสินค้า") ?? false;

  const latestBuyerMessageIsPaymentProofSubmitted =
    latestBuyerMessage?.message.includes("ผู้ซื้อส่งหลักฐานการชำระเงิน") ?? false;

  const latestBuyerMessageIsReviewSubmitted =
    latestBuyerMessage?.message.includes("ผู้ซื้อส่งรีวิวหลังธุรกรรม") ||
    latestBuyerMessage?.message.includes("ผู้ซื้อรีวิวสินค้าและผู้ขาย") ||
    latestBuyerMessage?.message.includes("สถานะ: รีวิวแล้ว") ||
    false;

  const hasChatMovedBeyondInitialTerms = sortedMessages.some(
    (item) =>
      item.messageType === "user_message" &&
      (item.message.includes("ผู้ขายส่งข้อเสนอขายอย่างเป็นทางการ") ||
        item.message.includes("ผู้ซื้อยืนยันข้อเสนอขายอย่างเป็นทางการ") ||
        item.message.includes("ผู้ขายยืนยันรับคำสั่งซื้อและระบบสร้าง PO / SO") ||
        item.message.includes("PO ฝั่งผู้ซื้อ:") ||
        item.message.includes("SO ฝั่งผู้ขาย:") ||
        item.message.includes("ผู้ขายแจ้งดำเนินการส่งสินค้า") ||
        item.message.includes("ผู้ซื้อยืนยันการตรวจสอบข้อมูลจัดส่งและหลักฐานเบื้องต้น") ||
        item.message.includes("ผู้ซื้อยืนยันรับสินค้า") ||
        item.message.includes("ผู้ขายส่งข้อมูลการโอนชำระเงิน") ||
        item.message.includes("ผู้ซื้อส่งหลักฐานการชำระเงิน") ||
        item.message.includes("ผู้ขายยืนยันได้รับเงิน") ||
        item.message.includes("ผู้ซื้อส่งรีวิวหลังธุรกรรม") ||
        item.message.includes("ผู้ซื้อรีวิวสินค้าและผู้ขาย") ||
        item.message.includes("สถานะ: รีวิวแล้ว"))
  );

  const shouldShowSellerGuidedReply =
    currentUser.role === "seller" &&
    Boolean(relatedRequest) &&
    Boolean(latestBuyerMessage) &&
    !hasChatMovedBeyondInitialTerms &&
    !latestBuyerMessageIsTermsAccepted &&
    !latestBuyerMessageIsRequestCancelled &&
    !latestBuyerMessageIsFormalOfferAccepted &&
    !latestBuyerMessageIsFormalOfferRevision &&
    !latestBuyerMessageIsFormalOfferCancelled &&
    !latestBuyerMessageIsDeliveryProofAccepted &&
    !latestBuyerMessageIsDeliveryCorrectionRequest &&
    !latestBuyerMessageIsDeliveryReceived &&
    !latestBuyerMessageIsDeliveryIssueReported &&
    !latestBuyerMessageIsPaymentProofSubmitted &&
    !latestBuyerMessageIsReviewSubmitted &&
    !sellerHasRepliedAfterLatestBuyerMessage;

  const latestSellerTermsMessage = [...sortedMessages]
    .reverse()
    .find(
      (item) =>
        item.senderRole === "seller" &&
        item.messageType === "user_message" &&
        item.message.includes("ผู้ขายตอบกลับเงื่อนไขเบื้องต้น")
    );

  const buyerHasRespondedToLatestSellerTerms = latestSellerTermsMessage
    ? sortedMessages.some(
        (item) =>
          item.senderRole === "buyer" &&
          item.messageType === "user_message" &&
          item.createdAt > latestSellerTermsMessage.createdAt &&
          (item.message.includes("ผู้ซื้อยืนยันเงื่อนไข") ||
            item.message.includes("ผู้ซื้อขอแก้ไขเงื่อนไข") ||
            item.message.includes("ผู้ซื้อยกเลิกคำขอซื้อ"))
      )
    : false;

  const shouldShowBuyerTermsActionCard =
    currentUser.role === "buyer" &&
    Boolean(relatedRequest) &&
    Boolean(latestSellerTermsMessage) &&
    !buyerHasRespondedToLatestSellerTerms;

  const latestBuyerTermsAcceptedMessage = [...sortedMessages]
    .reverse()
    .find(
      (item) =>
        item.senderRole === "buyer" &&
        item.messageType === "user_message" &&
        item.message.includes("ผู้ซื้อยืนยันเงื่อนไข")
    );

  const latestBuyerFormalOfferRevisionMessage = [...sortedMessages]
    .reverse()
    .find(
      (item) =>
        item.senderRole === "buyer" &&
        item.messageType === "user_message" &&
        item.message.includes("ผู้ซื้อขอแก้ไขข้อเสนอขายอย่างเป็นทางการ")
    );

  const latestBuyerAcceptedFormalOfferMessage = [...sortedMessages]
    .reverse()
    .find(
      (item) =>
        item.senderRole === "buyer" &&
        item.messageType === "user_message" &&
        item.message.includes("ผู้ซื้อยืนยันข้อเสนอขายอย่างเป็นทางการ")
    );

  const latestSellerFormalOfferMessage = [...sortedMessages]
    .reverse()
    .find(
      (item) =>
        item.senderRole === "seller" &&
        item.messageType === "user_message" &&
        item.message.includes("ผู้ขายส่งข้อเสนอขายอย่างเป็นทางการ")
    );

  const sellerHasSentFormalOfferAfterBuyerAccepted = latestBuyerTermsAcceptedMessage
    ? sortedMessages.some(
        (item) =>
          item.senderRole === "seller" &&
          item.messageType === "user_message" &&
          item.createdAt > latestBuyerTermsAcceptedMessage.createdAt &&
          item.message.includes("ผู้ขายส่งข้อเสนอขายอย่างเป็นทางการ")
      )
    : false;

  const sellerHasSentFormalOfferAfterLatestRevision = latestBuyerFormalOfferRevisionMessage
    ? sortedMessages.some(
        (item) =>
          item.senderRole === "seller" &&
          item.messageType === "user_message" &&
          item.createdAt > latestBuyerFormalOfferRevisionMessage.createdAt &&
          item.message.includes("ผู้ขายส่งข้อเสนอขายอย่างเป็นทางการ")
      )
    : false;

  const shouldShowSellerFormalOfferActionCard =
    currentUser.role === "seller" &&
    Boolean(relatedRequest) &&
    ((Boolean(latestBuyerTermsAcceptedMessage) && !sellerHasSentFormalOfferAfterBuyerAccepted) ||
      (Boolean(latestBuyerFormalOfferRevisionMessage) && !sellerHasSentFormalOfferAfterLatestRevision));

  const buyerHasRespondedToLatestFormalOffer = latestSellerFormalOfferMessage
    ? sortedMessages.some(
        (item) =>
          item.senderRole === "buyer" &&
          item.messageType === "user_message" &&
          item.createdAt > latestSellerFormalOfferMessage.createdAt &&
          (item.message.includes("ผู้ซื้อยืนยันข้อเสนอขายอย่างเป็นทางการ") ||
            item.message.includes("ผู้ซื้อขอแก้ไขข้อเสนอขายอย่างเป็นทางการ") ||
            item.message.includes("ผู้ซื้อยกเลิกข้อเสนอขายอย่างเป็นทางการ"))
      )
    : false;

  const shouldShowBuyerFormalOfferActionCard =
    currentUser.role === "buyer" &&
    Boolean(relatedRequest) &&
    Boolean(latestSellerFormalOfferMessage) &&
    !buyerHasRespondedToLatestFormalOffer;

  const sellerHasCreatedPoSoInChatAfterBuyerAccepted = latestBuyerAcceptedFormalOfferMessage
    ? sortedMessages.some(
        (item) =>
          item.senderRole === "seller" &&
          item.messageType === "user_message" &&
          item.createdAt > latestBuyerAcceptedFormalOfferMessage.createdAt &&
          (item.message.includes("ผู้ขายยืนยันรับคำสั่งซื้อและระบบสร้าง PO / SO") ||
            item.message.includes("PO ฝั่งผู้ซื้อ:") ||
            item.message.includes("SO ฝั่งผู้ขาย:") ||
            item.message.includes("ระบบสร้าง PO / SO แล้ว"))
      )
    : false;

  const shouldShowSellerAfterBuyerAcceptedOfferActionCard =
    currentUser.role === "seller" &&
    Boolean(relatedRequest) &&
    Boolean(latestBuyerAcceptedFormalOfferMessage) &&
    !sellerHasCreatedPoSoInChatAfterBuyerAccepted;

  const latestPoSoCreatedMessage = [...sortedMessages]
    .reverse()
    .find(
      (item) =>
        item.messageType === "user_message" &&
        (item.message.includes("ผู้ขายยืนยันรับคำสั่งซื้อและระบบสร้าง PO / SO") ||
          item.message.includes("PO ฝั่งผู้ซื้อ:") ||
          item.message.includes("SO ฝั่งผู้ขาย:") ||
          item.message.includes("ระบบสร้าง PO / SO แล้ว"))
    );

  const latestSellerDeliveryPlanMessage = latestPoSoCreatedMessage
    ? [...sortedMessages]
        .reverse()
        .find(
          (item) =>
            item.senderRole === "seller" &&
            item.messageType === "user_message" &&
            item.createdAt > latestPoSoCreatedMessage.createdAt &&
            item.message.includes("ผู้ขายแจ้งดำเนินการส่งสินค้า")
        )
    : undefined;

  const latestBuyerDeliveryCorrectionRequest = latestSellerDeliveryPlanMessage
    ? [...sortedMessages]
        .reverse()
        .find(
          (item) =>
            item.senderRole === "buyer" &&
            item.messageType === "user_message" &&
            item.createdAt > latestSellerDeliveryPlanMessage.createdAt &&
            item.message.includes("ผู้ซื้อขอให้ผู้ขายแก้ไขหรือส่งหลักฐานใหม่")
        )
    : undefined;

  const latestBuyerDeliveryProofAccepted = latestSellerDeliveryPlanMessage
    ? [...sortedMessages]
        .reverse()
        .find(
          (item) =>
            item.senderRole === "buyer" &&
            item.messageType === "user_message" &&
            item.createdAt > latestSellerDeliveryPlanMessage.createdAt &&
            item.message.includes("ผู้ซื้อยืนยันการตรวจสอบข้อมูลจัดส่งและหลักฐานเบื้องต้น")
        )
    : undefined;

  const sellerHasSentDeliveryPlanAfterPoSo = Boolean(latestSellerDeliveryPlanMessage);

  const latestBuyerDeliveryProofAcceptedIsAfterCorrection =
    Boolean(latestBuyerDeliveryProofAccepted) &&
    (!latestBuyerDeliveryCorrectionRequest ||
      latestBuyerDeliveryProofAccepted!.createdAt > latestBuyerDeliveryCorrectionRequest.createdAt);

  const latestBuyerConfirmedDeliveryMessage = latestBuyerDeliveryProofAccepted
    ? [...sortedMessages]
        .reverse()
        .find(
          (item) =>
            item.senderRole === "buyer" &&
            item.messageType === "user_message" &&
            item.createdAt > latestBuyerDeliveryProofAccepted.createdAt &&
            item.message.includes("ผู้ซื้อยืนยันรับสินค้า")
        )
    : undefined;

  const latestBuyerDeliveryIssueMessage = latestBuyerDeliveryProofAccepted
    ? [...sortedMessages]
        .reverse()
        .find(
          (item) =>
            item.senderRole === "buyer" &&
            item.messageType === "user_message" &&
            item.createdAt > latestBuyerDeliveryProofAccepted.createdAt &&
            item.message.includes("ผู้ซื้อแจ้งปัญหาการรับสินค้า")
        )
    : undefined;

  const latestSellerPaymentInstructionMessage = latestBuyerConfirmedDeliveryMessage
    ? [...sortedMessages]
        .reverse()
        .find(
          (item) =>
            item.senderRole === "seller" &&
            item.messageType === "user_message" &&
            item.createdAt > latestBuyerConfirmedDeliveryMessage.createdAt &&
            item.message.includes("ผู้ขายส่งข้อมูลการโอนชำระเงิน")
        )
    : undefined;

  const latestBuyerPaymentProofMessage = latestSellerPaymentInstructionMessage
    ? [...sortedMessages]
        .reverse()
        .find(
          (item) =>
            item.senderRole === "buyer" &&
            item.messageType === "user_message" &&
            item.createdAt > latestSellerPaymentInstructionMessage.createdAt &&
            item.message.includes("ผู้ซื้อส่งหลักฐานการชำระเงิน")
        )
    : undefined;

  const latestSellerPaymentConfirmedMessage = [...sortedMessages]
    .reverse()
    .find(
      (item) =>
        item.senderRole === "seller" &&
        item.messageType === "user_message" &&
        (item.message.includes("ผู้ขายยืนยันได้รับเงิน") ||
          item.message.includes("ผู้ขายยืนยันรับเงิน") ||
          item.message.includes("ได้รับเงินแล้ว"))
    );

  const latestBuyerReviewMessage = latestSellerPaymentConfirmedMessage
    ? [...sortedMessages]
        .reverse()
        .find(
          (item) =>
            item.senderRole === "buyer" &&
            item.messageType === "user_message" &&
            item.createdAt > latestSellerPaymentConfirmedMessage.createdAt &&
            (item.message.includes("ผู้ซื้อส่งรีวิวหลังธุรกรรม") ||
              item.message.includes("ผู้ซื้อรีวิวสินค้าและผู้ขาย"))
        )
    : undefined;

  const hasBuyerReviewedRelatedOrder = Boolean(
    relatedOrder &&
      reviews.some(
        (review) =>
          review.orderId === relatedOrder.id &&
          review.buyerId === currentUser.id &&
          review.status !== "hidden"
      )
  );

  const shouldShowBuyerReviewCard =
    currentUser.role === "buyer" &&
    Boolean(latestSellerPaymentConfirmedMessage) &&
    !latestBuyerReviewMessage &&
    !hasBuyerReviewedRelatedOrder;

  const shouldShowSellerPaymentInstructionCard =
    currentUser.role === "seller" &&
    Boolean(latestBuyerConfirmedDeliveryMessage) &&
    !latestSellerPaymentInstructionMessage &&
    !latestBuyerDeliveryIssueMessage;

  const shouldShowBuyerPaymentProofCard =
    currentUser.role === "buyer" &&
    Boolean(latestSellerPaymentInstructionMessage) &&
    !latestBuyerPaymentProofMessage;

  const shouldShowSellerConfirmPaymentCard =
    currentUser.role === "seller" &&
    Boolean(latestBuyerPaymentProofMessage) &&
    !latestSellerPaymentConfirmedMessage;

  const shouldShowBuyerReceiveGoodsCard =
    currentUser.role === "buyer" &&
    latestBuyerDeliveryProofAcceptedIsAfterCorrection &&
    !latestBuyerConfirmedDeliveryMessage &&
    !latestBuyerDeliveryIssueMessage;

  const shouldShowSellerDeliveryActionCard =
    currentUser.role === "seller" &&
    Boolean(latestPoSoCreatedMessage) &&
    !shouldShowSellerAfterBuyerAcceptedOfferActionCard &&
    !latestBuyerDeliveryProofAcceptedIsAfterCorrection &&
    (!sellerHasSentDeliveryPlanAfterPoSo ||
      (Boolean(latestBuyerDeliveryCorrectionRequest) &&
        (!latestBuyerDeliveryProofAccepted ||
          latestBuyerDeliveryCorrectionRequest!.createdAt > latestBuyerDeliveryProofAccepted.createdAt)));

  const shouldShowBuyerDeliveryProofReviewCard =
    currentUser.role === "buyer" &&
    Boolean(latestSellerDeliveryPlanMessage) &&
    !latestBuyerDeliveryCorrectionRequest &&
    !latestBuyerDeliveryProofAccepted;

  const [formalOffer, setFormalOffer] = useState({
    quantity: relatedRequest ? `${relatedRequest.quantity.toLocaleString("th-TH")} ${relatedRequest.unit}` : "",
    pricePerUnit: relatedRequest?.targetPrice || "",
    shippingCost: "ตามเงื่อนไขที่ตกลงในแชท",
    deliveryDate: relatedRequest?.deliveryDate || "",
    paymentTerms: "ชำระหลังผู้ซื้อยืนยันรับสินค้าและตรวจสอบหลักฐานส่งมอบ",
    note: "ข้อเสนอนี้เป็นข้อเสนอขายอย่างเป็นทางการ ผู้ซื้อยืนยันแล้วระบบจึงสร้างคำสั่งซื้อ",
  });

  const [buyerRevisionMode, setBuyerRevisionMode] = useState(false);
  const [buyerRevision, setBuyerRevision] = useState({
    topic: "รอบการส่ง",
    currentTerms: "ตามเงื่อนไขที่ผู้ขายเสนอ",
    requestedTerms: "ขอเปลี่ยนเป็นรอบส่งใหม่",
    note: "",
  });

  const [formalOfferRevisionMode, setFormalOfferRevisionMode] = useState(false);
  const [formalOfferRevision, setFormalOfferRevision] = useState({
    topic: "รอบการส่ง",
    currentTerms: "ตามข้อเสนอขายอย่างเป็นทางการ",
    requestedTerms: "ขอปรับรอบส่งใหม่",
    note: "",
  });

  const [deliveryPlan, setDeliveryPlan] = useState({
    preparationStatus: "เตรียมสินค้า / คัดเกรดตามคำสั่งซื้อแล้ว",
    deliverySchedule: relatedRequest?.deliveryDate || relatedOrder?.deliveryDate || "ตามวันที่ตกลงใน PO/SO",
    transportMethod: "ผู้ขายจัดส่งเองตามเงื่อนไขที่ตกลงในระบบ",
    deliveryContactName: "ผู้ประสานงานขนส่งของผู้ขาย",
    deliveryContactPhone: "ระบุเบอร์ติดต่อสำหรับขนส่งหลังสร้าง PO/SO",
    deliveryLocation: relatedRequest?.deliveryLocation || "ตามสถานที่รับสินค้าที่ผู้ซื้อระบุ",
    deliveryDocuments: "รูปสินค้าก่อนส่ง, รูปขณะโหลด, ใบน้ำหนัก, ใบส่งของ",
    note: "",
  });

  const [deliveryCorrection, setDeliveryCorrection] = useState({
    issueType: "รูปถ่ายไม่ชัดเจน / ต้องการรูปใหม่",
    detail: "กรุณาส่งรูปถ่ายหรือเอกสารใหม่เพื่อให้ตรวจสอบก่อนยืนยันรับสินค้า",
  });

  const [paymentInstruction, setPaymentInstruction] = useState({
    bankName: "กรุณาระบุธนาคาร",
    accountName: "ชื่อบัญชีผู้ขาย",
    accountNumber: "กรุณาระบุเลขบัญชี",
    amount: "ตามยอด PO/SO ที่ตกลงไว้",
    paymentDue: "ชำระหลังผู้ซื้อยืนยันรับสินค้า",
    note: "กรุณาอัปโหลดหลักฐานชำระเงินในแชท FarmLink หลังโอนเสร็จ",
  });

  const [paymentProof, setPaymentProof] = useState({
    paidAmount: "ตามยอดที่ผู้ขายแจ้ง",
    paidAt: "",
    reference: "",
    note: "ชำระเงินตามข้อมูลบัญชีที่ผู้ขายแจ้งในระบบ",
  });

  const [chatReview, setChatReview] = useState<ReviewFormState>({
    qualityRating: 5,
    deliveryRating: 5,
    documentRating: 5,
    comment: "",
  });

  const [paymentProofFiles, setPaymentProofFiles] = useState<
    Array<{
      name: string;
      size: number;
      type: string;
      fingerprint: string;
      previewUrl?: string;
    }>
  >([]);

  const [deliveryProofImages, setDeliveryProofImages] = useState<
    Array<{
      name: string;
      size: number;
      type: string;
      fingerprint: string;
      previewUrl: string;
      duplicate: boolean;
      duplicateStatus: ProofDuplicateStatus;
    }>
  >([]);
  const [deliveryProofDocuments, setDeliveryProofDocuments] = useState<
    Array<{
      name: string;
      size: number;
      type: string;
      fingerprint: string;
      previewUrl?: string;
      duplicate: boolean;
      duplicateStatus: ProofDuplicateStatus;
    }>
  >([]);

  const duplicateDeliveryProofImages = deliveryProofImages.filter((item) => item.duplicate);


  const updateSellerGuidedReply = (key: keyof typeof sellerGuidedReply, value: string) => {
    setSellerGuidedReply((current) => ({ ...current, [key]: value }));
  };

  const updateBuyerRevision = (key: keyof typeof buyerRevision, value: string) => {
    setBuyerRevision((current) => ({ ...current, [key]: value }));
  };

  const updateFormalOfferRevision = (key: keyof typeof formalOfferRevision, value: string) => {
    setFormalOfferRevision((current) => ({ ...current, [key]: value }));
  };

  const updateFormalOffer = (key: keyof typeof formalOffer, value: string) => {
    setFormalOffer((current) => ({ ...current, [key]: value }));
  };

  const updateDeliveryPlan = (key: keyof typeof deliveryPlan, value: string) => {
    setDeliveryPlan((current) => ({ ...current, [key]: value }));
  };

  const updateDeliveryCorrection = (key: keyof typeof deliveryCorrection, value: string) => {
    setDeliveryCorrection((current) => ({ ...current, [key]: value }));
  };

  const updatePaymentInstruction = (key: keyof typeof paymentInstruction, value: string) => {
    setPaymentInstruction((current) => ({ ...current, [key]: value }));
  };

  const updatePaymentProof = (key: keyof typeof paymentProof, value: string) => {
    setPaymentProof((current) => ({ ...current, [key]: value }));
  };

  const updateChatReview = (key: keyof ReviewFormState, value: string) => {
    if (key === "comment") {
      setChatReview((current) => ({ ...current, comment: value }));
      return;
    }

    setChatReview((current) => ({
      ...current,
      [key]: Math.min(Math.max(Number(value) || 1, 1), 5),
    }));
  };


  const getProofFingerprint = (file: File) => {
    return `${file.name}-${file.size}-${file.lastModified}`;
  };

  const fileToDataUrl = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const imageFileToChatPreviewUrl = async (file: File) => {
    const originalDataUrl = await fileToDataUrl(file);

    return new Promise<string>((resolve) => {
      const image = new Image();

      image.onload = () => {
        const maxSize = 720;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          resolve(originalDataUrl);
          return;
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);

        const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
        const previewUrl = canvas.toDataURL(outputType, 0.72);

        resolve(previewUrl || originalDataUrl);
      };

      image.onerror = () => resolve(originalDataUrl);
      image.src = originalDataUrl;
    });
  };

  const handleDeliveryProofImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`ไฟล์ ${file.name} ไม่ใช่รูปภาพที่รองรับ กรุณาใช้ JPG, PNG หรือ WebP`);
        return false;
      }

      if (file.size > 8 * 1024 * 1024) {
        alert(`ไฟล์ ${file.name} มีขนาดเกิน 8MB`);
        return false;
      }

      return true;
    });

    const filesWithPreview = await Promise.all(
      validFiles.map(async (file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        fingerprint: getProofFingerprint(file),
        previewUrl: await imageFileToChatPreviewUrl(file),
      }))
    );

    setDeliveryProofImages((current) => {
      const currentFingerprints = current.map((item) => item.fingerprint);
      const batchCounts = filesWithPreview.reduce<Record<string, number>>((acc, item) => {
        acc[item.fingerprint] = (acc[item.fingerprint] || 0) + 1;
        return acc;
      }, {});

      return [
        ...current,
        ...filesWithPreview.map((item) => {
          const duplicateByHistory = hasDuplicateProofAfterDelay(item.fingerprint);
          const duplicateInCurrentSelection =
            currentFingerprints.includes(item.fingerprint) || batchCounts[item.fingerprint] > 1;
          const duplicate = duplicateByHistory || duplicateInCurrentSelection;

          return {
            ...item,
            duplicate,
            duplicateStatus: duplicate ? "duplicate" : "pending_24h",
          };
        }),
      ];
    });

    event.target.value = "";
  };

  const handleDeliveryProofDocuments = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`ไฟล์ ${file.name} ไม่ใช่เอกสารที่รองรับ กรุณาใช้ PDF, JPG, PNG หรือ WebP`);
        return false;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert(`ไฟล์ ${file.name} มีขนาดเกิน 10MB`);
        return false;
      }

      return true;
    });

    const filesWithPreview = await Promise.all(
      validFiles.map(async (file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        fingerprint: getProofFingerprint(file),
        previewUrl: file.type.startsWith("image/") ? await imageFileToChatPreviewUrl(file) : undefined,
      }))
    );

    setDeliveryProofDocuments((current) => {
      const currentFingerprints = current.map((item) => item.fingerprint);
      const batchCounts = filesWithPreview.reduce<Record<string, number>>((acc, item) => {
        acc[item.fingerprint] = (acc[item.fingerprint] || 0) + 1;
        return acc;
      }, {});

      return [
        ...current,
        ...filesWithPreview.map((item) => {
          const duplicateByHistory = hasDuplicateProofAfterDelay(item.fingerprint);
          const duplicateInCurrentSelection =
            currentFingerprints.includes(item.fingerprint) || batchCounts[item.fingerprint] > 1;
          const duplicate = duplicateByHistory || duplicateInCurrentSelection;

          return {
            ...item,
            duplicate,
            duplicateStatus: duplicate ? "duplicate" : "pending_24h",
          };
        }),
      ];
    });

    event.target.value = "";
  };

  const handlePaymentProofFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`ไฟล์ ${file.name} ไม่ใช่สลิปหรือหลักฐานที่รองรับ กรุณาใช้ PDF, JPG, PNG หรือ WebP`);
        return false;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert(`ไฟล์ ${file.name} มีขนาดเกิน 10MB`);
        return false;
      }

      return true;
    });

    const filesWithPreview = await Promise.all(
      validFiles.map(async (file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        fingerprint: getProofFingerprint(file),
        previewUrl: file.type.startsWith("image/") ? await imageFileToChatPreviewUrl(file) : undefined,
      }))
    );

    setPaymentProofFiles((current) => [...current, ...filesWithPreview]);
    event.target.value = "";
  };

  const sendSellerDeliveryPlan = () => {
    const imageNames = deliveryProofImages.map((item) => item.name);
    const documentNames = deliveryProofDocuments.map((item) => item.name);
    const duplicateImageNames = duplicateDeliveryProofImages.map((item) => item.name);

    const imageAttachmentLines = deliveryProofImages.map(
      (item) =>
        `[[FARMLINK_IMAGE|${encodeURIComponent(item.name)}|${encodeURIComponent(item.previewUrl)}|${encodeURIComponent(item.fingerprint)}|${item.duplicateStatus || (item.duplicate ? "duplicate" : "pending_24h")}]]`
    );
    const documentAttachmentLines = deliveryProofDocuments.map(
      (item) =>
        `[[FARMLINK_DOC|${encodeURIComponent(item.name)}|${encodeURIComponent(item.type)}|${encodeURIComponent(item.fingerprint)}|${item.duplicateStatus || (item.duplicate ? "duplicate" : "pending_24h")}|${encodeURIComponent(item.previewUrl || "")}]]`
    );

    const reply = [
      `ผู้ขายแจ้งดำเนินการส่งสินค้าสำหรับ ${relatedRequest?.productName || relatedOrder?.productName || "คำสั่งซื้อ"}`,
      ``,
      `สถานะการเตรียมสินค้า: ${deliveryPlan.preparationStatus}`,
      `รอบส่ง / กำหนดส่ง: ${deliveryPlan.deliverySchedule}`,
      `รูปแบบขนส่ง: ${deliveryPlan.transportMethod}`,
      `ผู้ประสานงานขนส่ง: ${deliveryPlan.deliveryContactName}`,
      `เบอร์ติดต่อสำหรับขนส่ง: ${deliveryPlan.deliveryContactPhone}`,
      `สถานที่รับ/ส่งสินค้า: ${deliveryPlan.deliveryLocation}`,
      `เอกสารและหลักฐานที่จะใช้ส่งมอบ: ${deliveryPlan.deliveryDocuments}`,
      `รูปถ่ายหลักฐานที่แนบ: ${imageNames.length ? imageNames.join(", ") : "ยังไม่ได้แนบรูปถ่าย"}`,
      ...imageAttachmentLines,
      `เอกสารที่แนบ: ${documentNames.length ? documentNames.join(", ") : "ยังไม่ได้แนบเอกสาร"}`,
      ...documentAttachmentLines,
      duplicateImageNames.length
        ? `Agentic ตรวจสอบรูปถ่าย: พบความเสี่ยงรูปซ้ำที่ผ่านระยะตรวจย้อนหลัง 24 ชั่วโมงแล้ว (${duplicateImageNames.join(", ")}) กรุณาให้ผู้ขายส่งรูปใหม่ หรือให้ผู้ซื้อ/แอดมินตรวจสอบก่อนยืนยัน`
        : `Agentic ตรวจสอบรูปถ่าย: บันทึกรูปแล้ว และจะตรวจซ้ำกับหลักฐานเก่าหลังครบ 24 ชั่วโมงเพื่อป้องกันการนำรูปเดิมมาใช้ซ้ำ`,
      imageNames.length ? `รหัสตรวจภาพภายใน: ${deliveryProofImages.map((item) => item.fingerprint).join(", ")}` : "",
      deliveryPlan.note ? `หมายเหตุเพิ่มเติม: ${deliveryPlan.note}` : "",
      ``,
      `ขั้นตอนถัดไป: ผู้ซื้อสามารถตรวจรูปถ่ายและเอกสารในแชท หากถูกต้องให้ยืนยันหลักฐานเบื้องต้น หากพบรูปซ้ำหรือข้อมูลผิดพลาดให้ขอให้ผู้ขายส่งใหม่/แก้ไขได้`,
    ]
      .filter(Boolean)
      .join("\n");

    onSend(reply, { skipRisk: true });
    setLastRefreshedAt(new Date());
  };

  const sendBuyerAcceptDeliveryProofSummary = () => {
    const reply = [
      `ผู้ซื้อยืนยันการตรวจสอบข้อมูลจัดส่งและหลักฐานเบื้องต้น`,
      ``,
      `ผู้ซื้อได้ตรวจสอบรูปถ่าย เอกสาร และสรุปการจัดส่งที่ผู้ขายส่งในแชทแล้ว`,
      `สถานะ: ยืนยันแล้ว`,
      `ขั้นตอนถัดไป: ผู้ขายสามารถดำเนินการส่งมอบตามเงื่อนไข และเมื่อส่งมอบเสร็จให้เข้าสู่ขั้นตอนหลักฐานส่งมอบ/ยืนยันรับสินค้าในระบบ`,
    ].join("\n");

    onSend(reply, { skipRisk: true });
    setLastRefreshedAt(new Date());
    window.setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 50);
  };

  const sendBuyerRequestDeliveryProofCorrection = () => {
    const reply = [
      `ผู้ซื้อขอให้ผู้ขายแก้ไขหรือส่งหลักฐานใหม่`,
      ``,
      `ประเด็นที่ต้องการแก้ไข: ${deliveryCorrection.issueType}`,
      `รายละเอียดเพิ่มเติม: ${deliveryCorrection.detail}`,
      ``,
      `สถานะ: ขอแก้ไขแล้ว`,
      `กรุณาให้ผู้ขายตรวจสอบรูปถ่าย เอกสาร หรือข้อมูลขนส่ง และส่งสรุปการจัดส่ง/หลักฐานใหม่อีกครั้งในแชท`,
    ].join("\n");

    onSend(reply, { skipRisk: true });
    setLastRefreshedAt(new Date());
    window.setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 50);
  };

  const sendBuyerConfirmGoodsReceived = () => {
    const reply = [
      `ผู้ซื้อยืนยันรับสินค้า`,
      ``,
      `ผู้ซื้อได้รับสินค้าและตรวจสอบเบื้องต้นตามหลักฐานส่งมอบแล้ว`,
      `สถานะ: รับสินค้าแล้ว`,
      `ขั้นตอนถัดไป: ผู้ขายต้องส่งข้อมูลบัญชี/เงื่อนไขการโอนชำระเงินในแชทนี้ก่อน จากนั้นผู้ซื้อจึงอัปโหลดหลักฐานชำระเงินตามเงื่อนไขที่ตกลงไว้`,
    ].join("\n");

    onSend(reply, { skipRisk: true });
    setLastRefreshedAt(new Date());
    window.setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 50);
  };

  const sendSellerPaymentInstruction = () => {
    const reply = [
      `ผู้ขายส่งข้อมูลการโอนชำระเงิน`,
      ``,
      `ยอดที่ต้องชำระ: ${paymentInstruction.amount}`,
      `ธนาคาร: ${paymentInstruction.bankName}`,
      `ชื่อบัญชี: ${paymentInstruction.accountName}`,
      `เลขบัญชี: ${paymentInstruction.accountNumber}`,
      `กำหนด / เงื่อนไขชำระเงิน: ${paymentInstruction.paymentDue}`,
      paymentInstruction.note ? `หมายเหตุ: ${paymentInstruction.note}` : "",
      ``,
      `ขั้นตอนถัดไป: ผู้ซื้อโอนชำระตามข้อมูลนี้และส่งหลักฐานการชำระเงินในแชท FarmLink เพื่อให้ผู้ขายตรวจสอบ`,
    ]
      .filter(Boolean)
      .join("\n");

    onSend(reply, { skipRisk: true });
    setLastRefreshedAt(new Date());
    window.setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 50);
  };

  const sendBuyerPaymentProof = () => {
    if (paymentProofFiles.length === 0) {
      alert("กรุณาแนบภาพสลิปหรือเอกสารหลักฐานการชำระเงินก่อนส่ง");
      return;
    }

    const paymentProofAttachmentLines = paymentProofFiles.map(
      (item) =>
        `[[FARMLINK_DOC|${encodeURIComponent(item.name)}|${encodeURIComponent(item.type)}|${encodeURIComponent(item.fingerprint)}|ok|${encodeURIComponent(item.previewUrl || "")}]]`
    );

    const reply = [
      `ผู้ซื้อส่งหลักฐานการชำระเงิน`,
      ``,
      `ยอดที่ชำระ: ${paymentProof.paidAmount}`,
      paymentProof.paidAt ? `วันที่/เวลาชำระเงิน: ${paymentProof.paidAt}` : "",
      paymentProof.reference ? `เลขอ้างอิง / หมายเลขสลิป: ${paymentProof.reference}` : "",
      `ไฟล์หลักฐานการชำระเงิน: ${paymentProofFiles.map((item) => item.name).join(", ")}`,
      ...paymentProofAttachmentLines,
      paymentProof.note ? `หมายเหตุ: ${paymentProof.note}` : "",
      ``,
      `สถานะ: ส่งหลักฐานชำระเงินแล้ว`,
      `ขั้นตอนถัดไป: ผู้ขายตรวจสอบหลักฐานและกดยืนยันว่าได้รับเงินครบถ้วนแล้ว`,
    ]
      .filter(Boolean)
      .join("\n");

    onSend(reply, { skipRisk: true });
    setPaymentProofFiles([]);
    setLastRefreshedAt(new Date());
    window.setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 50);
  };

  const sendSellerConfirmPayment = () => {
    const reply = [
      `ผู้ขายยืนยันได้รับเงิน`,
      ``,
      `ผู้ขายตรวจสอบหลักฐานการชำระเงินแล้ว และยืนยันว่าได้รับเงินตามเงื่อนไขที่ตกลงไว้`,
      `สถานะ: รับเงินแล้ว`,
      `ขั้นตอนถัดไป: ผู้ซื้อสามารถรีวิวสินค้าและผู้ขาย จากนั้นระบบจะปิดธุรกรรมพร้อมบันทึก audit trail`,
    ].join("\n");

    onSend(reply, { skipRisk: true });
    setLastRefreshedAt(new Date());
    window.setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 50);
  };

  const sendBuyerChatReview = () => {
    if (relatedOrder) {
      onSubmitChatReview?.(relatedOrder, chatReview);
    }

    const reply = [
      `ผู้ซื้อส่งรีวิวหลังธุรกรรม`,
      ``,
      `คะแนนคุณภาพสินค้า: ${chatReview.qualityRating}/5`,
      `คะแนนการส่งมอบ: ${chatReview.deliveryRating}/5`,
      `คะแนนเอกสาร: ${chatReview.documentRating}/5`,
      chatReview.comment.trim() ? `ความคิดเห็น: ${chatReview.comment.trim()}` : "ความคิดเห็น: ธุรกรรมนี้ส่งมอบสำเร็จและเอกสารครบถ้วน",
      ``,
      `สถานะ: รีวิวแล้ว`,
      `ขั้นตอนถัดไป: ระบบปิดธุรกรรมพร้อมบันทึก audit trail และนำรีวิวไปใช้เป็นสัญญาณความน่าเชื่อถือของผู้ขาย`,
    ].join("\n");

    onSend(reply, { skipRisk: true });
    setLastRefreshedAt(new Date());
    window.setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 50);
  };

  const sendBuyerReportDeliveryIssue = () => {
    const reply = [
      `ผู้ซื้อแจ้งปัญหาการรับสินค้า`,
      ``,
      `ผู้ซื้อพบปัญหาในการรับสินค้า หรือข้อมูลสินค้ายังไม่ตรงกับข้อตกลง`,
      `สถานะ: รอตรวจสอบปัญหา`,
      `ขั้นตอนถัดไป: ผู้ขายและผู้ซื้อควรตกลงแนวทางแก้ไขในแชทนี้ และหากยังตกลงไม่ได้ให้ส่งให้ผู้ดูแลระบบตรวจสอบ`,
    ].join("\n");

    onSend(reply, { skipRisk: true });
    setLastRefreshedAt(new Date());
    window.setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 50);
  };

  const sendSellerFormalOffer = () => {
    const reply = [
      `ผู้ขายส่งข้อเสนอขายอย่างเป็นทางการสำหรับ ${relatedRequest?.productName || "คำขอซื้อ"}`,
      ``,
      `ปริมาณเสนอขาย: ${formalOffer.quantity}`,
      `ราคาเสนอ: ${formalOffer.pricePerUnit}`,
      `ค่าขนส่ง: ${formalOffer.shippingCost}`,
      `วันส่งมอบ: ${formalOffer.deliveryDate}`,
      `เงื่อนไขชำระเงิน: ${formalOffer.paymentTerms}`,
      formalOffer.note ? `หมายเหตุ: ${formalOffer.note}` : "",
      ``,
      `ขั้นตอนถัดไป: ผู้ซื้อสามารถยืนยันข้อเสนอเพื่อให้ระบบสร้างคำสั่งซื้ออย่างเป็นทางการ`,
    ]
      .filter(Boolean)
      .join("\n");

    onSend(reply, { skipRisk: true });
    setLastRefreshedAt(new Date());
  };

  const sendBuyerAcceptFormalOffer = () => {
    const reply = [
      `ผู้ซื้อยืนยันข้อเสนอขายอย่างเป็นทางการสำหรับ ${relatedRequest?.productName || "คำขอซื้อ"}`,
      ``,
      `ยืนยันตามข้อเสนอขายอย่างเป็นทางการที่ผู้ขายส่งมา`,
      `ขั้นตอนถัดไป: ผู้ขายรับทราบการยืนยันข้อเสนอ แล้วระบบจะเข้าสู่ขั้นตอนสร้างคำสั่งซื้อเพื่อบันทึกข้อตกลงเรื่องราคา ปริมาณ ขนส่ง วันส่งมอบ และเงื่อนไขชำระเงิน`,
    ].join("\n");

    onSend(reply, { skipRisk: true });
    setFormalOfferRevisionMode(false);
    setLastRefreshedAt(new Date());
  };

  const sendSellerAcknowledgeBuyerAcceptedOffer = () => {
    const result = onCreatePoSo?.(thread, relatedRequest);

    const poId = result?.poId || "PO-รอสร้าง";
    const soId = result?.soId || "SO-รอสร้าง";

    const reply = [
      `ผู้ขายยืนยันรับคำสั่งซื้อและระบบสร้าง PO / SO สำหรับ ${relatedRequest?.productName || "คำขอซื้อ"}`,
      ``,
      `PO ฝั่งผู้ซื้อ: ${poId}`,
      `SO ฝั่งผู้ขาย: ${soId}`,
      `คลิกหมายเลข PO หรือ SO ในแชทเพื่อเปิดดูรายละเอียดเอกสาร`,
      ``,
      `ข้อตกลงเรื่องสินค้า ราคา ปริมาณ ขนส่ง วันส่งมอบ และเงื่อนไขชำระเงินถูกบันทึกในระบบแล้ว`,
      `ขั้นตอนถัดไป: ระบบเปิดขั้นตอนข้อมูลติดต่อขนส่ง และผู้ขายเตรียมสินค้า / อัปโหลดหลักฐานส่งมอบ`,
    ].join("\n");

    onSend(reply, { skipRisk: true });
    setLastRefreshedAt(new Date());
  };

  const sendBuyerFormalOfferRevisionRequest = () => {
    const reply = [
      `ผู้ซื้อขอแก้ไขข้อเสนอขายอย่างเป็นทางการสำหรับ ${relatedRequest?.productName || "คำขอซื้อ"}`,
      ``,
      `เรื่องที่ต้องการแก้ไข: ${formalOfferRevision.topic}`,
      `เงื่อนไขเดิม: ${formalOfferRevision.currentTerms}`,
      `เงื่อนไขที่ต้องการ: ${formalOfferRevision.requestedTerms}`,
      formalOfferRevision.note ? `หมายเหตุเพิ่มเติม: ${formalOfferRevision.note}` : "",
      ``,
      `กรุณาให้ผู้ขายตรวจสอบและส่งข้อเสนอขายฉบับใหม่กลับมาในแชท`,
    ]
      .filter(Boolean)
      .join("\n");

    onSend(reply, { skipRisk: true });
    setFormalOfferRevisionMode(false);
    setLastRefreshedAt(new Date());
  };

  const sendBuyerCancelFormalOffer = () => {
    const reply = [
      `ผู้ซื้อยกเลิกข้อเสนอขายอย่างเป็นทางการสำหรับ ${relatedRequest?.productName || "คำขอซื้อ"}`,
      ``,
      `เหตุผล: ยังไม่พร้อมยืนยันข้อเสนอขายในขณะนี้`,
    ].join("\n");

    onSend(reply, { skipRisk: true });
    setFormalOfferRevisionMode(false);
    setLastRefreshedAt(new Date());
  };

  const sendSellerGuidedReply = () => {
    const reply = [
      `ผู้ขายตอบกลับเงื่อนไขเบื้องต้นสำหรับ ${relatedRequest?.productName || "คำขอซื้อ"}`,
      ``,
      `รอบจัดส่ง: ${sellerGuidedReply.deliveryRound}`,
      `รูปแบบขนส่ง: ${sellerGuidedReply.deliveryMethod}`,
      `เงื่อนไขขนส่ง: ${sellerGuidedReply.shippingCondition}`,
      `ค่าขนส่ง: ${sellerGuidedReply.shippingFeePolicy}`,
      `ขั้นต่ำ/ปริมาณที่รองรับ: ${sellerGuidedReply.minimumDelivery}`,
      `เอกสารและหลักฐานที่จัดเตรียมได้: ${sellerGuidedReply.documents}`,
      sellerGuidedReply.note ? `หมายเหตุเพิ่มเติม: ${sellerGuidedReply.note}` : "",
      ``,
      `หากผู้ซื้อยอมรับเงื่อนไขนี้ กรุณากดยืนยันในขั้นตอนถัดไปเพื่อให้ผู้ขายส่งข้อเสนอขายอย่างเป็นทางการ`,
    ]
      .filter(Boolean)
      .join("\n");

    onSend(reply, { skipRisk: true });
    setLastRefreshedAt(new Date());
  };

  const sendBuyerAcceptTerms = () => {
    const reply = [
      `ผู้ซื้อยืนยันเงื่อนไขเบื้องต้นสำหรับ ${relatedRequest?.productName || "คำขอซื้อ"}`,
      ``,
      `ยืนยันตามเงื่อนไขที่ผู้ขายเสนอ`,
      `ขั้นตอนถัดไป: ผู้ขายสามารถส่งข้อเสนอขายอย่างเป็นทางการเพื่อให้ผู้ซื้อยืนยันเป็นคำสั่งซื้อ`,
    ].join("\n");

    onSend(reply, { skipRisk: true });
    setBuyerRevisionMode(false);
    setLastRefreshedAt(new Date());
  };

  const sendBuyerRevisionRequest = () => {
    const reply = [
      `ผู้ซื้อขอแก้ไขเงื่อนไขสำหรับ ${relatedRequest?.productName || "คำขอซื้อ"}`,
      ``,
      `เรื่องที่ต้องการแก้ไข: ${buyerRevision.topic}`,
      `เงื่อนไขเดิม: ${buyerRevision.currentTerms}`,
      `เงื่อนไขที่ต้องการ: ${buyerRevision.requestedTerms}`,
      buyerRevision.note ? `หมายเหตุเพิ่มเติม: ${buyerRevision.note}` : "",
      ``,
      `กรุณาให้ผู้ขายตรวจสอบและส่งเงื่อนไขใหม่กลับมาในแชท`,
    ]
      .filter(Boolean)
      .join("\n");

    onSend(reply, { skipRisk: true });
    setBuyerRevisionMode(false);
    setLastRefreshedAt(new Date());
  };

  const sendBuyerCancelRequest = () => {
    const reply = [
      `ผู้ซื้อยกเลิกคำขอซื้อสำหรับ ${relatedRequest?.productName || "คำขอซื้อ"}`,
      ``,
      `เหตุผล: ยังไม่พร้อมยืนยันเงื่อนไขในขณะนี้`,
    ].join("\n");

    onSend(reply, { skipRisk: true });
    setBuyerRevisionMode(false);
    setLastRefreshedAt(new Date());
  };

  const refreshMessages = () => {
    onMarkRead(thread.id);
    setLastRefreshedAt(new Date());
  };

  useEffect(() => {
    refreshMessages();
  }, [currentUser.id, messages.length, thread.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [sortedMessages.length]);

  const getReadReceiptLabel = (item: ChatMessage) => {
    if (item.senderId !== currentUser.id || item.messageType !== "user_message") return null;

    const recipientId =
      currentUser.role === "buyer"
        ? thread.sellerId
        : currentUser.role === "seller"
        ? thread.buyerId
        : undefined;

    if (!recipientId) return "ส่งแล้ว";

    return item.readBy?.includes(recipientId) ? "อ่านแล้ว" : "ส่งแล้ว";
  };

  const getDocumentIdsFromText = (value: string) => {
    const poId = value.match(/PO-\d{4}-\d{4}/)?.[0] || relatedOrder?.id;
    const soId =
      value.match(/SO-\d{4}-\d{4}/)?.[0] ||
      relatedOrder?.salesOrderId ||
      (poId ? poId.replace("PO-", "SO-") : undefined);

    return { poId, soId };
  };

  const renderChatMessageContent = (item: ChatMessage, isMine: boolean) => {
    const { poId, soId } = getDocumentIdsFromText(item.message);
    const attachments = parseChatAttachmentMarkers(item.message);
    const imageAttachments = attachments.filter((attachment) => attachment.kind === "image");
    const documentAttachments = attachments.filter((attachment) => attachment.kind === "document");
    const isPaymentProofMessage = item.message.includes("ผู้ซื้อส่งหลักฐานการชำระเงิน");
    const cleanMessage = removeChatAttachmentMarkers(item.message);

    const renderLinkedTextLine = (line: string, index: number) => {
      const poMatch = line.match(/PO-\d{4}-\d{4}/);
      const soMatch = line.match(/SO-\d{4}-\d{4}/);
      const match = poMatch || soMatch;

      if (!line) {
        return <div key={`spacer-${item.id}-${index}`} className="h-2" />;
      }

      if (!match) {
        return (
          <p key={`${item.id}-${index}`} className="whitespace-pre-wrap leading-relaxed">
            {line}
          </p>
        );
      }

      const documentId = match[0];
      const kind: TradeDocumentSelection["kind"] = poMatch ? "po" : "so";
      const [before, after] = line.split(documentId);

      return (
        <p key={`${item.id}-${index}`} className="whitespace-pre-wrap leading-relaxed">
          <span>{before}</span>
          <button
            type="button"
            onClick={() =>
              setSelectedTradeDocument({
                kind,
                documentId,
                linkedPoId: poId,
                linkedSoId: soId,
              })
            }
            className={`rounded-md px-2 py-1 text-xs font-bold underline ${
              isMine
                ? "bg-white/95 text-[#06603F] hover:bg-white"
                : "border border-[#A7F3D0] bg-white text-[#06603F] hover:bg-[#ECFDF5]"
            }`}
          >
            {documentId}
          </button>
          <span>{after}</span>
        </p>
      );
    };

    return (
      <div className="mt-1 space-y-3">
        {cleanMessage ? (
          <div className="space-y-1">
            {cleanMessage.split("\n").map((line, index) => renderLinkedTextLine(line, index))}
          </div>
        ) : null}

        {imageAttachments.length > 0 ? (
          <div
            className={`rounded-xl border p-3 ${
              isMine ? "border-white/40 bg-white/10" : "border-[#DDE7E3] bg-white"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className={`text-sm font-bold ${isMine ? "text-white" : "text-[#0F172A]"}`}>
                รูปถ่ายหลักฐานส่งมอบ
              </p>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  isMine ? "bg-white/20 text-white" : "bg-[#F3F7F5] text-slate-600"
                }`}
              >
                {imageAttachments.length} รูป
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {imageAttachments.map((attachment, index) => {
                const isDuplicate = attachment.status === "duplicate";
                const isPendingCheck = attachment.status === "pending_24h";

                return (
                  <figure
                    key={`${item.id}-image-gallery-${attachment.fingerprint}-${index}`}
                    className={`overflow-hidden rounded-lg border ${
                      isDuplicate
                        ? "border-amber-300 bg-amber-50"
                        : isPendingCheck
                        ? "border-sky-300 bg-sky-50"
                        : isMine
                        ? "border-white/30 bg-white/10"
                        : "border-[#DDE7E3] bg-[#F3F7F5]"
                    }`}
                  >
                    <div className="aspect-square bg-[#F3F7F5]">
                      {attachment.previewUrl ? (
                        <img
                          src={attachment.previewUrl}
                          alt={attachment.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-slate-400">
                          รูปภาพ
                        </div>
                      )}
                    </div>
                    <figcaption className={`space-y-1 p-2 text-xs ${isMine ? "text-white" : "text-slate-700"}`}>
                      <p className="truncate font-medium">{attachment.name}</p>
                      <p className={isMine ? "break-all text-white/70" : "break-all text-slate-400"}>
                        รหัสตรวจภาพ: {attachment.fingerprint}
                      </p>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          isDuplicate
                            ? "bg-amber-100 text-amber-800"
                            : isPendingCheck
                            ? "bg-sky-100 text-sky-800"
                            : "bg-[#D1FAE5] text-[#06603F]"
                        }`}
                      >
                        {isDuplicate
                          ? "Agentic พบความเสี่ยงรูปซ้ำ"
                          : isPendingCheck
                          ? "รอตรวจรูปซ้ำหลังครบ 24 ชม."
                          : "Agentic ไม่พบรูปซ้ำเบื้องต้น"}
                      </span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        ) : null}

        {documentAttachments.length > 0 ? (
          <div
            className={`rounded-xl border p-3 ${
              isMine ? "border-white/40 bg-white/10" : "border-[#DDE7E3] bg-white"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className={`text-sm font-bold ${isMine ? "text-white" : "text-[#0F172A]"}`}>
                {isPaymentProofMessage ? "สลิป/หลักฐานการชำระเงิน" : "เอกสารหลักฐานส่งมอบ"}
              </p>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  isMine ? "bg-white/20 text-white" : "bg-[#F3F7F5] text-slate-600"
                }`}
              >
                {documentAttachments.length} ไฟล์
              </span>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {documentAttachments.map((attachment, index) => {
                const isDuplicate = attachment.status === "duplicate";
                const isPendingCheck = attachment.status === "pending_24h";
                const isImageDocument = attachment.type?.startsWith("image/") && attachment.previewUrl;

                return (
                  <div
                    key={`${item.id}-doc-gallery-${attachment.fingerprint}-${index}`}
                    className={`flex gap-3 rounded-lg border p-2 text-xs ${
                      isDuplicate
                        ? "border-amber-300 bg-amber-50 text-amber-900"
                        : isPendingCheck
                        ? "border-sky-300 bg-sky-50 text-sky-900"
                        : isMine
                        ? "border-white/30 bg-white/10 text-white"
                        : "border-[#DDE7E3] bg-[#F3F7F5] text-slate-700"
                    }`}
                  >
                    {isImageDocument ? (
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-[#F3F7F5]">
                        <img
                          src={attachment.previewUrl}
                          alt={attachment.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-md ${
                          isMine ? "bg-white/15" : "bg-white"
                        }`}
                      >
                        เอกสาร
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{attachment.name}</p>
                      <p className={isMine ? "mt-1 text-white/75" : "mt-1 text-slate-500"}>
                        ประเภทไฟล์: {attachment.type || "ไม่ระบุ"}
                      </p>
                      <p className={isMine ? "mt-1 break-all text-white/70" : "mt-1 break-all text-slate-400"}>
                        รหัสตรวจเอกสาร: {attachment.fingerprint}
                      </p>
                      {isDuplicate ? (
                        <span className="mt-1 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                          พบความเสี่ยงไฟล์ซ้ำ
                        </span>
                      ) : isPendingCheck ? (
                        <span className="mt-1 inline-flex rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-medium text-sky-800">
                          รอตรวจซ้ำหลังครบ 24 ชม.
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const workflowSteps = getWorkflowStepsForChat({
    thread,
    relatedRequest,
    relatedOrder,
    messages: sortedMessages,
  });
  const currentWorkflowStep = getCurrentWorkflowStep(workflowSteps);
  const workflowInsights = getAgenticWorkflowInsights({
    thread,
    relatedRequest,
    relatedOrder,
    messages: sortedMessages,
    workflowSteps,
  });

  const chatTitle = relatedRequest
    ? `${relatedRequest.id} · ${relatedRequest.productName} · ${relatedRequest.quantity.toLocaleString("th-TH")} ${relatedRequest.unit}`
    : relatedOrder
    ? `${relatedOrder.id} · ${relatedOrder.productName}`
    : thread.threadType === "rfq"
    ? `RFQ: ${thread.rfqId || "-"}`
    : `Order: ${thread.orderId || "-"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-3">
      <section className="flex h-[88vh] w-[min(1180px,calc(100vw-2rem))] max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="border-b border-[#DDE7E3] px-4 py-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">ช่องแชทระหว่างผู้ซื้อและผู้ขาย</h2>
              <p className="mt-1 text-sm text-slate-500">{chatTitle}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
              ปิด
            </button>
          </div>

          <div className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
            เพื่อความปลอดภัย กรุณาตกลงราคา ปริมาณ ขนส่ง เอกสาร การชำระเงิน และการยืนยันรับสินค้าผ่านระบบ FarmLink
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="min-h-0 overflow-y-auto border-b border-[#DDE7E3] bg-[#F3F7F5] p-3 lg:border-b-0 lg:border-r">
            <div className="mb-3 rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] p-3">
              <p className="text-sm font-bold text-emerald-900">สถานะปัจจุบัน</p>
              <p className="mt-1 text-sm text-emerald-800">{currentWorkflowStep?.label || "กำลังดำเนินการ"}</p>
              {currentWorkflowStep?.description ? (
                <p className="mt-1 text-xs text-[#06603F]">{currentWorkflowStep.description}</p>
              ) : null}
            </div>

            <WorkflowTimeline steps={workflowSteps} templateName={adminWorkflowTemplate.name} />
            <AgenticWorkflowPanel insights={workflowInsights} />
            <WorkflowActionHint currentUser={currentUser} currentStep={currentWorkflowStep} />
          </aside>

          <div className="flex min-h-0 flex-col">
            <div className="border-b border-[#DDE7E3] bg-white px-4 py-2.5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-[#0F172A]">ช่องแชทระหว่างผู้ซื้อและผู้ขาย</p>
                  <p className="text-xs text-slate-500">ใช้คุยเฉพาะรายละเอียดคำขอซื้อ ราคา ขนส่ง เอกสาร และวันส่งมอบ</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#F3F7F5] px-3 py-1 text-xs font-medium text-slate-600">
                    {sortedMessages.length} ข้อความ
                  </span>
                  <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-medium text-[#06603F]">
                    อัปเดตเมื่อเปิดอ่านหรือส่งข้อความ
                  </span>
                  <button
                    type="button"
                    onClick={refreshMessages}
                    className="rounded-full border border-[#DDE7E3] bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-[#F3F7F5]"
                  >
                    รีเฟรชข้อความ
                  </button>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                รีเฟรชล่าสุด: {lastRefreshedAt.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-white p-4">
              {sortedMessages.length === 0 ? (
                <EmptyHint text="ยังไม่มีข้อความ เริ่มคุยรายละเอียดคำขอซื้อและขนส่งได้เลย" />
              ) : (
                sortedMessages.map((item) => {
                  const isMine = item.senderId === currentUser.id;
                  const isSystem = item.senderRole === "system" || item.messageType !== "user_message";

                  if (isSystem) {
                    return (
                      <div key={item.id} className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                        <p className="font-bold">FarmLink Safety Notice</p>
                        <p className="mt-1">{item.message}</p>
                        <p className="mt-2 text-xs text-amber-700">{formatChatTime(item.createdAt)}</p>
                      </div>
                    );
                  }

                  return (
                    <div key={item.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[82%] rounded-lg px-4 py-3 text-sm ${
                          isMine ? "bg-[#0F8A5F] text-white" : "bg-[#F3F7F5] text-slate-800"
                        }`}
                      >
                        <p className="text-xs opacity-75">
                          {item.senderRole === "buyer" ? "ผู้ซื้อ" : item.senderRole === "seller" ? "ผู้ขาย" : "ผู้ดูแลระบบ"}
                        </p>
                        {renderChatMessageContent(item, isMine)}
                        <div className="mt-2 flex items-center justify-between gap-3 text-xs opacity-75">
                          <span>{formatChatTime(item.createdAt)}</span>
                          {getReadReceiptLabel(item) ? <span>{getReadReceiptLabel(item)}</span> : null}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {shouldShowBuyerDeliveryProofReviewCard ? (
              <div className="max-h-[32vh] overflow-y-auto border-t border-sky-200 bg-sky-50 p-3">
                <div className="rounded-lg border border-sky-200 bg-white p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-sky-950">FarmLink Action Card สำหรับผู้ซื้อ</p>
                      <p className="mt-1 text-xs text-sky-700">
                        ผู้ขายส่งสรุปการจัดส่งพร้อมรูปถ่ายและเอกสารแล้ว กรุณาตรวจสอบภาพ เอกสาร และผลตรวจ Agentic
                        หากรูปซ้ำหรือข้อมูลผิดพลาด สามารถขอให้ผู้ขายส่งใหม่หรือแก้ไขได้
                      </p>
                    </div>
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800">
                      ตรวจหลักฐาน
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <label className="block text-xs font-medium text-slate-700">
                      ประเด็นที่ต้องการแก้ไข
                      <select
                        value={deliveryCorrection.issueType}
                        onChange={(event) => updateDeliveryCorrection("issueType", event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
                      >
                        <option>รูปถ่ายไม่ชัดเจน / ต้องการรูปใหม่</option>
                        <option>Agentic พบความเสี่ยงรูปซ้ำ</option>
                        <option>เอกสารไม่ครบ</option>
                        <option>ข้อมูลรอบส่งหรือสถานที่ไม่ถูกต้อง</option>
                        <option>ต้องการแก้ไขข้อมูลผู้ประสานงานขนส่ง</option>
                        <option>อื่น ๆ</option>
                      </select>
                    </label>

                    <label className="block text-xs font-medium text-slate-700 md:col-span-2">
                      รายละเอียดเพิ่มเติม
                      <textarea
                        value={deliveryCorrection.detail}
                        onChange={(event) => updateDeliveryCorrection("detail", event.target.value)}
                        className="mt-1 min-h-20 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
                      />
                    </label>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={sendBuyerRequestDeliveryProofCorrection}
                      className="rounded-md border border-sky-200 bg-white px-4 py-2 text-sm font-medium text-sky-700"
                    >
                      ขอให้ผู้ขายส่งใหม่/แก้ไข
                    </button>
                    <button
                      type="button"
                      onClick={sendBuyerAcceptDeliveryProofSummary}
                      className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white"
                    >
                      ยืนยันข้อมูลจัดส่งและหลักฐานเบื้องต้น
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {shouldShowBuyerReceiveGoodsCard ? (
              <div className="max-h-[30vh] overflow-y-auto border-t border-[#A7F3D0] bg-[#ECFDF5] p-3">
                <div className="rounded-lg border border-[#A7F3D0] bg-white p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-emerald-950">FarmLink Action Card สำหรับผู้ซื้อ</p>
                      <p className="mt-1 text-xs text-[#06603F]">
                        ขั้นตอนที่ 10: เตรียมรับสินค้า / ยืนยันรับสินค้า ผู้ซื้อควรตรวจสอบปริมาณ คุณภาพ เอกสาร และสภาพสินค้า
                        ก่อนกดยืนยันรับสินค้าในระบบ
                      </p>
                    </div>
                    <span className="rounded-full bg-[#D1FAE5] px-3 py-1 text-xs font-medium text-emerald-800">
                      เตรียมรับสินค้า
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-md border border-emerald-100 bg-[#ECFDF5] p-3 text-sm text-emerald-900">
                      <p className="font-bold">สิ่งที่ควรตรวจสอบก่อนรับสินค้า</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
                        <li>ปริมาณและน้ำหนักตรงตาม PO / SO</li>
                        <li>คุณภาพสินค้าและสภาพบรรจุภัณฑ์</li>
                        <li>ใบส่งของ ใบน้ำหนัก หรือเอกสารที่ตกลงไว้</li>
                        <li>รูปส่งมอบและข้อมูลขนส่งตรงกับที่ผู้ขายแจ้งในแชท</li>
                      </ul>
                    </div>
                    <div className="rounded-md border border-amber-100 bg-amber-50 p-3 text-sm text-amber-900">
                      <p className="font-bold">หากพบปัญหา</p>
                      <p className="mt-2 text-xs">
                        อย่ากดยืนยันรับสินค้าหากสินค้า เอกสาร หรือปริมาณไม่ตรงกับข้อตกลง ให้กดแจ้งปัญหาเพื่อเก็บหลักฐานในระบบก่อน
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={sendBuyerReportDeliveryIssue}
                      className="rounded-md border border-amber-200 bg-white px-4 py-2 text-sm font-medium text-amber-700"
                    >
                      แจ้งปัญหา / ขอให้ตรวจสอบ
                    </button>
                    <button
                      type="button"
                      onClick={sendBuyerConfirmGoodsReceived}
                      className="rounded-md bg-[#0F8A5F] px-4 py-2 text-sm font-medium text-white"
                    >
                      ยืนยันรับสินค้า
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {shouldShowSellerPaymentInstructionCard ? (
              <div className="max-h-[34vh] overflow-y-auto border-t border-indigo-200 bg-indigo-50 p-3">
                <div className="rounded-lg border border-indigo-200 bg-white p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-indigo-950">FarmLink Action Card สำหรับผู้ขาย</p>
                      <p className="mt-1 text-xs text-indigo-700">
                        ผู้ซื้อยืนยันรับสินค้าแล้ว ขั้นตอนถัดไปผู้ขายต้องส่งข้อมูลบัญชี/เงื่อนไขการโอนชำระเงินให้ผู้ซื้อในแชท
                      </p>
                    </div>
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                      เห็นเฉพาะผู้ขาย
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <label className="block text-xs font-medium text-slate-700">
                      ยอดที่ต้องชำระ
                      <input
                        value={paymentInstruction.amount}
                        onChange={(event) => updatePaymentInstruction("amount", event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                      />
                    </label>
                    <label className="block text-xs font-medium text-slate-700">
                      ธนาคาร
                      <input
                        value={paymentInstruction.bankName}
                        onChange={(event) => updatePaymentInstruction("bankName", event.target.value)}
                        placeholder="เช่น ธ.ก.ส. / กสิกรไทย / ไทยพาณิชย์"
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                      />
                    </label>
                    <label className="block text-xs font-medium text-slate-700">
                      ชื่อบัญชี
                      <input
                        value={paymentInstruction.accountName}
                        onChange={(event) => updatePaymentInstruction("accountName", event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                      />
                    </label>
                    <label className="block text-xs font-medium text-slate-700">
                      เลขบัญชี
                      <input
                        value={paymentInstruction.accountNumber}
                        onChange={(event) => updatePaymentInstruction("accountNumber", event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                      />
                    </label>
                    <label className="block text-xs font-medium text-slate-700 md:col-span-2">
                      กำหนด / เงื่อนไขชำระเงิน
                      <input
                        value={paymentInstruction.paymentDue}
                        onChange={(event) => updatePaymentInstruction("paymentDue", event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                      />
                    </label>
                    <label className="block text-xs font-medium text-slate-700 md:col-span-2">
                      หมายเหตุ
                      <textarea
                        value={paymentInstruction.note}
                        onChange={(event) => updatePaymentInstruction("note", event.target.value)}
                        className="mt-1 min-h-16 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                      />
                    </label>
                  </div>

                  <div className="mt-4 rounded-md bg-amber-50 p-3 text-xs text-amber-800">
                    ข้อมูลบัญชีจะแสดงหลังผู้ซื้อยืนยันรับสินค้าแล้วเท่านั้น และผู้ซื้อควรส่งหลักฐานชำระเงินกลับมาใน FarmLink เพื่อเก็บ audit trail
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={sendSellerPaymentInstruction}
                      className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                    >
                      ส่งข้อมูลการโอนชำระให้ผู้ซื้อ
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {shouldShowBuyerPaymentProofCard ? (
              <div className="max-h-[30vh] overflow-y-auto border-t border-violet-200 bg-violet-50 p-3">
                <div className="rounded-lg border border-violet-200 bg-white p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-violet-950">FarmLink Action Card สำหรับผู้ซื้อ</p>
                      <p className="mt-1 text-xs text-violet-700">
                        ผู้ขายส่งข้อมูลการโอนชำระเงินแล้ว กรุณาชำระตามเงื่อนไขและส่งหลักฐานในแชท
                      </p>
                    </div>
                    <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-800">
                      ส่งหลักฐานชำระเงิน
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <label className="block text-xs font-medium text-slate-700">
                      ยอดที่ชำระ
                      <input
                        value={paymentProof.paidAmount}
                        onChange={(event) => updatePaymentProof("paidAmount", event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-500"
                      />
                    </label>
                    <label className="block text-xs font-medium text-slate-700">
                      วันที่/เวลาชำระเงิน
                      <input
                        value={paymentProof.paidAt}
                        onChange={(event) => updatePaymentProof("paidAt", event.target.value)}
                        placeholder="เช่น 14 พ.ค. 20:55"
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-500"
                      />
                    </label>
                    <label className="block text-xs font-medium text-slate-700 md:col-span-2">
                      เลขอ้างอิง / หมายเลขสลิป
                      <input
                        value={paymentProof.reference}
                        onChange={(event) => updatePaymentProof("reference", event.target.value)}
                        placeholder="กรอกเลขอ้างอิงจากสลิปหรือธุรกรรม"
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-500"
                      />
                    </label>
                    <label className="block text-xs font-medium text-slate-700 md:col-span-2">
                      แนบภาพสลิป / หลักฐานการชำระเงิน
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        multiple
                        onChange={handlePaymentProofFiles}
                        className="mt-1 w-full rounded-md border border-dashed border-violet-300 bg-violet-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-500"
                      />
                      <span className="mt-1 block text-[11px] text-slate-500">
                        รองรับ JPG, PNG, WebP หรือ PDF และจะแสดงในช่องแชทให้ผู้ขายตรวจสอบ
                      </span>
                    </label>

                    {paymentProofFiles.length > 0 ? (
                      <div className="md:col-span-2 rounded-lg border border-violet-200 bg-violet-50 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-xs font-bold text-violet-900">ไฟล์หลักฐานที่แนบ</p>
                          <span className="rounded-full bg-violet-100 px-2 py-1 text-[11px] text-violet-800">
                            {paymentProofFiles.length} ไฟล์
                          </span>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {paymentProofFiles.map((file, index) => (
                            <div
                              key={`${file.fingerprint}-${index}`}
                              className="flex items-center gap-3 rounded-md border border-violet-100 bg-white p-2 text-xs text-slate-700"
                            >
                              {file.previewUrl ? (
                                <img
                                  src={file.previewUrl}
                                  alt={file.name}
                                  className="h-14 w-14 rounded-md object-cover"
                                />
                              ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-md bg-[#F3F7F5] text-[10px] text-slate-500">
                                  PDF
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="truncate font-medium">{file.name}</p>
                                <p className="mt-1 text-slate-500">{file.type || "ไม่ระบุประเภทไฟล์"}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <label className="block text-xs font-medium text-slate-700 md:col-span-2">
                      หมายเหตุ
                      <textarea
                        value={paymentProof.note}
                        onChange={(event) => updatePaymentProof("note", event.target.value)}
                        className="mt-1 min-h-16 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-500"
                      />
                    </label>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={sendBuyerPaymentProof}
                      className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white"
                    >
                      ส่งหลักฐานการชำระเงิน
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {shouldShowSellerConfirmPaymentCard ? (
              <div className="border-t border-[#A7F3D0] bg-[#ECFDF5] p-3">
                <div className="rounded-lg border border-[#A7F3D0] bg-white p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-emerald-950">FarmLink Action Card สำหรับผู้ขาย</p>
                      <p className="mt-1 text-xs text-[#06603F]">
                        ผู้ซื้อส่งหลักฐานการชำระเงินแล้ว กรุณาตรวจสอบยอดเงินและยืนยันเมื่อได้รับเงินครบถ้วน
                      </p>
                    </div>
                    <span className="rounded-full bg-[#D1FAE5] px-3 py-1 text-xs font-medium text-emerald-800">
                      ยืนยันรับเงิน
                    </span>
                  </div>

                  <div className="mt-4 rounded-md bg-[#ECFDF5] p-3 text-xs text-emerald-800">
                    การยืนยันรับเงินจะถูกบันทึกเป็นหลักฐานในธุรกรรม และใช้ประกอบประวัติความน่าเชื่อถือของคู่ค้า
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={sendSellerConfirmPayment}
                      className="rounded-md bg-[#0F8A5F] px-4 py-2 text-sm font-medium text-white"
                    >
                      ยืนยันได้รับเงิน
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {shouldShowBuyerReviewCard ? (
              <div className="max-h-[38vh] overflow-y-auto border-t border-purple-200 bg-purple-50 p-3">
                <div className="rounded-lg border border-purple-200 bg-white p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-purple-950">FarmLink Action Card สำหรับผู้ซื้อ</p>
                      <p className="mt-1 text-xs text-purple-700">
                        ผู้ขายยืนยันได้รับเงินแล้ว กรุณารีวิวสินค้า การส่งมอบ และเอกสาร เพื่อปิดธุรกรรมและช่วยสร้างความน่าเชื่อถือในระบบ
                      </p>
                    </div>
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                      รีวิวหลังธุรกรรม
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <label className="block text-xs font-medium text-slate-700">
                      คะแนนคุณภาพสินค้า
                      <select
                        value={chatReview.qualityRating}
                        onChange={(event) => updateChatReview("qualityRating", event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-purple-500"
                      >
                        {[5, 4, 3, 2, 1].map((score) => (
                          <option key={score} value={score}>{score}/5</option>
                        ))}
                      </select>
                    </label>

                    <label className="block text-xs font-medium text-slate-700">
                      คะแนนการส่งมอบ
                      <select
                        value={chatReview.deliveryRating}
                        onChange={(event) => updateChatReview("deliveryRating", event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-purple-500"
                      >
                        {[5, 4, 3, 2, 1].map((score) => (
                          <option key={score} value={score}>{score}/5</option>
                        ))}
                      </select>
                    </label>

                    <label className="block text-xs font-medium text-slate-700">
                      คะแนนเอกสาร
                      <select
                        value={chatReview.documentRating}
                        onChange={(event) => updateChatReview("documentRating", event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-purple-500"
                      >
                        {[5, 4, 3, 2, 1].map((score) => (
                          <option key={score} value={score}>{score}/5</option>
                        ))}
                      </select>
                    </label>

                    <label className="block text-xs font-medium text-slate-700 md:col-span-3">
                      ความคิดเห็น
                      <textarea
                        value={chatReview.comment}
                        onChange={(event) => updateChatReview("comment", event.target.value)}
                        placeholder="เช่น สินค้าคุณภาพดี ส่งตรงเวลา เอกสารครบถ้วน"
                        className="mt-1 min-h-20 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-purple-500"
                      />
                    </label>
                  </div>

                  <div className="mt-4 rounded-md bg-purple-50 p-3 text-xs text-purple-800">
                    รีวิวนี้จะแสดงในหน้ารายละเอียดสินค้าโดยไม่เปิดเผยชื่อจริงของผู้ซื้อ และใช้เป็นสัญญาณความน่าเชื่อถือของผู้ขาย
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={sendBuyerChatReview}
                      className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white"
                    >
                      ส่งรีวิวและปิดธุรกรรม
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {shouldShowSellerAfterBuyerAcceptedOfferActionCard ? (
              <div className="max-h-[38vh] overflow-y-auto border-t border-amber-200 bg-amber-50 p-3">
                <div className="rounded-lg border border-amber-200 bg-white p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-amber-900">FarmLink Action Card สำหรับผู้ขาย</p>
                      <p className="mt-1 text-xs text-amber-700">
                        ผู้ซื้อยืนยันข้อเสนอขายอย่างเป็นทางการแล้ว ขั้นตอนถัดไปของผู้ขายคือยืนยันรับคำสั่งซื้อ
                        เพื่อให้ระบบสร้าง PO ฝั่งผู้ซื้อ และ SO ฝั่งผู้ขายอย่างเป็นทางการ
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                      เห็นเฉพาะผู้ขาย
                    </span>
                  </div>

                  <div className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
                    <p className="font-bold">สถานะล่าสุด: ผู้ซื้อยืนยันข้อเสนอแล้ว</p>
                    <p className="mt-1">
                      เมื่อผู้ขายกดยืนยัน ระบบจะสร้าง PO / SO บันทึกข้อตกลงหลัก และเข้าสู่ขั้นตอนเปิดข้อมูลขนส่งกับหลักฐานส่งมอบ
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={sendSellerAcknowledgeBuyerAcceptedOffer}
                      className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white"
                    >
                      ยืนยันรับคำสั่งซื้อและสร้าง PO/SO
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {shouldShowSellerDeliveryActionCard ? (
              <div className="max-h-[42vh] overflow-y-auto border-t border-sky-200 bg-sky-50 p-3">
                <div className="rounded-lg border border-sky-200 bg-white p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-sky-900">FarmLink Action Card สำหรับผู้ขาย</p>
                      <p className="mt-1 text-xs text-sky-700">
                        ขั้นตอนที่ 8: ดำเนินการส่งสินค้า ผู้ขายกรอกข้อมูลการเตรียมสินค้า รอบส่ง ผู้ประสานงาน และเอกสารส่งมอบ
                        จากนั้นกดส่งเพื่อสรุปให้ผู้ซื้อเห็นในแชท
                      </p>
                    </div>
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800">
                      เห็นเฉพาะผู้ขาย
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <label className="block text-xs font-medium text-slate-700">
                      สถานะการเตรียมสินค้า
                      <select
                        value={deliveryPlan.preparationStatus}
                        onChange={(event) => updateDeliveryPlan("preparationStatus", event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
                      >
                        <option>เตรียมสินค้า / คัดเกรดตามคำสั่งซื้อแล้ว</option>
                        <option>กำลังคัดเกรดและบรรจุสินค้า</option>
                        <option>รอเก็บเกี่ยวตามรอบที่ตกลง</option>
                        <option>รอรถเข้ารับสินค้า</option>
                        <option>พร้อมจัดส่งตามเวลานัดหมาย</option>
                      </select>
                    </label>

                    <label className="block text-xs font-medium text-slate-700">
                      รอบส่ง / กำหนดส่ง
                      <input
                        value={deliveryPlan.deliverySchedule}
                        onChange={(event) => updateDeliveryPlan("deliverySchedule", event.target.value)}
                        placeholder="เช่น 10 มิ.ย. 2026 ช่วงเช้า"
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
                      />
                    </label>

                    <label className="block text-xs font-medium text-slate-700">
                      รูปแบบขนส่ง
                      <select
                        value={deliveryPlan.transportMethod}
                        onChange={(event) => updateDeliveryPlan("transportMethod", event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
                      >
                        <option>ผู้ขายจัดส่งเองตามเงื่อนไขที่ตกลงในระบบ</option>
                        <option>ผู้ซื้อรับเองที่จุดรวบรวม</option>
                        <option>รถรับจ้างในพื้นที่</option>
                        <option>ขนส่งปริมาณมาก / รถเหมารอบ</option>
                        <option>ตกลงร่วมกันเพิ่มเติมก่อนออกเดินทาง</option>
                      </select>
                    </label>

                    <label className="block text-xs font-medium text-slate-700">
                      สถานที่รับ/ส่งสินค้า
                      <input
                        value={deliveryPlan.deliveryLocation}
                        onChange={(event) => updateDeliveryPlan("deliveryLocation", event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
                      />
                    </label>

                    <label className="block text-xs font-medium text-slate-700">
                      ผู้ประสานงานขนส่ง
                      <input
                        value={deliveryPlan.deliveryContactName}
                        onChange={(event) => updateDeliveryPlan("deliveryContactName", event.target.value)}
                        placeholder="ชื่อผู้ประสานงาน / คนขับ / จุดรวบรวม"
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
                      />
                    </label>

                    <label className="block text-xs font-medium text-slate-700">
                      เบอร์ติดต่อสำหรับขนส่ง
                      <input
                        value={deliveryPlan.deliveryContactPhone}
                        onChange={(event) => updateDeliveryPlan("deliveryContactPhone", event.target.value)}
                        placeholder="ใช้เฉพาะประสานงานขนส่งหลังมี PO/SO"
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
                      />
                    </label>

                    <label className="block text-xs font-medium text-slate-700 md:col-span-2">
                      เอกสาร / หลักฐานที่จะใช้ส่งมอบ
                      <input
                        value={deliveryPlan.deliveryDocuments}
                        onChange={(event) => updateDeliveryPlan("deliveryDocuments", event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
                      />
                    </label>

                    <div className="md:col-span-2 rounded-lg border border-sky-200 bg-white p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-bold text-[#0F172A]">อัปโหลดรูปถ่ายและเอกสารส่งมอบ</p>
                          <p className="mt-1 text-xs text-slate-500">
                            รูปถ่ายจะถูกตรวจซ้ำเบื้องต้นด้วย Agentic เพื่อลดความเสี่ยงการนำรูปเดิมมาอ้างอิงในการส่งมอบครั้งต่อไป
                          </p>
                        </div>
                        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800">
                          ตรวจรูปซ้ำอัตโนมัติ
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-[#F3F7F5] p-4 text-center text-xs font-medium text-slate-600 hover:bg-[#F3F7F5]">
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            multiple
                            onChange={handleDeliveryProofImages}
                            className="hidden"
                          />
                          อัปโหลดรูปถ่ายหลักฐาน
                          <span className="mt-1 text-[11px] font-normal text-slate-400">
                            รูปก่อนส่ง / ขณะโหลด / ถึงปลายทาง
                          </span>
                        </label>

                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-[#F3F7F5] p-4 text-center text-xs font-medium text-slate-600 hover:bg-[#F3F7F5]">
                          <input
                            type="file"
                            accept="application/pdf,image/png,image/jpeg,image/webp"
                            multiple
                            onChange={handleDeliveryProofDocuments}
                            className="hidden"
                          />
                          อัปโหลดเอกสารส่งมอบ
                          <span className="mt-1 text-[11px] font-normal text-slate-400">
                            ใบน้ำหนัก / ใบส่งของ / PDF / รูปเอกสาร
                          </span>
                        </label>
                      </div>

                      {deliveryProofImages.length ? (
                        <div className="mt-4">
                          <p className="text-xs font-bold text-slate-700">รูปถ่ายที่เลือก</p>
                          <div className="mt-2 grid gap-2 sm:grid-cols-2">
                            {deliveryProofImages.map((item) => {
                              const isPendingCheck = item.duplicateStatus === "pending_24h";

                              return (
                                <div
                                  key={item.fingerprint}
                                  className={`flex gap-3 rounded-md border p-2 ${
                                    item.duplicate
                                      ? "border-amber-300 bg-amber-50"
                                      : isPendingCheck
                                      ? "border-sky-200 bg-sky-50"
                                      : "border-[#DDE7E3] bg-white"
                                  }`}
                                >
                                  <img src={item.previewUrl} alt={item.name} className="h-14 w-14 rounded object-cover" />
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-medium text-slate-800">{item.name}</p>
                                    <p className="text-[11px] text-slate-500">
                                      {(item.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                    {item.duplicate ? (
                                      <p className="mt-1 text-[11px] font-medium text-amber-700">
                                        Agentic พบความเสี่ยงรูปซ้ำ
                                      </p>
                                    ) : isPendingCheck ? (
                                      <p className="mt-1 text-[11px] font-medium text-sky-700">
                                        บันทึกแล้ว รอตรวจรูปซ้ำหลังครบ 24 ชม.
                                      </p>
                                    ) : (
                                      <p className="mt-1 text-[11px] font-medium text-[#06603F]">
                                        ยังไม่พบรูปซ้ำในประวัติ
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}

                      {deliveryProofDocuments.length ? (
                        <div className="mt-4">
                          <p className="text-xs font-bold text-slate-700">เอกสารที่เลือก</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {deliveryProofDocuments.map((item) => (
                              <span
                                key={item.fingerprint}
                                className={`rounded-full px-3 py-1 text-xs ${
                                  item.duplicate ? "bg-amber-100 text-amber-800" : "bg-[#F3F7F5] text-slate-700"
                                }`}
                              >
                                {item.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {duplicateDeliveryProofImages.length ? (
                        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                          Agentic ตรวจพบรูปถ่ายที่อาจซ้ำกับหลักฐานก่อนหน้า:
                          {" "}
                          {duplicateDeliveryProofImages.map((item) => item.name).join(", ")}
                          {" "}
                          แนะนำให้ตรวจสอบก่อนส่งมอบหรือให้ผู้ดูแลระบบช่วยตรวจสอบเพิ่มเติม
                        </div>
                      ) : (
                        <div className="mt-4 rounded-md bg-[#ECFDF5] p-3 text-xs text-emerald-800">
                          Agentic จะบันทึกรหัสตรวจภาพภายใน และจะเริ่มตรวจจับความซ้ำกับหลักฐานเก่าหลังครบ 24 ชั่วโมง
                        </div>
                      )}
                    </div>

                    <label className="block text-xs font-medium text-slate-700 md:col-span-2">
                      หมายเหตุเพิ่มเติม
                      <textarea
                        value={deliveryPlan.note}
                        onChange={(event) => updateDeliveryPlan("note", event.target.value)}
                        placeholder="เช่น รถจะออกจากสวนเวลา 08:00 น. หรือให้ผู้ซื้อเตรียมจุดจอดรถ"
                        className="mt-1 min-h-20 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
                      />
                    </label>
                  </div>

                  <div className="mt-4 rounded-md bg-sky-50 p-3 text-xs text-sky-800">
                    ผู้ซื้อจะไม่เห็นข้อมูลระหว่างที่ผู้ขายกำลังกรอกหรือเลือกข้อมูล จะแสดงในแชทเมื่อกด “ส่งสรุปการจัดส่งให้ผู้ซื้อ” แล้วเท่านั้น
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={sendSellerDeliveryPlan}
                      className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white"
                    >
                      ส่งสรุปการจัดส่งให้ผู้ซื้อ
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {shouldShowSellerGuidedReply ? (
              <div className="max-h-[38vh] overflow-y-auto border-t border-[#A7F3D0] bg-[#ECFDF5] p-3">
                <div className="rounded-lg border border-[#A7F3D0] bg-white p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-emerald-900">FarmLink Action Card สำหรับผู้ขาย</p>
                      <p className="mt-1 text-xs text-[#06603F]">
                        ผู้ซื้อสอบถามรอบส่งและเงื่อนไขขนส่ง กรุณาเลือกข้อมูลด้านล่างแล้วกด “ส่งเงื่อนไขให้ผู้ซื้อ”
                        ผู้ซื้อจะยังไม่เห็นข้อมูลที่คุณเลือกจนกว่าจะกดยืนยันส่ง
                      </p>
                    </div>
                    <span className="rounded-full bg-[#D1FAE5] px-3 py-1 text-xs font-medium text-emerald-800">
                      เห็นเฉพาะผู้ขาย
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <label className="block text-xs font-medium text-slate-700">
                      รอบจัดส่ง
                      <select
                        value={sellerGuidedReply.deliveryRound}
                        onChange={(event) => updateSellerGuidedReply("deliveryRound", event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      >
                        <option>รอบส่งถัดไปภายใน 1-2 วันทำการ</option>
                        <option>ส่งได้ภายในวันนี้ หากยืนยันก่อนเที่ยง</option>
                        <option>ส่งได้พรุ่งนี้ช่วงเช้า</option>
                        <option>ส่งได้เฉพาะรอบเช้า</option>
                        <option>ส่งได้เฉพาะรอบบ่าย</option>
                        <option>ต้องตกลงรอบส่งเพิ่มเติม</option>
                      </select>
                    </label>

                    <label className="block text-xs font-medium text-slate-700">
                      รูปแบบขนส่ง
                      <select
                        value={sellerGuidedReply.deliveryMethod}
                        onChange={(event) => updateSellerGuidedReply("deliveryMethod", event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      >
                        <option>ผู้ขายจัดส่งเอง</option>
                        <option>ผู้ซื้อรับเองที่จุดรวบรวม</option>
                        <option>ใช้รถรับจ้างในพื้นที่</option>
                        <option>ใช้ขนส่งปริมาณมาก / รถเหมารอบ</option>
                        <option>ตกลงร่วมกันภายหลัง</option>
                      </select>
                    </label>

                    <label className="block text-xs font-medium text-slate-700">
                      เงื่อนไขขนส่ง
                      <select
                        value={sellerGuidedReply.shippingCondition}
                        onChange={(event) => updateSellerGuidedReply("shippingCondition", event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      >
                        <option>จัดส่งในจังหวัดเดียวกันเมื่อถึงขั้นต่ำ</option>
                        <option>จัดส่งได้เฉพาะพื้นที่ใกล้เคียง</option>
                        <option>หากต่ำกว่าขั้นต่ำ ผู้ซื้อรับเองหรือใช้รถรับจ้าง</option>
                        <option>ต่างจังหวัดแนะนำรถรับจ้างหรือขนส่งปริมาณมาก</option>
                        <option>ต้องคำนวณค่าขนส่งตามระยะทางจริง</option>
                      </select>
                    </label>

                    <label className="block text-xs font-medium text-slate-700">
                      ค่าขนส่ง
                      <select
                        value={sellerGuidedReply.shippingFeePolicy}
                        onChange={(event) => updateSellerGuidedReply("shippingFeePolicy", event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      >
                        <option>ค่าขนส่งรวมในราคาแล้ว</option>
                        <option>ผู้ซื้อจ่ายค่าขนส่งแยก</option>
                        <option>คิดค่าขนส่งตามจริง</option>
                        <option>แบ่งจ่ายตามตกลง</option>
                        <option>เสนอค่าขนส่งหลังยืนยันจุดส่ง</option>
                      </select>
                    </label>

                    <label className="block text-xs font-medium text-slate-700">
                      ขั้นต่ำ / ปริมาณที่รองรับ
                      <input
                        value={sellerGuidedReply.minimumDelivery}
                        onChange={(event) => updateSellerGuidedReply("minimumDelivery", event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      />
                    </label>

                    <label className="block text-xs font-medium text-slate-700">
                      เอกสาร / หลักฐานส่งมอบ
                      <input
                        value={sellerGuidedReply.documents}
                        onChange={(event) => updateSellerGuidedReply("documents", event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      />
                    </label>

                    <label className="block text-xs font-medium text-slate-700 md:col-span-2">
                      หมายเหตุเพิ่มเติม
                      <textarea
                        value={sellerGuidedReply.note}
                        onChange={(event) => updateSellerGuidedReply("note", event.target.value)}
                        placeholder="เช่น หากต้องการส่งนอกพื้นที่ กรุณาระบุจุดส่งเพื่อประเมินค่ารถ"
                        className="mt-1 min-h-20 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      />
                    </label>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        setSellerGuidedReply({
                          deliveryRound: "ต้องตกลงรอบส่งเพิ่มเติม",
                          deliveryMethod: "ตกลงร่วมกันภายหลัง",
                          shippingCondition: "ต้องคำนวณค่าขนส่งตามระยะทางจริง",
                          shippingFeePolicy: "เสนอค่าขนส่งหลังยืนยันจุดส่ง",
                          minimumDelivery: relatedRequest ? `${relatedRequest.quantity.toLocaleString("th-TH")} ${relatedRequest.unit}` : "ตามเงื่อนไขสินค้า",
                          documents: "รูปสินค้าก่อนส่ง, ใบน้ำหนัก, ใบส่งของ",
                          note: "ขอข้อมูลจุดรับสินค้าและช่วงเวลารับสินค้าเพิ่มเติมก่อนยืนยันค่าขนส่ง",
                        })
                      }
                      className="rounded-md border border-[#DDE7E3] px-4 py-2 text-sm font-medium text-slate-700"
                    >
                      ขอข้อมูลเพิ่มเติม
                    </button>
                    <button
                      type="button"
                      onClick={sendSellerGuidedReply}
                      className="rounded-md bg-[#0F8A5F] px-4 py-2 text-sm font-medium text-white"
                    >
                      ส่งเงื่อนไขให้ผู้ซื้อ
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {shouldShowSellerFormalOfferActionCard ? (
              <div className="max-h-[38vh] overflow-y-auto border-t border-[#A7F3D0] bg-[#ECFDF5] p-3">
                <div className="rounded-lg border border-[#A7F3D0] bg-white p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-emerald-900">FarmLink Action Card สำหรับผู้ขาย</p>
                      <p className="mt-1 text-xs text-[#06603F]">
                        ผู้ซื้อยืนยันเงื่อนไขเบื้องต้นแล้ว ขั้นตอนถัดไปคือผู้ขายส่งข้อเสนอขายอย่างเป็นทางการ เพื่อให้ผู้ซื้อยืนยันเป็นคำสั่งซื้อ
                      </p>
                    </div>
                    <span className="rounded-full bg-[#D1FAE5] px-3 py-1 text-xs font-medium text-emerald-800">
                      เห็นเฉพาะผู้ขาย
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <label className="block text-xs font-medium text-slate-700">
                      ปริมาณเสนอขาย
                      <input
                        value={formalOffer.quantity}
                        onChange={(event) => updateFormalOffer("quantity", event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      />
                    </label>

                    <label className="block text-xs font-medium text-slate-700">
                      ราคาเสนอ
                      <input
                        value={formalOffer.pricePerUnit}
                        onChange={(event) => updateFormalOffer("pricePerUnit", event.target.value)}
                        placeholder="เช่น 60 บาท/กก."
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      />
                    </label>

                    <label className="block text-xs font-medium text-slate-700">
                      ค่าขนส่ง
                      <input
                        value={formalOffer.shippingCost}
                        onChange={(event) => updateFormalOffer("shippingCost", event.target.value)}
                        placeholder="เช่น รวมในราคาแล้ว / 1,500 บาท"
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      />
                    </label>

                    <label className="block text-xs font-medium text-slate-700">
                      วันส่งมอบ
                      <input
                        value={formalOffer.deliveryDate}
                        onChange={(event) => updateFormalOffer("deliveryDate", event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      />
                    </label>

                    <label className="block text-xs font-medium text-slate-700 md:col-span-2">
                      เงื่อนไขชำระเงิน
                      <input
                        value={formalOffer.paymentTerms}
                        onChange={(event) => updateFormalOffer("paymentTerms", event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      />
                    </label>

                    <label className="block text-xs font-medium text-slate-700 md:col-span-2">
                      หมายเหตุข้อเสนอ
                      <textarea
                        value={formalOffer.note}
                        onChange={(event) => updateFormalOffer("note", event.target.value)}
                        className="mt-1 min-h-20 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      />
                    </label>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={sendSellerFormalOffer}
                      className="rounded-md bg-[#0F8A5F] px-4 py-2 text-sm font-medium text-white"
                    >
                      ส่งข้อเสนอขายอย่างเป็นทางการ
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {shouldShowBuyerFormalOfferActionCard ? (
              <div className="border-t border-blue-200 bg-blue-50 p-4">
                <div className="rounded-lg border border-blue-200 bg-white p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-blue-900">FarmLink Action Card สำหรับผู้ซื้อ</p>
                      <p className="mt-1 text-xs text-blue-700">
                        ผู้ขายส่งข้อเสนอขายอย่างเป็นทางการแล้ว กรุณาตรวจสอบราคา ปริมาณ ค่าขนส่ง วันส่งมอบ และเงื่อนไขชำระเงินก่อนยืนยันเป็นคำสั่งซื้อ
                      </p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                      ขั้นตอนถัดไปของผู้ซื้อ
                    </span>
                  </div>

                  {formalOfferRevisionMode ? (
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <label className="block text-xs font-medium text-slate-700">
                        เรื่องที่ต้องการแก้ไข
                        <select
                          value={formalOfferRevision.topic}
                          onChange={(event) => updateFormalOfferRevision("topic", event.target.value)}
                          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        >
                          <option>รอบการส่ง</option>
                          <option>ปริมาณ</option>
                          <option>ราคา</option>
                          <option>ค่าขนส่ง</option>
                          <option>วิธีขนส่ง</option>
                          <option>เงื่อนไขชำระเงิน</option>
                          <option>เอกสาร / หลักฐาน</option>
                          <option>อื่น ๆ</option>
                        </select>
                      </label>

                      <label className="block text-xs font-medium text-slate-700">
                        เงื่อนไขเดิม
                        <input
                          value={formalOfferRevision.currentTerms}
                          onChange={(event) => updateFormalOfferRevision("currentTerms", event.target.value)}
                          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                      </label>

                      <label className="block text-xs font-medium text-slate-700 md:col-span-2">
                        เงื่อนไขที่ต้องการ
                        <input
                          value={formalOfferRevision.requestedTerms}
                          onChange={(event) => updateFormalOfferRevision("requestedTerms", event.target.value)}
                          placeholder="เช่น ขอเปลี่ยนรอบส่งเป็นช่วงบ่าย หรือขอปรับค่าขนส่ง"
                          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                      </label>

                      <label className="block text-xs font-medium text-slate-700 md:col-span-2">
                        หมายเหตุเพิ่มเติม
                        <textarea
                          value={formalOfferRevision.note}
                          onChange={(event) => updateFormalOfferRevision("note", event.target.value)}
                          placeholder="เช่น คลังรับสินค้าได้เฉพาะ 13:00-16:00 หรือขอแนบใบน้ำหนักเพิ่มเติม"
                          className="mt-1 min-h-20 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                      </label>

                      <div className="md:col-span-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          onClick={() => setFormalOfferRevisionMode(false)}
                          className="rounded-md border border-[#DDE7E3] px-4 py-2 text-sm font-medium text-slate-700"
                        >
                          กลับ
                        </button>
                        <button
                          type="button"
                          onClick={sendBuyerFormalOfferRevisionRequest}
                          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                        >
                          ส่งคำขอแก้ไขข้อเสนอให้ผู้ขาย
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 grid gap-2 sm:grid-cols-3">
                      <button
                        type="button"
                        onClick={sendBuyerAcceptFormalOffer}
                        className="rounded-md bg-[#0F8A5F] px-4 py-2 text-sm font-medium text-white"
                      >
                        ยืนยันข้อเสนอ
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormalOfferRevisionMode(true)}
                        className="rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
                      >
                        ขอแก้ไขข้อเสนอ
                      </button>
                      <button
                        type="button"
                        onClick={sendBuyerCancelFormalOffer}
                        className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700"
                      >
                        ยกเลิกข้อเสนอ
                      </button>
                    </div>
                  )}

                  <p className="mt-3 text-xs text-slate-500">
                    เมื่อผู้ซื้อยืนยันข้อเสนอ ระบบจะเข้าสู่ขั้นตอนสร้างคำสั่งซื้ออย่างเป็นทางการ ก่อนเปิดข้อมูลขนส่งและขั้นตอนชำระเงิน
                  </p>
                </div>
              </div>
            ) : null}

            {shouldShowBuyerTermsActionCard ? (
              <div className="border-t border-blue-200 bg-blue-50 p-4">
                <div className="rounded-lg border border-blue-200 bg-white p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-blue-900">FarmLink Action Card สำหรับผู้ซื้อ</p>
                      <p className="mt-1 text-xs text-blue-700">
                        ผู้ขายส่งเงื่อนไขเบื้องต้นแล้ว กรุณาเลือกว่าจะยืนยันเงื่อนไข ขอแก้ไข หรือยกเลิกคำขอซื้อ
                      </p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                      เห็นเฉพาะผู้ซื้อ
                    </span>
                  </div>

                  {buyerRevisionMode ? (
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <label className="block text-xs font-medium text-slate-700">
                        เรื่องที่ต้องการแก้ไข
                        <select
                          value={buyerRevision.topic}
                          onChange={(event) => updateBuyerRevision("topic", event.target.value)}
                          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        >
                          <option>รอบการส่ง</option>
                          <option>ปริมาณ</option>
                          <option>ราคา</option>
                          <option>ค่าขนส่ง</option>
                          <option>วิธีขนส่ง</option>
                          <option>เอกสาร / หลักฐาน</option>
                          <option>อื่น ๆ</option>
                        </select>
                      </label>

                      <label className="block text-xs font-medium text-slate-700">
                        เงื่อนไขเดิม
                        <input
                          value={buyerRevision.currentTerms}
                          onChange={(event) => updateBuyerRevision("currentTerms", event.target.value)}
                          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                      </label>

                      <label className="block text-xs font-medium text-slate-700 md:col-span-2">
                        เงื่อนไขที่ต้องการ
                        <input
                          value={buyerRevision.requestedTerms}
                          onChange={(event) => updateBuyerRevision("requestedTerms", event.target.value)}
                          placeholder="เช่น ขอเปลี่ยนเป็นรอบส่งช่วงบ่าย 13:00-16:00"
                          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                      </label>

                      <label className="block text-xs font-medium text-slate-700 md:col-span-2">
                        หมายเหตุเพิ่มเติม
                        <textarea
                          value={buyerRevision.note}
                          onChange={(event) => updateBuyerRevision("note", event.target.value)}
                          placeholder="เช่น คลังสินค้ารับของได้หลังตรวจสต็อกช่วงเช้า"
                          className="mt-1 min-h-20 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                      </label>

                      <div className="md:col-span-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          onClick={() => setBuyerRevisionMode(false)}
                          className="rounded-md border border-[#DDE7E3] px-4 py-2 text-sm font-medium text-slate-700"
                        >
                          กลับ
                        </button>
                        <button
                          type="button"
                          onClick={sendBuyerRevisionRequest}
                          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                        >
                          ส่งคำขอแก้ไขให้ผู้ขาย
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 grid gap-2 sm:grid-cols-3">
                      <button
                        type="button"
                        onClick={sendBuyerAcceptTerms}
                        className="rounded-md bg-[#0F8A5F] px-4 py-2 text-sm font-medium text-white"
                      >
                        ยืนยันเงื่อนไข
                      </button>
                      <button
                        type="button"
                        onClick={() => setBuyerRevisionMode(true)}
                        className="rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
                      >
                        ขอแก้ไขเงื่อนไข
                      </button>
                      <button
                        type="button"
                        onClick={sendBuyerCancelRequest}
                        className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700"
                      >
                        ยกเลิกคำขอซื้อ
                      </button>
                    </div>
                  )}

                  <p className="mt-3 text-xs text-slate-500">
                    ข้อมูลที่เลือกจะถูกส่งเป็นข้อความในแชทเมื่อผู้ซื้อกดยืนยันเท่านั้น เพื่อให้ทุกฝ่ายตรวจสอบย้อนหลังได้
                  </p>
                </div>
              </div>
            ) : null}

            <form onSubmit={handleSend} className="border-t border-[#DDE7E3] bg-white p-4">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="พิมพ์ข้อความเกี่ยวกับปริมาณ ราคา ขนส่ง เอกสาร หรือวันส่งมอบ"
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="rounded-md bg-[#0F8A5F] px-5 py-2 text-sm font-medium text-white"
                >
                  ส่งข้อความ
                </button>
              </div>
            </form>
          </div>
        </div>

      </section>

      {selectedTradeDocument ? (
        <TradeDocumentModal
          document={selectedTradeDocument}
          relatedRequest={relatedRequest}
          relatedOrder={relatedOrder}
          onClose={() => setSelectedTradeDocument(null)}
        />
      ) : null}
    </div>
  );
}

function TradeDocumentModal({
  document,
  relatedRequest,
  relatedOrder,
  onClose,
}: {
  document: TradeDocumentSelection;
  relatedRequest?: PurchaseRequest;
  relatedOrder?: Order;
  onClose: () => void;
}) {
  const isPurchaseOrder = document.kind === "po";
  const buyerName =
    relatedOrder?.buyerName ||
    demoUsers.find((user) => user.id === relatedRequest?.buyerId)?.displayName ||
    "ผู้ซื้อ";
  const sellerName =
    relatedOrder?.sellerName ||
    demoUsers.find((user) => user.id === relatedRequest?.sellerId)?.displayName ||
    "ผู้ขาย";
  const productName = relatedOrder?.productName || relatedRequest?.productName || "-";
  const quantity = relatedOrder
    ? `${relatedOrder.quantity.toLocaleString("th-TH")} กก.`
    : relatedRequest
    ? `${relatedRequest.quantity.toLocaleString("th-TH")} ${relatedRequest.unit}`
    : "-";
  const priceLabel = relatedOrder
    ? `${relatedOrder.price.toLocaleString("th-TH")} บาท/กก.`
    : relatedRequest?.targetPrice || "-";
  const totalLabel =
    relatedOrder && relatedOrder.price > 0
      ? `${(relatedOrder.quantity * relatedOrder.price).toLocaleString("th-TH")} บาท`
      : "คำนวณตามข้อเสนอที่ตกลง";
  const deliveryDate = relatedOrder?.deliveryDate || relatedRequest?.deliveryDate || "-";
  const deliveryLocation = relatedRequest?.deliveryLocation || "ระบุในคำขอซื้อ / ข้อมูลขนส่ง";
  const status = relatedOrder?.status || "สร้างเอกสารแล้ว / รอดำเนินการขั้นต่อไป";
  const proofStatus = relatedOrder?.proofStatus || "รอผู้ขายอัปโหลดหลักฐานส่งมอบ";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 px-4 py-6">
      <section className="w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="border-b border-[#DDE7E3] px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#06603F]">
                {isPurchaseOrder ? "Purchase Order / ใบสั่งซื้อฝั่งผู้ซื้อ" : "Sales Order / ใบรับคำสั่งขายฝั่งผู้ขาย"}
              </p>
              <h2 className="mt-1 text-2xl font-bold text-[#0F172A]">{document.documentId}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {isPurchaseOrder
                  ? "เอกสารนี้ยืนยันข้อตกลงการซื้อจากฝั่งผู้ซื้อ"
                  : "เอกสารนี้ยืนยันข้อตกลงการขายและการจัดส่งจากฝั่งผู้ขาย"}
              </p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
              ปิด
            </button>
          </div>
        </div>

        <div className="space-y-5 p-6">
          <div className="rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] p-4">
            <p className="font-bold text-emerald-900">เอกสารคู่กันในดีลเดียวกัน</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded-md bg-white p-3">
                <p className="text-xs text-slate-500">PO ฝั่งผู้ซื้อ</p>
                <p className="font-bold text-[#0F172A]">{document.linkedPoId || relatedOrder?.id || "-"}</p>
              </div>
              <div className="rounded-md bg-white p-3">
                <p className="text-xs text-slate-500">SO ฝั่งผู้ขาย</p>
                <p className="font-bold text-[#0F172A]">
                  {document.linkedSoId || relatedOrder?.salesOrderId || relatedOrder?.id.replace("PO-", "SO-") || "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <DocumentInfoCard label="ผู้ซื้อ" value={buyerName} />
            <DocumentInfoCard label="ผู้ขาย" value={sellerName} />
            <DocumentInfoCard label="สินค้า" value={productName} />
            <DocumentInfoCard label="ปริมาณ" value={quantity} />
            <DocumentInfoCard label="ราคา / ช่วงราคา" value={priceLabel} />
            <DocumentInfoCard label="มูลค่าประมาณ" value={totalLabel} />
            <DocumentInfoCard label="วันส่งมอบ" value={deliveryDate} />
            <DocumentInfoCard label="สถานที่ส่งมอบ" value={deliveryLocation} />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-[#DDE7E3] p-4">
              <p className="text-sm text-slate-500">สถานะเอกสาร</p>
              <p className="mt-1 font-bold text-[#0F172A]">{status}</p>
            </div>
            <div className="rounded-lg border border-[#DDE7E3] p-4">
              <p className="text-sm text-slate-500">หลักฐานส่งมอบ</p>
              <p className="mt-1 font-bold text-[#0F172A]">{proofStatus}</p>
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            เอกสารนี้ใช้เพื่อบันทึกข้อตกลงใน FarmLink เท่านั้น การชำระเงิน การส่งมอบ หลักฐาน และการยืนยันรับสินค้า
            ควรดำเนินการผ่านระบบเพื่อให้ตรวจสอบย้อนหลังได้
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white"
            >
              ปิดเอกสาร
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function DocumentInfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#DDE7E3] p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-[#0F172A]">{value}</p>
    </div>
  );
}

function RequestsTable({
  requests,
  title,
  onOpenChat,
}: {
  requests: PurchaseRequest[];
  title: string;
  onOpenChat?: (request: PurchaseRequest) => void;
}) {
  return (
    <SectionCard title={title}>
      {requests.length === 0 ? (
        <EmptyHint text="ยังไม่มีคำขอซื้อ" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-[#DDE7E3] text-slate-500">
              <tr>
                <th className="py-3">สินค้า</th>
                <th>ปริมาณ</th>
                <th>พื้นที่รับสินค้า</th>
                <th>วันรับสินค้า</th>
                <th>ข้อเสนอ</th>
                <th>สถานะ</th>
                {onOpenChat ? <th>แชท</th> : null}
              </tr>
            </thead>
            <tbody>
              {requests.map((item) => (
                <tr key={item.id} className="border-b border-[#E7EFEA]">
                  <td className="py-3 font-medium text-[#0F172A]">{item.productName}</td>
                  <td>
                    {item.quantity} {item.unit}
                  </td>
                  <td>{item.deliveryLocation}</td>
                  <td>{item.deliveryDate}</td>
                  <td>{item.offers}</td>
                  <td>
                    <StatusBadge value={item.status} />
                  </td>
                  {onOpenChat ? (
                    <td>
                      <button
                        onClick={() => onOpenChat(item)}
                        disabled={!item.sellerId}
                        className="rounded-md bg-[#0F8A5F] px-3 py-1.5 text-xs font-medium text-white disabled:bg-slate-300"
                      >
                        เปิดแชท
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}

function OfferComparison({
  offers,
  acceptOffer,
  compact,
}: {
  offers: Offer[];
  acceptOffer: (offer: Offer) => void;
  compact?: boolean;
}) {
  return (
    <SectionCard title={compact ? "ข้อเสนอขายที่ต้องตัดสินใจ" : "เปรียบเทียบข้อเสนอขาย"}>
      {offers.length === 0 ? (
        <EmptyHint text="ยังไม่มีข้อเสนอขาย" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] text-left text-sm">
            <thead className="border-b border-[#DDE7E3] text-slate-500">
              <tr>
                <th className="py-3">ผู้ขาย/เกษตรกร</th>
                <th>พื้นที่</th>
                <th>ปริมาณ</th>
                <th>ราคา</th>
                <th>ส่งมอบ</th>
                <th>คะแนน</th>
                <th>ความเสี่ยง</th>
                <th>สถานะ</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((item) => (
                <tr key={item.id} className="border-b border-[#E7EFEA]">
                  <td className="py-3 font-medium text-[#0F172A]">{item.sellerName}</td>
                  <td>{item.area}</td>
                  <td>{item.quantity} กก.</td>
                  <td>{item.price} บาท/กก.</td>
                  <td>{item.deliveryDate}</td>
                  <td>{item.trustScore}</td>
                  <td>{item.risk}</td>
                  <td>
                    <StatusBadge value={item.status} />
                  </td>
                  <td>
                    <button
                      onClick={() => acceptOffer(item)}
                      className="rounded-md bg-slate-950 px-3 py-1.5 text-xs font-medium text-white disabled:bg-slate-300"
                      disabled={item.status === "ถูกเลือก" || item.status === "ไม่ถูกเลือก"}
                    >
                      เลือกข้อเสนอนี้
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}

function SellerOffersTable({
  offers,
  requests = [],
  onOpenChat,
}: {
  offers: Offer[];
  requests?: PurchaseRequest[];
  onOpenChat?: (request: PurchaseRequest) => void;
}) {
  return (
    <SectionCard title="ข้อเสนอขายของฉัน">
      {offers.length === 0 ? (
        <EmptyHint text="ยังไม่มีข้อเสนอขายของคุณ" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-[#DDE7E3] text-slate-500">
              <tr>
                <th className="py-3">เลขที่</th>
                <th>คำขอซื้อ</th>
                <th>ปริมาณ</th>
                <th>ราคา</th>
                <th>ส่งมอบ</th>
                <th>สถานะ</th>
                {onOpenChat ? <th>แชท</th> : null}
              </tr>
            </thead>
            <tbody>
              {offers.map((item) => {
                const relatedRequest = requests.find((request) => request.id === item.requestId);

                return (
                  <tr key={item.id} className="border-b border-[#E7EFEA]">
                    <td className="py-3 font-medium text-[#0F172A]">{item.id}</td>
                    <td>{item.requestId}</td>
                    <td>{item.quantity} กก.</td>
                    <td>{item.price} บาท/กก.</td>
                    <td>{item.deliveryDate}</td>
                    <td>
                      <StatusBadge value={item.status} />
                    </td>
                    {onOpenChat ? (
                      <td>
                        {relatedRequest ? (
                          <button
                            type="button"
                            onClick={() => onOpenChat(relatedRequest)}
                            className="rounded-md border border-[#DDE7E3] px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-[#F3F7F5]"
                          >
                            เปิดแชท
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">ไม่พบคำขอซื้อ</span>
                        )}
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}

function SellerAnnouncements({
  requests,
  submitDemoOffer,
  onOpenChat,
  compact,
}: {
  requests: PurchaseRequest[];
  submitDemoOffer: (requestId: string) => void;
  onOpenChat?: (request: PurchaseRequest) => void;
  compact?: boolean;
}) {
  return (
    <SectionCard title={compact ? "คำขอซื้อที่ต้องตอบกลับ" : "คำขอซื้อที่ได้รับ"}>
      {requests.length === 0 ? (
        <EmptyHint text="ยังไม่มีประกาศรับซื้อ" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {requests.map((item) => (
            <div key={item.id} className="rounded-lg border border-[#DDE7E3] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-[#0F172A]">{item.productName}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.quantity} {item.unit} / {item.deliveryDate}
                  </p>
                </div>
                <StatusBadge value={item.status} />
              </div>
              <p className="mt-3 text-sm text-slate-600">{item.deliveryLocation}</p>
              <p className="mt-2 text-sm text-slate-600">ช่วงราคา: {item.targetPrice}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => submitDemoOffer(item.id)}
                  className="rounded-md bg-[#0F8A5F] px-3 py-2 text-sm font-medium text-white"
                >
                  ส่งข้อเสนอขาย
                </button>
                {onOpenChat ? (
                  <button
                    onClick={() => onOpenChat(item)}
                    disabled={!item.sellerId}
                    className="rounded-md border border-[#DDE7E3] px-3 py-2 text-sm font-medium text-slate-700 disabled:text-slate-300"
                  >
                    ตอบแชท
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function OrdersTable({
  orders,
  confirmDelivery,
  currentUser,
  reviews = [],
  onReviewOrder,
  onOpenChat,
}: {
  orders: Order[];
  confirmDelivery?: (orderId: string) => void;
  currentUser?: User;
  reviews?: BuyerReview[];
  onReviewOrder?: (order: Order) => void;
  onOpenChat?: (order: Order) => void;
}) {
  return (
    <SectionCard title="คำสั่งซื้อ">
      {orders.length === 0 ? (
        <EmptyHint text="ยังไม่มีคำสั่งซื้อ" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="border-b border-[#DDE7E3] text-slate-500">
              <tr>
                <th className="py-3">เลขที่</th>
                <th>สินค้า</th>
                <th>ผู้ขาย</th>
                <th>ผู้ซื้อ</th>
                <th>ปริมาณ</th>
                <th>มูลค่า</th>
                <th>วันส่งมอบ</th>
                <th>หลักฐาน</th>
                <th>สถานะ</th>
                {onOpenChat ? <th>แชท</th> : null}
                {confirmDelivery ? <th>Action</th> : null}
              </tr>
            </thead>
            <tbody>
              {orders.map((item) => {
                const isCompleted =
                  item.status === "เสร็จสมบูรณ์" || item.proofStatus.includes("ผู้ซื้อยืนยันแล้ว");
                const hasReviewed =
                  currentUser?.role === "buyer" &&
                  reviews.some(
                    (review) =>
                      review.orderId === item.id &&
                      review.buyerId === currentUser.id &&
                      review.status !== "hidden"
                  );

                return (
                  <tr key={item.id} className="border-b border-[#E7EFEA]">
                    <td className="py-3 font-medium text-[#0F172A]">{item.id}</td>
                    <td>{item.productName}</td>
                    <td>{item.sellerName}</td>
                    <td>{item.buyerName}</td>
                    <td>{item.quantity} กก.</td>
                    <td>{(item.quantity * item.price).toLocaleString("th-TH")} บาท</td>
                    <td>{item.deliveryDate}</td>
                    <td>{item.proofStatus}</td>
                    <td>
                      <StatusBadge value={item.status} />
                    </td>
                    {onOpenChat ? (
                      <td>
                        <button
                          type="button"
                          onClick={() => onOpenChat(item)}
                          className="rounded-md border border-[#DDE7E3] px-3 py-1.5 text-xs font-medium text-slate-700"
                        >
                          เปิดแชท
                        </button>
                      </td>
                    ) : null}
                    {confirmDelivery ? (
                      <td>
                        {isCompleted ? (
                          hasReviewed ? (
                            <StatusBadge value="รีวิวแล้ว" />
                          ) : (
                            <button
                              type="button"
                              onClick={() => onReviewOrder?.(item)}
                              className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                            >
                              รีวิวสินค้า / ผู้ขาย
                            </button>
                          )
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              confirmDelivery(item.id);
                              onReviewOrder?.({
                                ...item,
                                status: "เสร็จสมบูรณ์",
                                proofStatus: "ผู้ซื้อยืนยันแล้ว",
                              });
                            }}
                            className="rounded-md bg-[#0F8A5F] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0B6F4A]"
                          >
                            ยืนยันรับสินค้า
                          </button>
                        )}
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}

function ReviewModal({
  order,
  onClose,
  onSubmit,
}: {
  order: Order;
  onClose: () => void;
  onSubmit: (form: ReviewFormState) => void;
}) {
  const [form, setForm] = useState<ReviewFormState>({
    qualityRating: 5,
    deliveryRating: 5,
    documentRating: 5,
    comment: "",
  });

  const updateRating = (key: keyof ReviewFormState, value: string) => {
    if (key === "comment") {
      setForm((current) => ({ ...current, comment: value }));
      return;
    }

    setForm((current) => ({
      ...current,
      [key]: Math.min(Math.max(Number(value) || 1, 1), 5),
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-slate-950/45 px-4 py-8">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A]">รีวิวสินค้าและผู้ขาย</h2>
            <p className="mt-1 text-sm text-slate-500">
              รีวิวนี้จะแสดงในหน้ารายละเอียดสินค้าโดยไม่เปิดเผยชื่อจริงของผู้ซื้อ
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
            ปิด
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <InfoBox label="คำสั่งซื้อ" value={order.id} />
          <InfoBox label="สินค้า" value={order.productName} />
          <InfoBox label="ผู้ขาย" value={order.sellerName} />
          <InfoBox label="วันส่งมอบ" value={order.deliveryDate} />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="block text-sm font-medium text-slate-700">
            คะแนนคุณภาพสินค้า
            <select
              value={form.qualityRating}
              onChange={(event) => updateRating("qualityRating", event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            >
              {[5, 4, 3, 2, 1].map((score) => (
                <option key={score} value={score}>{score}/5</option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            คะแนนการส่งมอบ
            <select
              value={form.deliveryRating}
              onChange={(event) => updateRating("deliveryRating", event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            >
              {[5, 4, 3, 2, 1].map((score) => (
                <option key={score} value={score}>{score}/5</option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            คะแนนเอกสาร
            <select
              value={form.documentRating}
              onChange={(event) => updateRating("documentRating", event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            >
              {[5, 4, 3, 2, 1].map((score) => (
                <option key={score} value={score}>{score}/5</option>
              ))}
            </select>
          </label>
        </div>

        <label className="mt-5 block text-sm font-medium text-slate-700">
          ความคิดเห็น
          <textarea
            value={form.comment}
            onChange={(event) => updateRating("comment", event.target.value)}
            rows={4}
            placeholder="เช่น สินค้าคุณภาพดี ส่งตรงเวลา เอกสารครบถ้วน"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
          />
        </label>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[#DDE7E3] px-4 py-2 text-sm font-medium text-slate-700"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="rounded-md bg-[#0F8A5F] px-4 py-2 text-sm font-medium text-white"
          >
            ส่งรีวิว
          </button>
        </div>
      </form>
    </div>
  );
}

function RiskTable({ risks }: { risks: RiskAlert[] }) {
  return (
    <SectionCard title="แจ้งเตือนความเสี่ยง">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-[#DDE7E3] text-slate-500">
            <tr>
              <th className="py-3">ประเภท</th>
              <th>รายการที่เกี่ยวข้อง</th>
              <th>คะแนน</th>
              <th>เหตุผล</th>
              <th>ระดับ</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {risks.map((item) => (
              <tr key={item.id} className="border-b border-[#E7EFEA]">
                <td className="py-3 font-medium text-[#0F172A]">{item.type}</td>
                <td>{item.relatedItem}</td>
                <td>{item.score}</td>
                <td>{item.reason}</td>
                <td>
                  <StatusBadge value={item.severity} />
                </td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

function AuditTable({ auditLogs }: { auditLogs: AuditLog[] }) {
  return (
    <SectionCard title="บันทึกการทำงาน">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-[#DDE7E3] text-slate-500">
            <tr>
              <th className="py-3">เวลา</th>
              <th>ผู้ทำรายการ</th>
              <th>บทบาท</th>
              <th>Action</th>
              <th>รายการ</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((item) => (
              <tr key={item.id} className="border-b border-[#E7EFEA]">
                <td className="py-3">{item.timestamp}</td>
                <td className="font-medium text-[#0F172A]">{item.actor}</td>
                <td>{item.role}</td>
                <td>{item.action}</td>
                <td>{item.item}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

export default App;
